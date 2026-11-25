import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server"
import { afterAll, beforeAll } from "vitest";

let memory: MongoMemoryServer | undefined;

process.env.JWT_SECRET_TEST ??= "test-secret123";


beforeAll(async () => {
    let base = process.env.MONGODB_URI_TEST || "mongodb://127.0.0.1:27017";
    if (!base) {
        memory = await MongoMemoryServer.create();
        base = memory.getUri();
    }
    await mongoose.connect(base, { dbName: `test-${crypto.randomUUID()}` });
    await Promise.all(Object.values(mongoose.models).map((model) => model.init()))
});

afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
    await memory?.stop()
})




