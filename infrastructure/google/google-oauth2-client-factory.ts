import { OAuth2Client } from "google-auth-library";

export class GoogleOAuth2ClientFactory {
  static create(accessToken: string): OAuth2Client {
    const oauth2Client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    oauth2Client.setCredentials({ access_token: accessToken });

    return oauth2Client;
  }
}
