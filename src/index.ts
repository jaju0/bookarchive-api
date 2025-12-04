import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();
import { connectDB } from "./config/connectDB.js";

const port = process.env.PORT || 3000;

const app = express();

app.use(cors());
app.use(express.json());

connectDB();
mongoose.connection.once("open", () => {
    console.log("book-archive api connected to MongoDB");
    app.listen(port, () => {
        console.log(`book-archive api listening on port ${port}`);
    });
});