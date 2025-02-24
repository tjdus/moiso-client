import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { cookies } from "next/headers";
import { decodeJwt } from "jose";
import { login } from "../api/login";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    };
    accessToken: string;
    refreshToken: string;
  }
  interface User {
    id: string;
    accessToken: string;
    refreshToken: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user: string;
    accessToken: string;
    refreshToken: string;
  }
}

const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "default-credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const response = await login(
          credentials as { username: string; password: string }
        );

        if (
          !response.success ||
          !response.accessToken ||
          !response.refreshToken
        ) {
          return null;
        }
        const payload = decodeJwt(response.accessToken) as { user_id: string };

        if (!payload.user_id) {
          return null;
        }

        return {
          id: payload.user_id,
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 3,
  },
  pages: {
    signIn: "/login",
    signOut: "/logout",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user.id;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
      }
      return token;
    },
    async session({ session, token }) {
      if (session && token) {
        session.user.id = token.user;
        session.accessToken = token.accessToken;
      }
      return session;
    },
  },
};

export { authOptions };
