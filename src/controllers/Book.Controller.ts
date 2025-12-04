import { Request, Response } from "express";
import { ResponseBody } from "../middleware/validationError.js";
import { LanguageCode } from "../utils/langCodes.js";
import { Book } from "../models/Book.js";
import { AuthorResponseData } from "./Author.Controller.js";
import { PublisherResponseData } from "./Publisher.Controller.js";
import { GenreResponseData } from "./Genre.Controller.js";
import { Author } from "../models/Author.js";
import { Publisher } from "../models/Publisher.js";
import { Genre } from "../models/Genre.js";
import mongoose from "mongoose";
import { FieldValidationError } from "express-validator";

export interface BookRequestParam
{
    idOrIsbn: string;
}

export interface BookListRequestQuery
{
    title?: string;
    author_id?: string;
    publisher_id?: string;
    genre_id?: string;
    publication_date?: Date;
    language?: LanguageCode;
    created_at_before?: Date;
    limit?: number;
}

export interface BookCreationRequestBody
{
    title: string;
    subtitle?: string;
    description?: string;
    isbn_10?: string;
    isbn_13?: string;
    author_id: string;
    publisher_id: string;
    publication_date: Date;
    genre_id: string;
    language: LanguageCode;
    page_count: number;
    cover_image_url?: string;
    stock_count: number;
}

export interface BookAmendmentRequestBody
{
    title?: string;
    subtitle?: string;
    description?: string;
    isbn_10?: string;
    isbn_13?: string;
    author_id?: string;
    publisher_id?: string;
    publication_date?: Date;
    genre_id?: string;
    language?: LanguageCode;
    page_count?: number;
    cover_image_url?: string;
    stock_count?: number;
}

export interface BookResponseData
{
    id: string;
    title: string;
    subtitle?: string;
    description?: string;
    isbn_10?: string;
    isbn_13?: string;
    author: AuthorResponseData;
    publisher: PublisherResponseData;
    publication_date: Date;
    genre: GenreResponseData;
    language: LanguageCode;
    page_count: number;
    cover_image_url?: string;
    stock_count: number;
    created_at: Date;
    updated_at: Date;
}

export interface BookResponseDataUnpopulated
{
    id: string;
    title: string;
    subtitle?: string;
    description?: string;
    isbn_10?: string;
    isbn_13?: string;
    author: string;
    publisher: string;
    publication_date: Date;
    genre: string;
    language: LanguageCode;
    page_count: number;
    cover_image_url?: string;
    stock_count: number;
    created_at: Date;
    updated_at: Date;
}

export interface BookCreationResponseData
{
    id: string;
    created_at: Date;
}

export interface BookAmendmentResponseData
{
    id: string;
    updated_at: Date;
}

export interface BookDeletionResponseData
{
    id: string;
}


const defaultPageLimit = process.env.BOOK_QUERY_DEFAULT_PAGE_LIMIT ? +process.env.BOOK_QUERY_DEFAULT_PAGE_LIMIT : 1000;


export const getBook = async (req: Request<BookRequestParam>, res: Response<ResponseBody<BookResponseData>>) => {
    try
    {
        const filter = {
            $or: [
                { _id: mongoose.isValidObjectId(req.params.idOrIsbn) ? req.params.idOrIsbn : undefined },
                { isbn_10: req.params.idOrIsbn.replace("-", "") },
                { isbn_13: req.params.idOrIsbn.replace("-", "") },
            ],
        };

        const doc = await Book
            .findOne(filter)
            .populate<{author: Author}>("author")
            .populate<{publisher: Publisher}>("publisher")
            .populate<{genre: Genre}>("genre")
            .exec()
        ;

        if(!doc)
            return res.sendStatus(404);

        const booksAuthor = <AuthorResponseData> {
            id: doc.author.id,
            first_name: doc.author.first_name,
            last_name: doc.author.last_name,
            biography: doc.author.biography,
            birth_date: doc.author.birth_date,
            death_date: doc.author.death_date,
            created_at: doc.author.createdAt,
            updated_at: doc.author.updatedAt,
        };

        const booksPublisher = <PublisherResponseData> {
            id: doc.publisher.id,
            name: doc.publisher.name,
            address: doc.publisher.address,
            website: doc.publisher.website,
            created_at: doc.publisher.createdAt,
            updated_at: doc.publisher.updatedAt,
        };

        const booksGenre = <GenreResponseData> {
            id: doc.genre.id,
            name: doc.genre.name,
            description: doc.genre.description,
            created_at: doc.genre.createdAt,
            updated_at: doc.genre.updatedAt,
        };

        res.send({
            data: {
                id: doc.id,
                title: doc.title,
                subtitle: doc.subtitle,
                description: doc.description,
                isbn_10: doc.isbn_10,
                isbn_13: doc.isbn_13,
                author: booksAuthor,
                publisher: booksPublisher,
                publication_date: doc.publication_date,
                genre: booksGenre,
                language: doc.language,
                page_count: doc.page_count,
                cover_image_url: doc.cover_image_url,
                stock_count: doc.stock_count,
                created_at: doc.createdAt,
                updated_at: doc.updatedAt,
            },
            errors: [],
        });
    }
    catch(error)
    {
        console.error(error);
        res.sendStatus(500);
    }
};

