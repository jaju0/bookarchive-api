import mongoose from "mongoose";

export interface IAuthor extends mongoose.Document
{
    first_name: string;
    last_name: string;
    biography?: string;
    birth_date: Date;
    death_date?: Date;
    createdAt: Date;
    updatedAt: Date;
}

type AuthorModel = mongoose.Model<IAuthor>;

const authorSchema = new mongoose.Schema<IAuthor, AuthorModel>({
    first_name: {
        type: String,
        required: true,
        trim: true,
    },
    last_name: {
        type: String,
        required: true,
        trim: true,
    },
    biography: {
        type: String,
        required: false,
        trim: true,
    },
    birth_date: {
        type: Date,
        required: true,
    },
    death_date: {
        type: Date,
        required: false,
    },
});

authorSchema.set("timestamps", true);

export const Author = mongoose.model("Author", authorSchema);
export type Author = InstanceType<typeof Author>;