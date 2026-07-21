import { type createUserWithEmailAndPasswordInputType, createUserWithEmailAndPasswordInput, type generateUserTokenPayloadType, generateUserTokenPayload, type SigninUserWithEmailAndPasswordInputType, signinUserWithEmailAndPasswordInput } from './model'
import { db, eq } from "@repo/database"
import { usersTable } from "@repo/database/models/user"
import { randomBytes, createHmac } from "node:crypto"
import * as JWT from 'jsonwebtoken'
import { env } from "../env"


class UserService {

    private async getUserByEmail(email: string) {
        const user = await db.select().from(usersTable).where(eq(usersTable.email, email));
        if (!user || user.length === 0) {
            return null
        }
        return user[0];
    }

    private async generateUserToken(payload: generateUserTokenPayloadType) {
        const { id } = await generateUserTokenPayload.parseAsync(payload)
        const token = JWT.sign({ id }, env.JWT_SECRET)
        return { token };
    }

    public async createUserWithEmailAndPassword(payload: createUserWithEmailAndPasswordInputType) {
        const { fullName, email, password } = await createUserWithEmailAndPasswordInput.parseAsync(payload)

        // Check if user is already existing or not
        const existingUserWithEmail = await this.getUserByEmail(email)
        if (existingUserWithEmail) throw new Error(`User with email ${email} already exists`)

        // Calculate salt and hash
        const salt = randomBytes(16).toString('hex')
        const hash = createHmac('sha256', salt).update(password).digest('hex');

        // Create User in the DB
        const userInsertResult = await db.insert(usersTable).values({ email, fullName, password: hash, salt }).returning(
            {
                id: usersTable.id
            }
        )
        if (!userInsertResult || userInsertResult.length === 0 || !userInsertResult[0]?.id) throw new Error(`Something went wrong while creating a user.`)

        const userId = userInsertResult[0].id

        const { token } = await this.generateUserToken({ id: userId })

        return {
            id: userId,
            token
        }
    }

    public async signInUserWithEmailAndPassword(payload: SigninUserWithEmailAndPasswordInputType) {
        const { email, password } = await signinUserWithEmailAndPasswordInput.parseAsync(payload)

        const existingUser = await this.getUserByEmail(email)
        if (!existingUser) throw new Error(`User with email ${email} does not exist`)

        if (!existingUser.password || !existingUser.salt) {
            throw new Error(`Invalid Authentication method`)
        }

        const salt = existingUser.salt
        const hash = createHmac('sha256', salt).update(password).digest('hex')

        if (hash !== existingUser.password) {
            throw new Error(`Invalid address or password`)
        }

        const { token } = await this.generateUserToken({ id: existingUser.id })

        return {
            id: existingUser.id,
            token
        }
    }
}

export default UserService;