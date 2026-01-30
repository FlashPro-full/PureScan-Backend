import axios, { AxiosInstance } from 'axios';

interface LWATokenResponse {
  access_token: string;
  refresh_token?: string;
  token_type: string;
  expires_in: number;
}

interface marketplaceResponse {
  payload: {
    marketplace: {
      id: string;
      countryCode: string;
      name: string;
      defaultCurrencyCode: string;
      defaultLanguageCode: string;
      domainName: string;
    };
    storeName: string;
    participation: {
      isParticipating: boolean;
      hasSuspendedListings: boolean;
    }
  }[];
}

const getIdentifiersTypeFromBarcode = (barcode: string): string => {
  const s = String(barcode || '').trim();
  const normalized = s.replace(/[- ]/g, '');
  const digitsOnly = s.replace(/\D/g, '');
  const len = digitsOnly.length;
  if (/^\d{9}[\dXx]$/.test(normalized)) return 'ISBN';
  if (len === 13) {
    const prefix = digitsOnly.slice(0, 3);
    if (prefix === '978' || prefix === '979') return 'ISBN';
    return 'EAN';
  }
  if (len === 12) return 'UPC';
  if (len === 8) return 'EAN';
  if (len >= 13) return 'EAN';
  if (len >= 8 && len <= 14) return 'GTIN';
  return 'UPC';
}


export class SPApiService {
  private client: AxiosInstance;
  private accessToken: string | null = null;
  private tokenExpiry: Date | null = null;
  private clientId: string;
  private clientSecret: string;
  private refreshToken: string;

  constructor(clientId: string, clientSecret: string, refreshToken: string) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.refreshToken = refreshToken;

    this.client = axios.create({
      baseURL: 'https://sellingpartnerapi-na.amazon.com',
      timeout: 30000,
    });

    this.client.interceptors.request.use(async (config) => {
      if (!this.accessToken || !this.tokenExpiry || new Date() >= this.tokenExpiry) {
        await this.refreshAccessToken();
      }
      if (this.accessToken) {
        config.headers['host'] = 'sellingpartnerapi-na.amazon.com';
        config.headers['x-amz-access-token'] = this.accessToken;
        config.headers['x-amz-date'] = new Date().toISOString();
        config.headers['user-agent'] = 'PureScan/1.0';
      }
      return config;
    });
  }

  private async refreshAccessToken(): Promise<void> {
    try {
      const clientId = this.clientId;
      const clientSecret = this.clientSecret;
      const refreshToken = this.refreshToken;

      if (!clientId || !clientSecret || !refreshToken) {
        throw new Error('SP-API credentials not configured');
      }

      const params = new URLSearchParams();
      params.append('grant_type', 'refresh_token');
      params.append('client_id', clientId);
      params.append('client_secret', clientSecret);
      params.append('refresh_token', refreshToken);

      const response = await axios.post<LWATokenResponse>(
        'https://api.amazon.com/auth/o2/token',
        params,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      this.accessToken = response.data.access_token;
      const expiryTime = new Date();
      expiryTime.setSeconds(expiryTime.getSeconds() + (response.data.expires_in - 300));
      this.tokenExpiry = expiryTime;
    } catch (error: any) {
      console.error('Failed to refresh SP-API token:', error.message);
      throw new Error('SP-API authentication failed');
    }
  }

  async getMarketplaceParticipations(): Promise<any[]> {
    try {
      const res = await this.client.get<marketplaceResponse>('sellers/v1/marketplaceParticipations');
      if (res?.data?.payload && Array.isArray(res.data.payload) && res.data.payload.length > 0) {
        return res.data.payload;
      }
      return [];
    } catch (error: any) {
      console.error('Failed to get market place ID:', error.message);
      throw new Error('Failed to get market place ID');
    }
  }

  async lookupProduct(barcode: string, marketplaceId: string = 'ATVPDKIKX0DER'): Promise<any> {
    try {
      const identifiersType = getIdentifiersTypeFromBarcode(barcode);
      const response = await this.client.get('/catalog/2022-04-01/items', {
        params: {
          marketplaceIds: marketplaceId,
          identifiers: barcode,
          identifiersType: identifiersType.toUpperCase(),
          includedData: 'attributes,productTypes,images,salesRanks',
        },
      });

      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }

  async getCompetitivePricing(asin: string, marketplaceId: string = 'ATVPDKIKX0DER'): Promise<any> {
    try {
      const response = await this.client.get('/products/pricing/v0/competitivePrice', {
        params: {
          MarketplaceId: marketplaceId,
          Asins: asin,
          ItemType: 'Asin'
        }
      });

      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }

}

