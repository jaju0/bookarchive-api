import { Request, Response } from "express";
import { Author } from "../models/Author.js";
import { ResponseBody } from "../middleware/validationError.js";

export interface AuthorCreationRequestBody
{
    first_name: string;
    last_name: string;
    biography?: string;
    birth_date: Date;
    death_date?: Date;
}

export interface AuthorRequestParam
{
    id: string;
}

export interface AuthorListRequestQuery
{
    first_name?: string;
    last_name?: string;
    birth_date?: Date;
    death_date?: Date;
    page?: number;
    page_count?: number;
}

export interface AuthorAmendmentRequestBody
{
    biography?: string;
    death_date?: Date;
}

export interface AuthorCreationResponseData
{
    id: string;
    created_at: Date;
    updated_at: Date;
}

export const createAuthor = (req: Request<any, any, AuthorCreationRequestBody>, res: Response<ResponseBody<AuthorCreationResponseData>>) => {
    const author = new Author();
    author.set("first_name", req.body.first_name);
    author.set("last_name", req.body.last_name);
    author.set("birth_date", req.body.birth_date);

    if(req.body.biography)
        author.set("biography", req.body.biography);
    if(req.body.death_date)
        author.set("death_date", req.body.death_date);

    author.save().then((doc) => {
        res.send({
            data: {
                id: doc.id,
                created_at: doc.createdAt,
                updated_at: doc.updatedAt,
            },
            errors: [],
        });
    }).catch((error) => {
        console.error(error);
        res.sendStatus(500);
    });
};

export const changeAuthor = (req: Request<AuthorRequestParam, any, AuthorAmendmentRequestBody>, res: Response) => {
    res.sendStatus(200);
};

export const getAuthor = (req: Request<AuthorRequestParam>, res: Response) => {
    res.sendStatus(200);
};

export const getAuthors = (req: Request<any, any, any, AuthorListRequestQuery>, res: Response) => {
    res.sendStatus(200);
};

export const deleteAuthor = (req: Request<AuthorRequestParam>, res: Response) => {
    res.sendStatus(200);
};