export const getBooks = async (req: Request<any, any, any, BookListRequestQuery>, res: Response<ResponseBody<BookResponseDataUnpopulated[]>>) => {
    try
    {
        const limit = req.query.limit === undefined ? defaultPageLimit : req.query.limit;

        const query = Book.find();

        // paging
        query.setOptions({ limit: limit });
        query.find({ createdAt: { $lt: req.query.created_at_before || new Date() } });

        // fields
        if(req.query.title)
            query.find({ title: req.query.title });
        if(req.query.author_id)
            query.find({ author: req.query.author_id })
        if(req.query.publisher_id)
            query.find({ publisher: req.query.publisher_id });
        if(req.query.genre_id)
            query.find({ genre: req.query.genre_id });
        if(req.query.publication_date)
            query.find({ publication_date: req.query.publication_date });
        if(req.query.language)
            query.find({ language: req.query.language });

        const docs = await query.sort("-createdAt").exec();

        if(!docs.length)
            return res.sendStatus(404);

        const createdAtBefore = docs[docs.length-1].createdAt;

        res.send({
            data: docs.map(doc => <BookResponseDataUnpopulated> {
                id: doc.id,
                title: doc.title,
                subtitle: doc.subtitle,
                description: doc.description,
                isbn_10: doc.isbn_10,
                isbn_13: doc.isbn_13,
                author: doc.author.toString(),
                publisher: doc.publisher.toString(),
                publication_date: doc.publication_date,
                genre: doc.genre.toString(),
                language: doc.language,
                page_count: doc.page_count,
                cover_image_url: doc.cover_image_url,
                stock_count: doc.stock_count,
                created_at: doc.createdAt,
                updated_at: doc.updatedAt,
            }),
            cursor: {
                created_at_before: createdAtBefore,
                limit: limit,
            },
            errors: [],
        })
    }
    catch(error)
    {
        console.error(error);
        res.sendStatus(500);
    }
};

export const createBook = async (req: Request<any, any, BookCreationRequestBody>, res: Response<ResponseBody<BookCreationResponseData>>) => {
    try
    {
        const book = new Book();

        book.set("title", req.body.title);
        book.set("author", req.body.author_id);
        book.set("publisher", req.body.publisher_id);
        book.set("publication_date", req.body.publication_date);
        book.set("genre", req.body.genre_id);
        book.set("language", req.body.language);
        book.set("page_count", req.body.page_count);
        book.set("stock_count", req.body.stock_count);

        if(req.body.subtitle)
            book.set("subtitle", req.body.subtitle);
        if(req.body.description)
            book.set("description", req.body.description);
        if(req.body.isbn_10)
            book.set("isbn_10", req.body.isbn_10.replace("-", ""));
        if(req.body.isbn_13)
            book.set("isbn_13", req.body.isbn_13.replace("-", ""));
        if(req.body.cover_image_url)
            book.set("cover_image_url", req.body.cover_image_url);

        await book.populate(["author", "publisher", "genre"]);
        const populationErrors = new Array<FieldValidationError>();

        const createFieldValidationErrorForPopulationFail = (params: { path: string, value: any, msg: string }) => <FieldValidationError> {
            type: "field",
            location: "body",
            ...params,
        };

        if(!book.author)
        {
            populationErrors.push(createFieldValidationErrorForPopulationFail({
                path: "author_id",
                value: req.body.author_id,
                msg: `an author with id ${req.body.author_id} does not exist`,
            }));
        }
        if(!book.publisher)
        {
            populationErrors.push(createFieldValidationErrorForPopulationFail({
                path: "publisher_id",
                value: req.body.author_id,
                msg: `a publisher with id ${req.body.publisher_id} does not exist`,
            }));
        }
        if(!book.genre)
        {
            populationErrors.push(createFieldValidationErrorForPopulationFail({
                path: "genre_id",
                value: req.body.genre_id,
                msg: `a genre with id ${req.body.genre_id} does not exist`,
            }));
        }

        if(populationErrors.length)
            return res.send({ errors: populationErrors });

        const doc = await book.save();

        res.send({
            data: {
                id: doc.id,
                created_at: doc.createdAt,
            },
            errors: [],
        });
    }
    catch(error)
    {
        console.error(error);
        res.sendStatus(500);
    }
};

