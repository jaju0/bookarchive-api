import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { EnvironmentVariables } from "../config/env.js";

export const authenticateWithJWT = (req: Request, res: Response, next: NextFunction) => {
    try
    {
        const authHeader = req.headers["authorization"];
        const jwtToken = authHeader && authHeader.split(" ")[1];

        if(!jwtToken)
            return res.sendStatus(401);

        jwt.verify(jwtToken, EnvironmentVariables.jwtSecret, (error, decoded) => {
            if(error)
                return res.sendStatus(403);

            next();
        });
    }
    catch(error)
    {
        console.error(error);
        res.sendStatus(500);
    }
}