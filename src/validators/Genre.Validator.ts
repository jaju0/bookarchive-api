import validator from "express-validator";
import { EnvironmentVariables } from "../config/env.js";

export const requestParam = () => {
    const errorMsgs = {
        nameOrId: `is required and must be either id or name`,
    };

    return [
        validator.oneOf([
            validator.param("nameOrId").trim().isMongoId(),
            validator.param("nameOrId").trim().isLength({ min: EnvironmentVariables.genre.minNameLength, max: EnvironmentVariables.genre.maxNameLength }).escape(),
        ], {
            message: errorMsgs.nameOrId,
        }),
    ];
};

export const listRequestQuery = () => {
    const errorMsgs = {
        created_at_before: `must be in date format if provided`,
        limit: `must be an integer if provided`,
    };

    return [
        validator.query("created_at_before", errorMsgs.created_at_before).optional().isISO8601(),
        validator.query("limit", errorMsgs.limit).optional().isInt(),
    ];
};

export const creationRequestBody = () => {
    const errorMsgs = {
        name: `is required and its length must be between ${EnvironmentVariables.genre.minNameLength} and ${EnvironmentVariables.genre.maxNameLength}`,
        description: `length must be between ${EnvironmentVariables.genre.minDescriptionLength} and ${EnvironmentVariables.genre.maxDescriptionLength} if provided`,
    };

    return [
        validator.body("name", errorMsgs.name).trim().isLength({ min: EnvironmentVariables.genre.minNameLength, max: EnvironmentVariables.genre.maxNameLength }).escape(),
        validator.body("description", errorMsgs.description).isLength({ min: EnvironmentVariables.genre.minDescriptionLength, max: EnvironmentVariables.genre.maxDescriptionLength }).escape(),
    ];
};

export const amendmentRequestBody = () => {
    const errorMsgs = {
        description: `length must be between ${EnvironmentVariables.genre.minDescriptionLength} and ${EnvironmentVariables.genre.maxDescriptionLength} if provided`,
    };

    return [
        validator.oneOf([
            validator.body("description", errorMsgs.description).isLength({ min: EnvironmentVariables.genre.minDescriptionLength, max: EnvironmentVariables.genre.maxDescriptionLength }).escape(),
        ]),
    ];
};