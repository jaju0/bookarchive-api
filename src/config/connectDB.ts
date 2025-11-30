import mongoose from "mongoose";

export async function connectDB()
{
    try
    {
        if(process.env.DATABASE_URI)
            await mongoose.connect(process.env.DATABASE_URI);
        else
            throw new Error("DATABASE_URI environment variable not set");
    }
    catch(error)
    {
        console.error(error);
    }
}