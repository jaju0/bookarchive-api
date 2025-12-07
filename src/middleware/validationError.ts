import { NextFunction, Request, Response } from "express";
import validator, { validationResult } from "express-validator";

export interface Cursor
{
    created_at_before: Date;
    limit: number;
}

export interface ResponseBody<IData>
{
    data: IData;
    cursor?: Cursor;
}

export interface ErrorResponseBody
{
    errors: validator.ValidationError[];
}

export const validationError = (req: Request, res: Response<ErrorResponseBody>, next: NextFunction) => {
    const result = validationResult(req);
    if(result.isEmpty())
        return next();

    return res.status(400).send({
        errors: result.array(),
    });
}