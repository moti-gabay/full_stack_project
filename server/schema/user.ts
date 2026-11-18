import { z } from "zod";

export const roleSchema = z.enum(["user", "admin"]);

export type Role = z.infer<typeof roleSchema>;

export const registerSchema = z.object({
    name: z.string().trim().min(2, "Name must be at least 2 chars"),
    email: z.email().trim().toLowerCase().pipe(z.email("a valid email is required")),
    password: z.string().min(8, "Password must be at least 8 chars").max(20)
})

export const loginSchema = z.object({
    email: z.email().trim().toLowerCase().pipe(z.email("a valid email is required")),
    password: z.string().min(8, "Password must be at least 8 chars").max(20)
});

export const changeRoleSchema = z.object({ role: roleSchema })


