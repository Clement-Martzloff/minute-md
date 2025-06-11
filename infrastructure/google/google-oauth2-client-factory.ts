import { OAuth2Client } from "google-auth-library";

export interface GoogleOAuth2ClientFactoryConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}

export class GoogleOAuth2ClientFactory {
  private readonly config: GoogleOAuth2ClientFactoryConfig;

  constructor(config: GoogleOAuth2ClientFactoryConfig) {
    if (!config.clientId || !config.clientSecret || !config.redirectUri) {
      throw new Error(
        "GoogleOAuth2ClientFactory requires clientId, clientSecret, and redirectUri."
      );
    }
    this.config = config;
  }

  create(): OAuth2Client;
  create(accessToken: string): OAuth2Client;

  public create(accessToken?: string): OAuth2Client {
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
