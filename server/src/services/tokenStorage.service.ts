// This is a simple in-memory storage. In production, use a database

// Define the UserTwitterTokens type
export interface UserTwitterTokens {
  userId: string;
  accessToken: string;
  refreshToken?: string;
}

class TokenStorageService {
  private tokens: Map<string, UserTwitterTokens> = new Map();

  saveTokens(userId: string, accessToken: string, refreshToken?: string): void {
    this.tokens.set(userId, {
      userId,
      accessToken,
      refreshToken
    });
  }

  getTokens(userId: string): UserTwitterTokens | undefined {
    return this.tokens.get(userId);
  }

  removeTokens(userId: string): void {
    this.tokens.delete(userId);
  }
}

export const tokenStorage = new TokenStorageService();