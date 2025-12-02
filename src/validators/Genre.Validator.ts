import validator from "express-validator";

const minNameLength = process.env.GENRE_MIN_NAME_LENGTH ? +process.env.GENRE_MIN_NAME_LENGTH : 1;
const maxNameLength = process.env.GENRE_MAX_NAME_LENGTH ? +process.env.GENRE_MAX_NAME_LENGTH : 100;
const minDescriptionLength = process.env.GENRE_MIN_DESCRIPTION_LENGTH ? +process.env.GENRE_MIN_DESCRIPTION_LENGTH : 1;
const maxDescriptionLength = process.env.GENRE_MAX_DESCRIPTION_LENGTH ? +process.env.GENRE_MAX_DESCRIPTION_LENGTH : 100000;

export const requestParam = () => {
    const errorMsgs = {
        nameOrId: `is required and must be either id or name`,
    };

    return [
        validator.oneOf([
            validator.param("nameOrId").trim().isMongoId(),
            validator.param("nameOrId").trim().isLength({ min: minNameLength, max: maxNameLength }).escape(),
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
        name: `is required and its length must be between ${minNameLength} and ${maxNameLength}`,
        description: `length must be between ${minDescriptionLength} and ${maxDescriptionLength} if provided`,
    };

    return [
        validator.body("name", errorMsgs.name).trim().isLength({ min: minNameLength, max: maxNameLength }).escape(),
        validator.body("description", errorMsgs.description).isLength({ min: minDescriptionLength, max: maxDescriptionLength }).escape(),
    ];
};

export const amendmentRequestBody = () => {
    const errorMsgs = {
        description: `length must be between ${minDescriptionLength} and ${maxDescriptionLength} if provided`,
    };

    return [
        validator.oneOf([
            validator.body("description", errorMsgs.description).isLength({ min: minDescriptionLength, max: maxDescriptionLength }).escape(),
        ]),
    ];
};