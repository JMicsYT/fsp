// lib/auth.ts
import NextAuth, { type NextAuthOptions, type DefaultSession } from "next-auth"
import type { DefaultJWT } from "next-auth/jwt"
import CredentialsProvider from "next-auth/providers/credentials"

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string
      role: string
    } & DefaultSession["user"]
  }
}
declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    role?: string
  }
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  pages: { signIn: "/auth/login", error: "/auth/error" },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email:    { label: "Email",    type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
          {
            method:  "POST",
            headers: { "Content-Type": "application/json" },
            body:    JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          }
        )

        if (!res.ok) return null

        const data = await res.json()
        // Теперь data.user содержит нужный объект
        const u = data.user
        if (!u) return null

        return {
          id:    u.id,
          name:  u.name,
          email: u.email,
          role:  u.role,
          image: u.image || null,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub     = user.id
        token.name    = user.name
        token.email   = user.email
        token.picture = user.image!
        token.role    = user.role
      }
      return token
    },
    async session({ session, token }) {
      session.user.id    = token.sub as string
      session.user.name  = token.name as string
      session.user.email = token.email as string
      session.user.image = token.picture as string
      session.user.role  = token.role as string
      return session
    },
  },
  debug: process.env.NODE_ENV === "development",
}

export default NextAuth(authOptions)
