import mongoose from "mongoose";

export interface IGenre extends mongoose.Document
{
    name: string;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
}

type GenreModel = mongoose.Model<IGenre>;

const genreSchema = new mongoose.Schema<IGenre, GenreModel>({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: false,
        trim: true,
    },
});

genreSchema.set("timestamps", true);

export const Genre = mongoose.model("Genre", genreSchema);
export type Genre = InstanceType<typeof Genre>;