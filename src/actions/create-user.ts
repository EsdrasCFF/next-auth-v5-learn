'use server'

import { FormSchema } from "@/app/page";
import { prisma } from "@/lib/prisma";
import { hash } from 'bcryptjs'

export async function createUser(data: FormSchema) {
  const hashedPassword = await hash(data.password, 10)
  const user = await prisma.user.create({
    data: {
      email: data.email,
      password: hashedPassword
    }
  })

  return user
}