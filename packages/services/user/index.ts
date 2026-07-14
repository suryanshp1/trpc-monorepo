import { type createUserWithEmailAndPasswordInputType, createUserWithEmailAndPasswordInput } from './model'
import { db, eq } from "@repo/database"
import { usersTable } from "@repo/database/models/user"
import { randomBytes, createHmac } from "node:crypto"


class UserService {

    private async getUserByEmail(email: string) {
        const user = await db.select().from(usersTable).where(eq(usersTable.email, email));
        if (!user || user.length === 0) {
            return null
        }
        return user[0];
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

        return {
            id: userInsertResult[0].id
        }
    }
}

export default UserService;