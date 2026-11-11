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

process.loadEnvFile();

const app = express();

const PORT = config.port || 3000;

app.use(express.json());
// app.use(logger);
// app.use(requestID)
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:3000',
    methods: 'GET,PUT,POST,DELETE',
    credentials: true
}))

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/tasks", taskRouter);

app.get('/', (req: Request, res: Response) => {
    res.json({ "msg": "holleo from ts server" })
});

app.listen(PORT, () => {
    console.log("setver is running on port", PORT);
})