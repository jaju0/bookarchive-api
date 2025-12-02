import validator from "express-validator";

const minNameLength = process.env.PUBLISHER_MIN_NAME_LENGTH ? +process.env.PUBLISHER_MIN_NAME_LENGTH : 1;
const maxNameLength = process.env.PUBLISHER_MAX_NAME_LENGTH ? +process.env.PUBLISHER_MAX_NAME_LENGTH : 100;
const minAddressLength = process.env.PUBLISHER_MIN_ADDRESS_LENGTH ? +process.env.PUBLISHER_MIN_ADDRESS_LENGTH : 1;
const maxAddressLength = process.env.PUBLISHER_MAX_ADDRESS_LENGTH ? +process.env.PUBLISHER_MAX_ADDRESS_LENGTH : 200;

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
        name: `must have a length between ${minNameLength} and ${maxNameLength} if provided`,
        address: `must have a length between ${minAddressLength} and ${maxAddressLength} if provided`,
        website: `must be a valid URL if provided`,
        created_at_before: `must be in date format if provided`,
        limit: `must be an integer if provided`,
    };

    return [
        validator.query("name", errorMsgs.name).optional().trim().isLength({ min: minAddressLength, max: maxAddressLength }).escape(),
        validator.query("address", errorMsgs.address).optional().trim().isLength({ min: minAddressLength, max: maxAddressLength }).escape(),
        validator.query("website", errorMsgs.website).optional().isURL(),
        validator.query("created_at_before", errorMsgs.created_at_before).optional().isDate(),
        validator.query("limit", errorMsgs.limit).optional().isInt(),
    ];
};

export const creationRequestBody = () => {
    const errorMsgs = {
        name: `is required and its length must be between ${minNameLength} and ${maxNameLength}`,
        address: `must have a length between ${minAddressLength} and ${maxAddressLength} if provided`,
        website: `must be a valid URL if provided`,
    };

    return [
        validator.body("name", errorMsgs.name).trim().isLength({ min: minNameLength, max: maxNameLength }).escape(),
        validator.body("address", errorMsgs.address).optional().trim().isLength({ min: minAddressLength, max: maxAddressLength }).escape(),
        validator.body("website", errorMsgs.website).optional().isURL(),
    ];
};

export const amendmentRequestBody = () => {
    const errorMsgs = {
        address: `must have a length between ${minAddressLength} and ${maxAddressLength} if provided`,
        website: `msut be a valid URL if provided`,
    };

    return [
        validator.body("address", errorMsgs.address).optional().trim().isLength({ min: minNameLength, max: maxNameLength }).escape(),
        validator.body("website", errorMsgs.website).optional().isURL(),
    ];
};