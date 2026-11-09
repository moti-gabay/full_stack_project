import jwt from "jsonwebtoken";
import type { User } from "../types/types.ts";
import { readFile, writeFile } from "node:fs/promises";
import { config } from "../config.ts";

const JSON_PATH = "./db/users.json"
const JWT_SECRET = config.jwt_secret;

export async function signToken(user: User) {
    if (JWT_SECRET) {
        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { "expiresIn": "1d" })
        return token;
    }
    return -1
}


export async function verifyToken(token: string) {
    if (JWT_SECRET) {
        return jwt.verify(token, JWT_SECRET)
    }
    return -1
}

// export async function readJson() {
//     try {
//         const users = await readFile(JSON_PATH);
//         return JSON.parse(users)
//     } catch (err: any) {
//         throw new Error(err);
//     }
// }


// export async function writeToJson(users: User[]) {
//     try {
//         const data = JSON.stringify(users);
//         await writeFile(JSON_PATH, data);
//     } catch (err: any) {
//         throw new Error(err)
//     }

// }