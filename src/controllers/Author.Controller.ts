import { Request, Response } from "express";
import validator, { validationResult } from "express-validator";

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

export interface ResponseBody<IData>
{
    data?: IData;
    errors: validator.ValidationError[];
}

export interface AuthorCreationResponseData
{
    id: string;
    created_at: Date;
    updated_at: Date;
}

export const createAuthor = (req: Request<undefined, undefined, AuthorCreationRequestBody>, res: Response<ResponseBody<AuthorCreationResponseData>>) => {
    const result = validationResult(req);
    res.send({ errors: result.array() });
};

export const changeAuthor = (req: Request<AuthorRequestParam, undefined, AuthorAmendmentRequestBody>, res: Response) => {
    const result = validationResult(req);
    res.send({ errors: result.array() });
};

export const getAuthor = (req: Request<AuthorRequestParam>, res: Response) => {
    const result = validationResult(req);
    res.send({ errors: result.array() });
};

export const getAuthors = (req: Request<undefined, undefined, undefined, AuthorListRequestQuery>, res: Response) => {
    const result = validationResult(req);
    res.send({ errors: result.array() });
};

export const deleteAuthor = (req: Request<AuthorRequestParam>, res: Response) => {
    const result = validationResult(req);
    res.send({ errors: result.array() });
};