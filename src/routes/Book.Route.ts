import { Router } from "express";
import { amendmentRequestBody, creationRequestBody, listRequestQuery, requestParam } from "../validators/Book.Validator.js";
import { validationError } from "../middleware/validationError.js";
import { changeBook, createBook, deleteBook, getBook, getBooks } from "../controllers/Book.Controller.js";

export const bookRouter = Router();

bookRouter.route("/")
    .get(...listRequestQuery(), validationError, getBooks)
    .post(...creationRequestBody(), validationError, createBook)
;

bookRouter.route("/:idOrIsbn")
    .get(...requestParam(), validationError, getBook)
    .put(...requestParam(), ...amendmentRequestBody(), validationError, changeBook)
    .delete(...requestParam(), validationError, deleteBook)
;