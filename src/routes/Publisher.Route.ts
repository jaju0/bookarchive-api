import { request, Router } from "express";
import { validationError } from "../middleware/validationError.js";
import { amendmentRequestBody, creationRequestBody, listRequestQuery, requestParam } from "../validators/Publisher.Validator.js";
import { changePublisher, createPublisher, deletePublisher, getPublisher, getPublishers } from "../controllers/Publisher.Controller.js";

export const publisherRouter = Router();

publisherRouter.route("/")
    .post(...creationRequestBody(), validationError, createPublisher)
    .get(...listRequestQuery(), validationError, getPublishers);
;

publisherRouter.route("/:id")
    .get(...requestParam(), validationError, getPublisher)
    .put(...requestParam(), ...amendmentRequestBody(), validationError, changePublisher)
    .delete(...requestParam(), validationError, deletePublisher)
;