export const changeBook = async (req: Request<BookRequestParam, any, BookAmendmentRequestBody>, res: Response<ResponseBody<BookAmendmentResponseData>>) => {
    try
    {
        const filter = {
            $or: [
                { _id: mongoose.isValidObjectId(req.params.idOrIsbn) ? req.params.idOrIsbn : undefined },
                { isbn_10: req.params.idOrIsbn.replace("-", "") },
                { isbn_13: req.params.idOrIsbn.replace("-", "") },
            ],
        };

        const doc = await Book.findOne(filter).exec();

        if(!doc)
            return res.sendStatus(404);


        // check populateable field changes
        const populationErrors = new Array<FieldValidationError>();

        const createFieldValidationErrorForPopulationFail = (params: { path: string, value: any, msg: string }) => <FieldValidationError> {
            type: "field",
            location: "body",
            ...params,
        };

        if(req.body.author_id && await Author.exists({ _id: req.body.author_id }))
        {
            populationErrors.push(createFieldValidationErrorForPopulationFail({
                path: "author_id",
                value: req.body.author_id,
                msg: `an author with id ${req.body.author_id} does not exist`
            }));
        }
        if(req.body.publisher_id && await Publisher.exists({ _id: req.body.publisher_id }))
        {
            populationErrors.push(createFieldValidationErrorForPopulationFail({
                path: "publisher_id",
                value: req.body.publisher_id,
                msg: `a publisher with id ${req.body.publisher_id} does not exist`,
            }));
        }
        if(req.body.genre_id && await Genre.exists({ _id: req.body.genre_id }))
        {
            populationErrors.push(createFieldValidationErrorForPopulationFail({
                path: "genre_id",
                value: req.body.genre_id,
                msg: `a genre with id ${req.body.genre_id} does not exist`
            }));
        }

        if(populationErrors.length)
        {
            return res.send({
                errors: populationErrors,
            });
        }


        if(req.body.title)
            doc.set("title", req.body.title);
        if(req.body.subtitle)
            doc.set("subtitle", req.body.subtitle)
        if(req.body.description)
            doc.set("description", req.body.description);
        if(req.body.isbn_10)
            doc.set("isbn_10", req.body.isbn_10.replace("-", ""));
        if(req.body.isbn_13)
            doc.set("isbn_13", req.body.isbn_13.replace("-", ""));
        if(req.body.author_id)
            doc.set("author", req.body.author_id);
        if(req.body.publisher_id)
            doc.set("publisher", req.body.publisher_id);
        if(req.body.publication_date)
            doc.set("publication_date", req.body.publication_date);
        if(req.body.genre_id)
            doc.set("genre", req.body.genre_id);
        if(req.body.language)
            doc.set("language", req.body.language);
        if(req.body.page_count)
            doc.set("page_count", req.body.page_count);
        if(req.body.cover_image_url)
            doc.set("cover_image_url", req.body.cover_image_url);
        if(req.body.stock_count)
            doc.set("stock_count", req.body.stock_count);

        await doc.save();

        res.send({
            data: {
                id: doc.id,
                updated_at: doc.updatedAt,
            },
            errors: [],
        });
        
    }
    catch(error)
    {
        console.error(error);
        res.sendStatus(500);
    }
};

export const deleteBook = async (req: Request<BookRequestParam>, res: Response<ResponseBody<BookDeletionResponseData>>) => {
    try
    {
        const filter = {
            $or: [
                { _id: mongoose.isValidObjectId(req.params.idOrIsbn) ? req.params.idOrIsbn : undefined },
                { isbn_10: req.params.idOrIsbn.replace("-", "") },
                { isbn_13: req.params.idOrIsbn.replace("-", "") },
            ],
        };

        const doc = await Book.findOneAndDelete(filter).exec();

        if(!doc)
            return res.sendStatus(404);

        res.send({
            data: { id: doc.id },
            errors: [],
        });
    }
    catch(error)
    {
        console.error(error);
        res.sendStatus(500);
    }
};