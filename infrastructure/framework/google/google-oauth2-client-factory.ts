import { OAuth2Client } from "google-auth-library";

export interface OAuth2ClientFactory {
  create(accessToken?: string): OAuth2Client;
}

interface FactoryConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}

export class GoogleOAuth2ClientFactory implements OAuth2ClientFactory {
  private readonly config: FactoryConfig;

  constructor(config: FactoryConfig) {
    if (!config.clientId || !config.clientSecret || !config.redirectUri) {
      throw new Error(
        "GoogleOAuth2ClientFactory requires clientId, clientSecret, and redirectUri."
      );
    }
    this.config = config;
  }

  public create(accessToken?: string) {
    const oauth2Client = new OAuth2Client(
      this.config.clientId,
      this.config.clientSecret,
      this.config.redirectUri
    );

    if (accessToken) {
      oauth2Client.setCredentials({ access_token: accessToken });
    }

    return oauth2Client;
  }
}
