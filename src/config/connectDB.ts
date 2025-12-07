import mongoose from "mongoose";
import { EnvironmentVariables } from "./env.js";

export async function connectDB()
{
    try
    {
        await mongoose.connect(EnvironmentVariables.databaseURI);
    }
    catch(error)
    {
        console.error(error);
    }
}