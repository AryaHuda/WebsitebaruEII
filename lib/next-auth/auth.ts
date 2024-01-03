import {NextAuthOptions} from "next-auth";
import Credentials from "next-auth/providers/credentials";
import {FireStoreUser, getUserByEmail} from "@/lib/firebase/db";
import {compare} from "bcryptjs";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: {label: "email", type: "text", placeholder: "email"},
        password: {
          label: "Password",
          type: "password",
          placeholder: "password",
        },
      },
      async authorize(credentials) {
        // check credentials to db
        try {
          const user: FireStoreUser = await getUserByEmail(credentials?.email as string);
          const comparedPassword = await compare(credentials?.password as string, user.password);
          if (comparedPassword) {
            return {
              id: user.email,
              name: user.name,
              email: user.email,
              role: user.role,
            };
          }
          return null;
        } catch (e) {
          return null
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({token, user, account, profile, isNewUser}: any) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({session, token, user}: any) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
    verifyRequest: "/auth/verify-request",
    newUser: "/auth/new-user",
  }
};