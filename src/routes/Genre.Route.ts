import { Router } from "express";
import { amendmentRequestBody, creationRequestBody, listRequestQuery, requestParam } from "../validators/Genre.Validator.js";
import { validationError } from "../middleware/validationError.js";
import { changeGenre, createGenre, deleteGenre, getGenre, getGenres } from "../controllers/Genre.Controller.js";
import { authenticateWithJWT } from "../middleware/authenticateWithJWT.js";

export const genreRouter = Router();

genreRouter.route("/")
    .get(...listRequestQuery(), validationError, getGenres)
    .post(authenticateWithJWT, ...creationRequestBody(), validationError, createGenre)
;

genreRouter.route("/:nameOrId")
    .get(...requestParam(), validationError, getGenre)
    .put(authenticateWithJWT, ...requestParam(), ...amendmentRequestBody(), validationError, changeGenre)
    .delete(authenticateWithJWT, ...requestParam(), validationError, deleteGenre)
;