import { app } from "./app.ts";
import "./db/db.ts";
import { config } from "./config.ts";


const PORT = config.port || 3001;




app.listen(PORT, () => {
    console.log("setver is running on port", PORT);
})