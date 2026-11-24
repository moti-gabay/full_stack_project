import { before, after } from "node:test";
import mongoose from "mongoose";

process.env.JWT_SECRET ??= "test-secret";

await mongoose.connect("mongodb://127.0.0.1:27017/test");
await mongoose.connection.dropDatabase();

before(async () => {
    await Promise.all(Object.values(mongoose.models).map((model) => model.init()))
});

after(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
})




