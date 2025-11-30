import { Router } from "express";
import * as authorController from "../controllers/Author.Controller.js";
import * as authorValidator from "../validators/Author.Validator.js";

export const authorsRouter = Router();

authorsRouter.route("/")
    .get(...authorValidator.listRequestQuery(), authorController.getAuthors)
    .post(...authorValidator.creationRequestBody(), authorController.createAuthor)
;

authorsRouter.route("/:id")
    .get(...authorValidator.requestParam(), authorController.getAuthor)
    .put(...authorValidator.requestParam(), ...authorValidator.amendmentRequestBody(), authorController.changeAuthor)
    .delete(...authorValidator.requestParam(), authorController.deleteAuthor)
;