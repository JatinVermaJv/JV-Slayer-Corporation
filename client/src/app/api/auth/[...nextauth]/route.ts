import NextAuth from 'next-auth';
import CredentialProviders from 'next-auth/providers/credentials';
import TwitterProvider from 'next-auth/providers/twitter';
import { JWT } from 'next-auth/jwt';

const handler = NextAuth({
  pages: {
    signIn: '/login',
  },
  providers: [
    CredentialProviders({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials) return null;

        const response = await fetch('http://localhost:3001/api/user/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password
          })
        });

        if (!response.ok) return null;

        const user = await response.json();
        return user ? {
          id: user.id,
          name: user.name,
          email: user.email
        } : null;
      }
    }),
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID!,
      clientSecret: process.env.TWITTER_CLIENT_SECRET!,
      version: "2.0",
      authorization: {
        params: {
          scope: "tweet.read tweet.write users.read offline.access"
        }
      }
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24, // 1 day
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      // Redirect to Twitter page after Twitter login
      if (url.includes('twitter')) {
        return baseUrl + '/twitter';
      }
      return baseUrl + '/dashboard';
    },
    async jwt({ token, user, account }) {
      // Initial sign in
      if (account && user) {
        return {
          ...token,
          id: user.id,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          provider: account.provider,
          accessTokenExpires: account.expires_at ? account.expires_at * 1000 : 0,
        };
      }

      // Return previous token if the access token has not expired yet
      if (Date.now() < (token.accessTokenExpires as number || 0)) {
        return token;
      }

      // Access token has expired, try to update it
      if (token.provider === 'twitter' && token.refreshToken) {
        return await refreshAccessToken(token);
      }

      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id as string;
      session.accessToken = token.accessToken as string;
      session.refreshToken = token.refreshToken as string;
      return session;
    },
    async signIn({ user, account }) {
      if (account?.provider === "twitter") {
        console.log("Twitter user signed in:", user.name);
        // You can save the user to your database here if needed
        return true;
      }
      return true;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
});

// Function to refresh the access token
async function refreshAccessToken(token: JWT) {
  try {
    const url = "https://api.twitter.com/2/oauth2/token";
    
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(
          `${process.env.TWITTER_CLIENT_ID}:${process.env.TWITTER_CLIENT_SECRET}`
        ).toString("base64")}`,
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: token.refreshToken as string,
      }),
    });

    const refreshedTokens = await response.json();

    if (!response.ok) {
      throw refreshedTokens;
    }

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
      accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
    };
  } catch (error) {
    console.error("Error refreshing access token", error);
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

export { handler as GET, handler as POST };