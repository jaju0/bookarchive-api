import { Router } from "express";
import * as authorController from "../controllers/Author.Controller.js";
import * as authorValidator from "../validators/Author.Validator.js";
import { validationError } from "../middleware/validationError.js";

export const authorsRouter = Router();

authorsRouter.route("/")
    .get(...authorValidator.listRequestQuery(), validationError, authorController.getAuthors)
    .post(...authorValidator.creationRequestBody(), validationError, authorController.createAuthor)
;

authorsRouter.route("/:id")
    .get(...authorValidator.requestParam(), validationError, authorController.getAuthor)
    .put(...authorValidator.requestParam(), ...authorValidator.amendmentRequestBody(), validationError, authorController.changeAuthor)
    .delete(...authorValidator.requestParam(), validationError, authorController.deleteAuthor)
;