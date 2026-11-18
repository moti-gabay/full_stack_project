import type { User } from "./types.ts";



declare global {
    namespace Express {
        interface Request {
            cookies:string
            id: string;
            user?: User
        }
    }
}

export { }