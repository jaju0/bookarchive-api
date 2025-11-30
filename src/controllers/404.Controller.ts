import { Request, Response } from "express";

export const all404 = (req: Request, res: Response) => {
    res.sendStatus(404);
};