import { z } from "zod"

export const createUserWithEmailAndPasswordInput = z.object({
    fullName: z.string().describe('Full name of the user'),
    email: z.email().describe('Email of the user'),
    password: z.string().describe('Password of the user')
})

export type createUserWithEmailAndPasswordInputType = z.infer<typeof createUserWithEmailAndPasswordInput>

export const generateUserTokenPayload = z.object({
    id: z.string().describe('UUID of the user')
})

export type generateUserTokenPayloadType = z.infer<typeof generateUserTokenPayload>