import mongoose from "mongoose";
import * as langCodes from "../utils/langCodes.js";
import { LanguageCode } from "../utils/langCodes.js";

export interface IBook extends mongoose.Document
{
    title: string;
    subtitle?: string;
    description?: string;
    isbn_10?: string;
    isbn_13?: string;
    author: mongoose.Types.ObjectId;
    publisher: mongoose.Types.ObjectId;
    publication_date: Date;
    genre: mongoose.Types.ObjectId;
    language: LanguageCode;
    page_count: number;
    cover_image_url?: string;
    stock_count: number;
    createdAt: Date;
    updatedAt: Date;
}

type BookModel = mongoose.Model<IBook>;

const bookSchema = new mongoose.Schema<IBook, BookModel>({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    subtitle: {
        type: String,
        required: false,
        trim: true,
    },
    description: {
        type: String,
        required: false,
        trim: true,
    },
    isbn_10: {
        type: String,
        required: false,
        maxLength: 10,
        trim: true,
    },
    isbn_13: {
        type: String,
        required: false,
        maxLength: 13,
        trim: true,
    },
    author: {
        type: mongoose.Types.ObjectId,
        ref: "Author",
        required: true,
    },
    publisher: {
        type: mongoose.Types.ObjectId,
        ref: "Publisher",
        required: true,
    },
    publication_date: {
        type: Date,
        required: true,
    },
    genre: {
        type: mongoose.Types.ObjectId,
        ref: "Genre",
        required: true,
    },
    language: {
        type: String,
        required: true,
        enum: langCodes.getLangCodes(),
        trim: true,
    },
    page_count: {
        type: Number,
        required: true,
        min: 1,
    },
    cover_image_url: {
        type: String,
        required: false,
        trim: true,
    },
    stock_count: {
        type: Number,
        required: true,
        min: 0,
    },
});

bookSchema.set("timestamps", true);

export const Book = mongoose.model("Book", bookSchema);
export type Book = InstanceType<typeof Book>;