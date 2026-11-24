import express, { type Request, type Response } from "express";
import { userRouter } from "./routes/users.ts";
import { authRouter } from "./routes/auth.ts";
import cors from "cors"
import cookieParser from "cookie-parser"
import { config } from "./config.ts";
import "./db/db.ts";
import { logger } from "./middlewere/logger.ts";
import { requestID } from "./middlewere/requst-id.ts";
import { taskRouter } from "./routes/task.ts";
import { adminRouter } from "./routes/admin.ts";
import { requireAuth, requireRole } from "./middlewere/requireAuth.ts";
import { errorHandler, notFound } from "./middlewere/errorHadler.ts";

export const app = express();

const PORT = config.port || 3001;

app.use(express.json());
// app.use(logger);
// app.use(requestID)
app.use(cookieParser());
app.use(cors({
    // origin: "*",
    origin: ['http://localhost:3002', 'http://localhost:3000'],
    methods: 'GET,PUT,POST,DELETE',
    credentials: true
}));


app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/tasks", taskRouter);
app.use("/api/admin", requireAuth, requireRole("admin"), adminRouter);

app.use(notFound);
app.use(errorHandler);

app.get('/', (req: Request, res: Response) => {
    res.json({ "msg": "holleo from ts server" })
});

app.listen(PORT, () => {
    console.log("setver is running on port", PORT);
})