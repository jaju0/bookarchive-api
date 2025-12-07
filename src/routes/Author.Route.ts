import { Router } from "express";
import * as authorController from "../controllers/Author.Controller.js";
import * as authorValidator from "../validators/Author.Validator.js";
import { validationError } from "../middleware/validationError.js";
import { authenticateWithJWT } from "../middleware/authenticateWithJWT.js";

export const authorsRouter = Router();

authorsRouter.route("/")
    .get(...authorValidator.listRequestQuery(), validationError, authorController.getAuthors)
    .post(authenticateWithJWT, ...authorValidator.creationRequestBody(), validationError, authorController.createAuthor)
;

authorsRouter.route("/:id")
    .get(...authorValidator.requestParam(), validationError, authorController.getAuthor)
    .put(authenticateWithJWT, ...authorValidator.requestParam(), ...authorValidator.amendmentRequestBody(), validationError, authorController.changeAuthor)
    .delete(authenticateWithJWT, ...authorValidator.requestParam(), validationError, authorController.deleteAuthor)
;