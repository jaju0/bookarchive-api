import { Router } from "express";
import { amendmentRequestBody, creationRequestBody, listRequestQuery, requestParam } from "../validators/Book.Validator.js";
import { validationError } from "../middleware/validationError.js";
import { changeBook, createBook, deleteBook, getBook, getBooks } from "../controllers/Book.Controller.js";
import { authenticateWithJWT } from "../middleware/authenticateWithJWT.js";

export const bookRouter = Router();

bookRouter.route("/")
    .get(...listRequestQuery(), validationError, getBooks)
    .post(authenticateWithJWT, ...creationRequestBody(), validationError, createBook)
;

bookRouter.route("/:idOrIsbn")
    .get(...requestParam(), validationError, getBook)
    .put(authenticateWithJWT, ...requestParam(), ...amendmentRequestBody(), validationError, changeBook)
    .delete(authenticateWithJWT, ...requestParam(), validationError, deleteBook)
;