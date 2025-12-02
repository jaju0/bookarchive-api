import { Router } from "express";
import { amendmentRequestBody, creationRequestBody, listRequestQuery, requestParam } from "../validators/Genre.Validator.js";
import { validationError } from "../middleware/validationError.js";
import { changeGenre, createGenre, deleteGenre, getGenre, getGenres } from "../controllers/Genre.Controller.js";

export const genreRouter = Router();

genreRouter.route("/")
    .get(...listRequestQuery(), validationError, getGenres)
    .post(...creationRequestBody(), validationError, createGenre)
;

genreRouter.route("/:nameOrId")
    .get(...requestParam(), validationError, getGenre)
    .put(...requestParam(), ...amendmentRequestBody(), validationError, changeGenre)
    .delete(...requestParam(), validationError, deleteGenre)
;