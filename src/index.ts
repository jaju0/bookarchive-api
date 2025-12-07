import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { EnvironmentVariables } from "./config/env.js";
import { setupRateLimiter } from "./config/setupRateLimiter.js";
import { connectDB } from "./config/connectDB.js";
import { authorsRouter } from "./routes/Author.Route.js";
import { publisherRouter } from "./routes/Publisher.Route.js";
import { genreRouter } from "./routes/Genre.Route.js";
import { all404 } from "./controllers/404.Controller.js";
import { bookRouter } from "./routes/Book.Route.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(setupRateLimiter());

app.use("/authors", authorsRouter);
app.use("/publishers", publisherRouter);
app.use("/genres", genreRouter);
app.use("/books", bookRouter);
app.all("*splat", all404);

connectDB();
mongoose.connection.once("open", () => {
    console.log("book-archive api connected to MongoDB");
    app.listen(EnvironmentVariables.port, () => {
        console.log(`book-archive api listening on port ${EnvironmentVariables.port}`);
    });
});