import validator from "express-validator";
import { EnvironmentVariables } from "../config/env.js";

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
        name: `must have a length between ${EnvironmentVariables.publisher.minNameLength} and ${EnvironmentVariables.publisher.maxNameLength} if provided`,
        address: `must have a length between ${EnvironmentVariables.publisher.minAddressLength} and ${EnvironmentVariables.publisher.maxAddressLength} if provided`,
        website: `must be a valid URL if provided`,
        created_at_before: `must be in date format if provided`,
        limit: `must be an integer if provided`,
    };

    return [
        validator.query("name", errorMsgs.name).optional().trim().isLength({ min: EnvironmentVariables.publisher.minAddressLength, max: EnvironmentVariables.publisher.maxAddressLength }).escape(),
        validator.query("address", errorMsgs.address).optional().trim().isLength({ min: EnvironmentVariables.publisher.minAddressLength, max: EnvironmentVariables.publisher.maxAddressLength }).escape(),
        validator.query("website", errorMsgs.website).optional().isURL(),
        validator.query("created_at_before", errorMsgs.created_at_before).optional().isISO8601(),
        validator.query("limit", errorMsgs.limit).optional().isInt(),
    ];
};

export const creationRequestBody = () => {
    const errorMsgs = {
        name: `is required and its length must be between ${EnvironmentVariables.publisher.minNameLength} and ${EnvironmentVariables.publisher.maxNameLength}`,
        address: `must have a length between ${EnvironmentVariables.publisher.minAddressLength} and ${EnvironmentVariables.publisher.maxAddressLength} if provided`,
        website: `must be a valid URL if provided`,
    };

    return [
        validator.body("name", errorMsgs.name).trim().isLength({ min: EnvironmentVariables.publisher.minNameLength, max: EnvironmentVariables.publisher.maxNameLength }).escape(),
        validator.body("address", errorMsgs.address).optional().trim().isLength({ min: EnvironmentVariables.publisher.minAddressLength, max: EnvironmentVariables.publisher.maxAddressLength }).escape(),
        validator.body("website", errorMsgs.website).optional().isURL(),
    ];
};

export const amendmentRequestBody = () => {
    const errorMsgs = {
        address: `must have a length between ${EnvironmentVariables.publisher.minAddressLength} and ${EnvironmentVariables.publisher.maxAddressLength} if provided`,
        website: `msut be a valid URL if provided`,
    };

    return [
        validator.oneOf([
            validator.body("address", errorMsgs.address).trim().isLength({ min: EnvironmentVariables.publisher.minNameLength, max: EnvironmentVariables.publisher.maxNameLength }).escape(),
            validator.body("website", errorMsgs.website).isURL(),
        ]),
    ];
};