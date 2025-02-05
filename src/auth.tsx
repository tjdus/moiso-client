import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { cookies } from "next/headers";
import { decodeJwt } from "jose";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    };
  }
  interface User {
    id: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user: string;
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
        console.log("au");
        const response = await fetch(
          `http://${process.env.API_BASE_URL}/api/login/`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(credentials),
          }
        );
        console.log(response);

        if (!response.ok) return null;

        const result: {
          success: boolean;
          accessToken: string | null;
        } = await response.json();

        if (!result.success || !result.accessToken) return null;

        const payload: { user: string } = decodeJwt(result.accessToken);

        return {
          id: payload.user,
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
    async jwt({ token, account }) {
      if (account && account.providerAccountId) {
        token.user = account.providerAccountId;
      }
      return token;
    },
    async session({ session, token }) {
      if (session && token) {
        session.user.id = token.user;
      }
      return session;
    },
  },
};

export { authOptions };
