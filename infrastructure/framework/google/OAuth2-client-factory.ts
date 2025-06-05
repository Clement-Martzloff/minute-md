import { OAuth2Client } from "google-auth-library";

export class OAuth2ClientFactory {
  /**
   * Creates and configures an OAuth2Client instance.
   * @param accessToken The Google access token.
   * @returns A configured OAuth2Client instance.
   */
  static create(accessToken: string): OAuth2Client {
    const oauth2Client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID, // Your Google Client ID
      process.env.GOOGLE_CLIENT_SECRET, // Your Google Client Secret
      process.env.GOOGLE_REDIRECT_URI // Your Google Redirect URI
    );

    oauth2Client.setCredentials({
      access_token: accessToken,
      // refreshToken is not available here, and expiry_date is not strictly needed for just the access token
    });

    return oauth2Client;
  }
}
