import axios, { AxiosInstance } from 'axios';

interface LWATokenResponse {
  access_token: string;
  refresh_token?: string;
  token_type: string;
  expires_in: number;
}

export class SPApiService {
  private client: AxiosInstance;
  private accessToken: string | null = null;
  private tokenExpiry: Date | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: 'https://sellingpartnerapi-na.amazon.com',
      timeout: 30000,
    });

    this.client.interceptors.request.use(async (config) => {
      if (!this.accessToken || !this.tokenExpiry || new Date() >= this.tokenExpiry) {
        await this.refreshAccessToken();
      }
      if (this.accessToken) {
        config.headers['x-amz-access-token'] = this.accessToken;
      }
      return config;
    });
  }

  private async refreshAccessToken(): Promise<void> {
    try {
      const clientId = process.env.SP_API_CLIENT_ID;
      const clientSecret = process.env.SP_API_CLIENT_SECRET;
      const refreshToken = process.env.SP_API_REFRESH_TOKEN;

      if (!clientId || !clientSecret) {
        throw new Error('SP-API credentials not configured');
      }

      const params = new URLSearchParams();
      params.append('grant_type', refreshToken ? 'refresh_token' : 'client_credentials');
      params.append('client_id', clientId);
      params.append('client_secret', clientSecret);
      if (refreshToken) {
        params.append('refresh_token', refreshToken);
      }

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

  async lookupProduct(barcode: string, marketplaceId: string = 'ATVPDKIKX0DER'): Promise<any> {
    try {
      const response = await this.client.get('/catalog/2022-04-01/items', {
        params: {
          marketplaceIds: marketplaceId,
          identifiers: barcode,
          identifiersType: 'UPC',
          includedData: 'attributes,dimensions,identifiers,images,productTypes,salesRanks',
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

  async getPricing(asin: string, marketplaceId: string = 'ATVPDKIKX0DER'): Promise<any> {
    try {
      const response = await this.client.get('/products/pricing/v0/price', {
        params: {
          MarketplaceId: marketplaceId,
          Asins: [asin],
          ItemType: 'Asin',
        },
      });

      return response.data;
    } catch (error: any) {
      console.error('Failed to get pricing:', error.message);
      return null;
    }
  }
}

export const spApiService = new SPApiService();

