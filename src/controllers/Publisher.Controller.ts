import { Request, Response } from "express";
import { EnvironmentVariables } from "../config/env.js";
import { ResponseBody } from "../middleware/validationError.js";
import { Publisher } from "../models/Publisher.js";

export interface PublisherRequestParam
{
    id: string;
}

export interface PublisherListRequestQuery
{
    name?: string;
    address?: string;
    website?: string;
    created_at_before?: Date;
    limit?: number;
}

export interface PublisherCreationRequestBody
{
    name: string;
    address?: string;
    website?: string;
}

export interface PublisherAmendmentRequestBody
{
    address?: string;
    website?: string;
}

export interface PublisherResponseData
{
    id: string;
    name: string;
    address?: string;
    website?: string;
    created_at: Date;
    updated_at: Date;
}

export interface PublisherCreationResponseData
{
    id: string;
    created_at: Date;
}

export interface PublisherAmendmentResponseData
{
    id: string;
    updated_at: Date;
}

export interface PublisherDeletionResponseData
{
    id: string;
}


export const getPublisher = async (req: Request<PublisherRequestParam>, res: Response<ResponseBody<PublisherResponseData>>) => {
    try
    {
        const doc = await Publisher.findById(req.params.id);
        if(!doc)
            return res.sendStatus(404);

        res.send({
            data: {
                id: doc.id,
                name: doc.name,
                address: doc.address,
                website: doc.website,
                created_at: doc.createdAt,
                updated_at: doc.updatedAt,
            },
        });
    }
    catch(error)
    {
        console.error(error);
        res.sendStatus(500);
    }
};

export const getPublishers = async (req: Request<any, any, any, PublisherListRequestQuery>, res: Response<ResponseBody<PublisherResponseData[]>>) => {
    try
    {
        const limit = req.query.limit === undefined ? EnvironmentVariables.publisher.queryDefaultPageLimit : req.query.limit;

        const query = Publisher.find();

        // paging
        query.setOptions({ limit: limit });
        query.find({ createdAt: { $lt: req.query.created_at_before || new Date() } });

        // fields
        if(req.query.name)
            query.find({ name: req.query.name });
        if(req.query.address)
            query.find({ address: req.query.address });
        if(req.query.website)
            query.find({ website: req.query.website });

        const docs = await query.sort("-createdAt").exec();
        if(!docs.length)
            return res.sendStatus(404);

        const createdAtBefore = docs[docs.length-1].createdAt;

        res.send({
            data: docs.map(doc => <PublisherResponseData> {
                id: doc.id,
                name: doc.name,
                address: doc.address,
                website: doc.website,
                created_at: doc.createdAt,
                updated_at: doc.updatedAt,
            }),
            cursor: {
                created_at_before: createdAtBefore,
                limit: limit,
            },
        });
    }
    catch(error)
    {
        console.log(error);
        res.sendStatus(500);
    }
};

export const createPublisher = async (req: Request<any, any, PublisherCreationRequestBody>, res: Response<ResponseBody<PublisherCreationResponseData>>) => {
    try
    {
        const publisher = new Publisher();

        publisher.set("name", req.body.name);

        if(req.body.address)
            publisher.set("address", req.body.address);
        if(req.body.website)
            publisher.set("website", req.body.website);

        const doc = await publisher.save();

        res.send({
            data: {
                id: doc.id,
                created_at: doc.createdAt,
            },
        });
    }
    catch(error)
    {
        console.error(error);
        res.sendStatus(500);
    }
};

export const changePublisher = async (req: Request<PublisherRequestParam, any, PublisherAmendmentRequestBody>, res: Response<ResponseBody<PublisherAmendmentResponseData>>) => {
    try
    {
        const doc = await Publisher.findById(req.params.id);
        if(!doc)
            return res.sendStatus(404);

        if(req.body.address)
            doc.set("address", req.body.address);
        if(req.body.website)
            doc.set("website", req.body.website);

        await doc.save();

        res.send({
            data: <PublisherAmendmentResponseData> {
                id: doc.id,
                updated_at: doc.updatedAt,
            },
        });
    }
    catch(error)
    {
        console.error(error);
        res.sendStatus(500);
    }
};

export const deletePublisher = async (req: Request<PublisherRequestParam>, res: Response<ResponseBody<PublisherDeletionResponseData>>) => {
    try
    {
        const doc = await Publisher.findByIdAndDelete(req.params.id);
        if(!doc)
            return res.sendStatus(404);

        res.send({
            data: <PublisherDeletionResponseData> {
                id: doc.id,
            },
        });
    }
    catch(error)
    {
        console.error(error);
        res.sendStatus(500);
    }
};