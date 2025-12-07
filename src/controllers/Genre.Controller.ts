import { Request, Response } from "express";
import { FieldValidationError } from "express-validator";
import { EnvironmentVariables } from "../config/env.js";
import { Genre } from "../models/Genre.js";
import { ResponseBody } from "../middleware/validationError.js";
import mongoose from "mongoose";

export interface GenreRequestParam
{
    nameOrId: string;
}

export interface GenreListRequestQuery
{
    created_at_before?: Date;
    limit?: number;
}

export interface GenreCreationRequestBody
{
    name: string;
    description?: string;
}

export interface GenreAmendmentRequestBody
{
    description?: string;
}

export interface GenreResponseData
{
    id: string;
    name: string;
    description?: string;
    updated_at: Date;
    created_at: Date;
}

export interface GenreCreationResponseData
{
    id: string;
    created_at: Date;
}

export interface GenreAmendmentResponseData
{
    id: string;
    updated_at: Date;
}

export interface GenreDeletionResponseData
{
    id: string;
}


export const getGenre = async (req: Request<GenreRequestParam>, res: Response<ResponseBody<GenreResponseData>>) => {
    try
    {
        const doc = await (mongoose.isValidObjectId(req.params.nameOrId) ?  Genre.findById(req.params.nameOrId) : Genre.findOne({ name: req.params.nameOrId }));
        if(!doc)
            return res.sendStatus(404);

        res.send({
            data: <GenreResponseData> {
                id: doc.id,
                name: doc.name,
                description: doc.description,
                updated_at: doc.updatedAt,
                created_at: doc.createdAt,
            },
            errors: [],
        });
    }
    catch(error)
    {
        console.error(error)
        res.sendStatus(500);
    }
};

export const getGenres = async (req: Request<any, any, any, GenreListRequestQuery>, res: Response<ResponseBody<GenreResponseData[]>>) => {
    try
    {
        const limit = req.query.limit === undefined ? EnvironmentVariables.genre.queryDefaultPageLimit : req.query.limit;

        const query = Genre.find();

        // paging
        query.setOptions({ limit: limit });
        query.find({ createdAt: { $lt: req.query.created_at_before || new Date() } });

        const docs = await query.sort("-createdAt").exec();
        if(!docs.length)
            return res.sendStatus(404);

        const createdAtBefore = docs[docs.length-1].createdAt;

        res.send({
            data: docs.map(doc => <GenreResponseData> {
                id: doc.id,
                name: doc.name,
                description: doc.description,
                created_at: doc.createdAt,
                updated_at: doc.updatedAt,
            }),
            cursor: {
                created_at_before: createdAtBefore,
                limit: limit,
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

export const createGenre = async (req: Request<any, any, GenreCreationRequestBody>, res: Response<ResponseBody<GenreCreationResponseData>>) => {
    try
    {
        const alreadyExists = await Genre.exists({ name: req.body.name });
        if(alreadyExists)
        {
            const error = <FieldValidationError> {
                type: "field",
                location: "body",
                path: "name",
                value: req.body.name,
                msg: `a genre with name ${req.body.name} already exists`,
            };

            return res.send({ errors: [ error ] });
        }

        const genre = new Genre();
        genre.set("name", req.body.name);
        
        if(req.body.description)
            genre.set("description", req.body.description);

        const doc = await genre.save();

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

export const changeGenre = async (req: Request<GenreRequestParam, any, GenreAmendmentRequestBody>, res: Response<ResponseBody<GenreAmendmentResponseData>>) => {
    try
    {
        const doc = await (mongoose.isValidObjectId(req.params.nameOrId) ?  Genre.findById(req.params.nameOrId) : Genre.findOne({ name: req.params.nameOrId }));
        if(!doc)
            return res.sendStatus(404);

        if(req.body.description)
            doc.set("description", req.body.description);

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

export const deleteGenre = async (req: Request<GenreRequestParam>, res: Response<ResponseBody<GenreDeletionResponseData>>) => {
    try
    {
        const doc = await (mongoose.isValidObjectId(req.params.nameOrId) ?  Genre.findByIdAndDelete(req.params.nameOrId) : Genre.findOneAndDelete({ name: req.params.nameOrId }));
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