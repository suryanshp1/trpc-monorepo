import { z } from "zod"

export const createUserWithEmailAndPasswordInputModel = z.object({
    fullName: z.string().describe("Enter your fullname"),
    email: z.email().describe("Enter your email"),
    password: z.string().min(6).describe("Enter your password")
}).describe("User with email and password")

export const createUserWithEmailAndPasswordOutputModel = z.object({
    id: z.string().describe("User id"),
}).describe("Successfully created user")