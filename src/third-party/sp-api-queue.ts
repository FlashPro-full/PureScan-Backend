const DEFAULT_MIN_DELAY_MS = 600;
const DEFAULT_429_MAX_RETRIES = 4;
const DEFAULT_429_INITIAL_BACKOFF_MS = 1000;

let lastRequestFinishTime = 0;
const queue: Array<() => void> = [];

function processQueue(): void {
  if (queue.length === 0) return;
  const minDelay = Number(process.env.SP_API_THROTTLE_DELAY_MS) || DEFAULT_MIN_DELAY_MS;
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestFinishTime;
  const delay = Math.max(0, minDelay - timeSinceLastRequest);
  const runNext = queue.shift()!;
  if (delay > 0) {
    setTimeout(runNext, delay);
  } else {
    runNext();
  }
}

export function withSpApiThrottle<T>(fn: () => Promise<T>): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const run = () => {
      fn()
        .then((result) => {
          lastRequestFinishTime = Date.now();
          resolve(result);
          processQueue();
        })
        .catch((err) => {
          lastRequestFinishTime = Date.now();
          reject(err);
          processQueue();
        });
    };
    queue.push(run);
    if (queue.length === 1) {
      run();
    }
  });
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

export async function with429Retry<T>(
  fn: () => Promise<T>,
  options: {
    maxRetries?: number;
    initialBackoffMs?: number;
  } = {}
): Promise<T> {
  const maxRetries = options.maxRetries ?? DEFAULT_429_MAX_RETRIES;
  const initialBackoffMs = options.initialBackoffMs ?? DEFAULT_429_INITIAL_BACKOFF_MS;
  let lastError: any;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err: any) {
      lastError = err;
      const status = err?.response?.status;
      if (status !== 429 || attempt === maxRetries) {
        throw err;
      }
      const retryAfter = err?.response?.headers?.['retry-after'];
      const waitMs =
        typeof retryAfter === 'string' && /^\d+$/.test(retryAfter)
          ? parseInt(retryAfter, 10) * 1000
          : initialBackoffMs * Math.pow(2, attempt);
      console.warn(
        `SP-API 429 throttled (attempt ${attempt + 1}/${maxRetries + 1}), retrying in ${waitMs}ms`
      );
      await sleep(waitMs);
    }
  }
  throw lastError;
}
