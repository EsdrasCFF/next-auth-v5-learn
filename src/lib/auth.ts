import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "./prisma"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import Resend from "next-auth/providers/resend"
import { compare } from "bcryptjs"
 
 
export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google,
    Resend({
      apiKey: process.env.AUTH_RESEND_KEY as string,
      from: "onboarding@resend.dev"
    }), 
    Credentials({
      credentials: {
        email: { label: "Email", type: 'email' },
        password: { label: "Password", type: "password" },
      },
      async authorize({ email, password }) {
        
        if(!email || !password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: {email: email as string}
        })

        if(!user || !user.password) {
          return null
        }

        const matchedPassword = await compare(String(password), user.password)

        if(!matchedPassword) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name
        }
      },
    })],
  session: {
    strategy: 'jwt'
  }
})