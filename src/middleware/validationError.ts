import { NextFunction, Request, Response } from "express";
import validator, { validationResult } from "express-validator";

export interface ResponseBody<IData>
{
    data?: IData;
    errors: validator.ValidationError[];
}

export const validationError = (req: Request, res: Response<ResponseBody<any>>, next: NextFunction) => {
    const result = validationResult(req);
    if(result.isEmpty())
        return next();

    return res.send({
        errors: result.array(),
    });
}