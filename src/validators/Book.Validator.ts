import validator from "express-validator";
import { EnvironmentVariables } from "../config/env.js";

export const requestParam = () => {
    const errorMsgs = {
        idOrIsbn: `is required`,
    };

    return [
        validator.oneOf([
            validator.param("idOrIsbn").isMongoId(),
            validator.param("idOrIsbn").isISBN(),
        ], {
            message: errorMsgs.idOrIsbn,
        }),
    ];
};

export const listRequestQuery = () => {
    const errorMsgs = {
        title: `length must be between ${EnvironmentVariables.book.minTitleLength} and ${EnvironmentVariables.book.maxTitleLength} if provided`,
        author_id: `optional`,
        publisher_id: `optional`,
        genre_id: `optional`,
        publication_date: `must be in date format if provided`,
        language: `must be an ISO 639-1 language code if provided`,
        created_at_before: `must be in date format if provided`,
        limit: `must be an integer if provided`,
    };

    return [
        validator.query("title", errorMsgs.title).optional().trim().isLength({ min: EnvironmentVariables.book.minTitleLength, max: EnvironmentVariables.book.maxTitleLength }).escape(),
        validator.query("author_id", errorMsgs.author_id).optional().isMongoId(),
        validator.query("publisher_id", errorMsgs.publisher_id).optional().isMongoId(),
        validator.query("genre_id", errorMsgs.genre_id).optional().isMongoId(),
        validator.query("publication_date", errorMsgs.publication_date).optional().isDate(),
        validator.query("language", errorMsgs.language).optional().isISO6391(),
        validator.query("created_at_before", errorMsgs.created_at_before).optional().isISO8601(),
        validator.query("limit", errorMsgs.limit).optional().isInt(),
    ];
};

export const creationRequestBody = () => {
    const errorMsgs = {
        title: `is required and its length must be between ${EnvironmentVariables.book.minTitleLength} and ${EnvironmentVariables.book.maxTitleLength}`,
        subtitle: `length must be between ${EnvironmentVariables.book.minSubtitleLength} and ${EnvironmentVariables.book.maxSubtitleLength} if provided`,
        description: `length must be between ${EnvironmentVariables.book.minDescriptionLength} and ${EnvironmentVariables.book.maxDescriptionLength} if provided`,
        isbn_10: `must be a valid isbn10 code if provided`,
        isbn_13: `must be a valid isbn13 code if provided`,
        author_id: `is required`,
        publisher_id: `is required`,
        publication_date: `is required and must be in date format`,
        genre_id: `is required`,
        language: `is required and must be an ISO 639-1 language code`,
        page_count: `is required and must be an integer with a minimum value of 1`,
        cover_image_url: `must be a valid url if provided`,
        stock_count: `is required and must be an unsigned integer`,
    };

    return [
        validator.body("title", errorMsgs.title).trim().isLength({ min: EnvironmentVariables.book.minTitleLength, max: EnvironmentVariables.book.maxTitleLength }).escape(),
        validator.body("subtitle", errorMsgs.subtitle).optional().trim().isLength({ min: EnvironmentVariables.book.minSubtitleLength, max: EnvironmentVariables.book.maxSubtitleLength }).escape(),
        validator.body("description", errorMsgs.description).optional().trim().isLength({ min: EnvironmentVariables.book.minDescriptionLength, max: EnvironmentVariables.book.maxDescriptionLength }).escape(),
        validator.oneOf([
            validator.body("isbn_10", errorMsgs.isbn_10).isISBN({ version: "10" }),
            validator.body("isbn_13", errorMsgs.isbn_13).isISBN({ version: "13" }),
        ]),
        validator.body("author_id", errorMsgs.author_id).isMongoId(),
        validator.body("publisher_id", errorMsgs.publisher_id).isMongoId(),
        validator.body("publication_date", errorMsgs.publication_date).isDate(),
        validator.body("genre_id", errorMsgs.genre_id).isMongoId(),
        validator.body("language", errorMsgs.language).isISO6391(),
        validator.body("page_count", errorMsgs.page_count).isInt({ min: 1 }),
        validator.body("cover_image_url", errorMsgs.cover_image_url).optional().isURL(),
        validator.body("stock_count", errorMsgs.stock_count).isInt({ min: 0 }),
    ];
};

export const amendmentRequestBody = () => {
    const errorMsgs = {
        title: `length must be between ${EnvironmentVariables.book.minTitleLength} and ${EnvironmentVariables.book.maxTitleLength} if provided`,
        subtitle: `length must be between ${EnvironmentVariables.book.minSubtitleLength} and ${EnvironmentVariables.book.maxSubtitleLength} if provided`,
        description: `length must be between ${EnvironmentVariables.book.minDescriptionLength} and ${EnvironmentVariables.book.maxDescriptionLength} if provided`,
        isbn_10: `must be a valid isbn10 code if provided`,
        isbn_13: `must be a valid isbn13 code if provided`,
        author_id: `optional`,
        publisher_id: `optional`,
        publication_date: `must be in date format if provided`,
        genre_id: `optional`,
        language: `must be an ISO 639-1 language code if provided`,
        page_count: `must be an integer with a minimum value of 1 if provided`,
        cover_image_url: `must be a valid url if provided`,
        stock_count: `must be an unsigned integer if provided`,
    };

    return [
        validator.oneOf([
            validator.body("title", errorMsgs.title).trim().isLength({ min: EnvironmentVariables.book.minTitleLength, max: EnvironmentVariables.book.maxTitleLength }).escape(),
            validator.body("subtitle", errorMsgs.subtitle).trim().isLength({ min: EnvironmentVariables.book.minSubtitleLength, max: EnvironmentVariables.book.maxSubtitleLength }).escape(),
            validator.body("description", errorMsgs.description).trim().isLength({ min: EnvironmentVariables.book.minDescriptionLength, max: EnvironmentVariables.book.maxDescriptionLength }).escape(),
            validator.body("isbn_10", errorMsgs.isbn_10).isISBN({ version: "10" }),
            validator.body("isbn_13", errorMsgs.isbn_13).isISBN({ version: "13" }),
            validator.body("author_id", errorMsgs.author_id).isMongoId(),
            validator.body("publisher_id", errorMsgs.publisher_id).isMongoId(),
            validator.body("publication_date", errorMsgs.publication_date).isDate(),
            validator.body("genre_id", errorMsgs.genre_id).isMongoId(),
            validator.body("language", errorMsgs.language).isISO6391(),
            validator.body("page_count", errorMsgs.page_count).isInt({ min: 1 }),
            validator.body("cover_image_url", errorMsgs.cover_image_url).isURL(),
            validator.body("stock_count", errorMsgs.stock_count).isInt({ min: 0 }),
        ], {
            message: "at least one valid field must be provided",
        }),
    ];
}