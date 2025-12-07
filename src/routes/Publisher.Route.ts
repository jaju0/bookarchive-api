import { Router } from "express";
import { validationError } from "../middleware/validationError.js";
import { amendmentRequestBody, creationRequestBody, listRequestQuery, requestParam } from "../validators/Publisher.Validator.js";
import { changePublisher, createPublisher, deletePublisher, getPublisher, getPublishers } from "../controllers/Publisher.Controller.js";
import { authenticateWithJWT } from "../middleware/authenticateWithJWT.js";

export const publisherRouter = Router();

publisherRouter.route("/")
    .get(...listRequestQuery(), validationError, getPublishers)
    .post(authenticateWithJWT, ...creationRequestBody(), validationError, createPublisher)
;

publisherRouter.route("/:id")
    .get(...requestParam(), validationError, getPublisher)
    .put(authenticateWithJWT, ...requestParam(), ...amendmentRequestBody(), validationError, changePublisher)
    .delete(authenticateWithJWT, ...requestParam(), validationError, deletePublisher)
;