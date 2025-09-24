import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";
import http from "http";

dotenv.config({ path: "./.env" }); 

const server = http.createServer(app);

server.timeout = 10 * 60 * 1000;

connectDB()
    .then(() => {
        server.listen(process.env.PORT || 8000, () => {
            console.log(`Listening on port : ${process.env.PORT || 8000}`);
        });
    })
    .catch((error) => {
        console.log("MongoDB connection failed!!");
        throw error;
    });
