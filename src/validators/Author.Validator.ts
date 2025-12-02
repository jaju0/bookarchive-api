import validator from "express-validator";

const minNameLength = process.env.AUTHOR_MIN_NAME_LENGTH ? +process.env.AUTHOR_MIN_NAME_LENGTH : 1;
const maxNameLength = process.env.AUTHOR_MAX_NAME_LENGTH ? +process.env.AUTHOR_MAX_NAME_LENGTH : 100;
const minBiographyLength = process.env.AUTHOR_MIN_BIOGRAPHY_LENGTH ? +process.env.AUTHOR_MIN_BIOGRAPHY_LENGTH : 1;
const maxBiographyLength = process.env.AUTHOR_MAX_BIOGRAPHY_LENGTH ? +process.env.AUTHOR_MAX_BIOGRAPHY_LENGTH : 100000;

export const creationRequestBody = () => {
    const errorMsgs = {
        name: `is required and its length must be between ${minNameLength} and ${maxNameLength}`,
        biography: `must have a length between ${minBiographyLength} and ${maxBiographyLength} if provided`,
        birth_date: `is required and must be in date format`,
        death_date: `must be in date format if provided`,
    };

    return [
        validator.body(["first_name", "last_name"], errorMsgs.name).trim().isLength({ min: minNameLength, max: maxNameLength }).escape(),
        validator.body("biography", errorMsgs.biography).optional().isLength({ min: minBiographyLength, max: maxBiographyLength }).escape(),
        validator.body("birth_date", errorMsgs.birth_date).isDate(),
        validator.body("death_date", errorMsgs.death_date).optional().isDate(),
    ];
};

export const requestParam = () => {
    const errorMsgs = {
        id: `is required`,
    };

    return [
        validator.param("id", errorMsgs.id).isMongoId(),
    ];
};

export const listRequestQuery = () => {
    const errorMsgs = {
        name: `its length must be between ${minNameLength} and ${maxNameLength} if provided`,
        birth_date: `must be in date format if provided`,
        death_date: `must be in date format if provided`,
        created_at_before: `must be in date format if provided`,
        limit: `must be an integer if provided`,
    };
    
    return [
        validator.query(["first_name", "last_name"], errorMsgs.name).optional().isLength({ min: minNameLength, max: maxBiographyLength }).escape(),
        validator.query("birth_date", errorMsgs.birth_date).optional().isDate(),
        validator.query("death_date", errorMsgs.death_date).optional().isDate(),
        validator.query("created_at_before", errorMsgs.created_at_before).optional().isISO8601(),
        validator.query("limit", errorMsgs.limit).optional().isInt(),
    ];
}

export const amendmentRequestBody = () => {
    const errorMsgs = {
        biography: `must have a length between ${minBiographyLength} and ${maxBiographyLength} if provided`,
        death_date: `must be in date format if provided`,
    };

    return [
        validator.oneOf([
            validator.body("biography", errorMsgs.biography).isLength({ min: minBiographyLength, max: maxBiographyLength }).escape(),
            validator.body("death_date", errorMsgs.death_date).isDate(),
        ]),
    ];
};