<h1 align="center">
<div align="center">
    <img alt="preview" src="./images/logo.png" align="center" />
</div>
Book Archive REST API
</h1>

<br />

<details open>
    <summary>Table of Contents</summary>
    <ol>
        <li>
            <a href="#introduction">Introduction</a>
        </li>
        <li>
            <a href="#base-url">Base URL</a>
        </li>
        <li>
            <a href="#authentication">Authentication</a>
        </li>
        <li>
            <a href="#endpoints">Endpoints</a>
        </li>
        <li>
            <a href="#error-handling">Error Handling</a>
        </li>
        <li>
            <a href="#setup-and-installation">Setup and Installation</a>
        </li>
        <li>
            <a href="#running-tests">Running Tests</a>
        </li>
        <li>
            <a href="#attributions">Attributions</a>
        </li>
    </ol>
</details>


## Introduction

This REST API provides CRUD operations for managing books, authors, publishers and genres. It is designed as a showcase project demonstrating the implementation of REST principles.

### Technologies Used

[![npm](https://img.shields.io/badge/npm-CB3837?logo=npm&logoColor=fff)](#)
[![pnpm](https://img.shields.io/badge/pnpm-F69220?logo=pnpm&logoColor=fff)](#)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=fff)](#)
[![Node.js](https://img.shields.io/badge/Node.js-6DA55F?logo=node.js&logoColor=white)](#)
[![Express.js](https://img.shields.io/badge/Express.js-%23404d59.svg?logo=express&logoColor=%2361DAFB)](#)
[![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?logo=mongodb&logoColor=white)](#)


## Base URL

`https://jajuo.de/bookarchive/api`


## Authentication

All endpoints with writing execution will need authorization. Authorization for protected endpoints is done by JWT in the request header:

```http
Authorization: Bearer <your token>
```

Every token signed with the same secret as given to the backend via the `JWT_SECRET` environment variable is valid.

## Endpoints

Visit the [Swagger UI](https://jajuo.de/bookarchive/api) of this API for a comprehensive overview of all endpoints and data structures and **live testing**.

### Endpoints Overview

| Method | Endpoint | Authorization | Description |
|:---|:---|---|:---|
| `GET` | /books |  | Get a list of books |
| `POST`| /books | YES | Add a new book | 
| `GET` | /books/:idOrIsbn |  | Get a single book |
| `PUT` | /books/:idOrIsbn | YES | Change a book |
| `DELETE` | /books/:idOrIsbn | YES | Delete a book |
| `GET` | /authors |  | Get a list of authors |
| `POST` | /authors | YES | Add a new author |
| `GET` | /authors/:id |  | Get a single author |
| `PUT` | /authors/:id | YES | Change an author |
| `DELETE` | /authors/:id | YES | Delete an author |
| `GET` | /publishers |  | Get a list of publishers |
| `POST` | /publishers | YES | Add a new publisher |
| `GET` | /publishers/:id | | Get a single publisher |
| `PUT` | /publishers/:id | YES | Change a publisher |
| `DELETE` | /publishers/:id | YES | Delete a publisher |
| `GET` | /genres | | Get a list of genres |
| `POST` | /genres | YES | Add a new genre |
| `GET` | /genres/:nameOrId | | Get a single genre |
| `PUT` | /genres/:nameOrId | YES | Change a genre |
| `DELETE` | /genres/:nameOrId | YES | Delete a genre |


## Error Handling

Expect an error response from any endpoint if you get a 400 http status code with the following structure:

```json
{
    "errors": [...]
}
```

There are four error object structures that the "errors" array can contain: `FieldValidationError`, `AlternativeValidationError`, `GroupedAlternativeValidationError` and `UnknownFieldValidationError`.

### FieldValidationError

Occurs when a field provided in the request has an invalid unprocessable value.

| Property | description |
|:---|:---|
| `type` | will be always `field` |
| `value` | the provided invalid value from the request |
| `msg` | error message why the provided value failed |
| `path` | field name of the provided request data where the error occured |
| `location` | location of the field `query`, `params`, `body`... |

Example:

```json
{
    "type": "field",
    "value": "",
    "msg": "length must be between 1 and 500 if provided",
    "path": "title",
    "location": "body"
}
```

### GroupedAlternativeValidationError

Occurs when all fields of two or more alternatives have invalid unprocessable values.

| Property | description |
|:---|:---|
| `type` | will be always `alternative_grouped` |
| `msg` | error message why the provided value failed |
| `nestedErrors` | 2D Array of `FieldValidationError` |

Example:

```json
{
    "type": "alternative_grouped",
    "msg": "at least one valid field must be provided",
    "nestedErrors": [
        [
            {
                "type": "field",
                "value": "",
                "msg": "length must be between 1 and 500 if provided",
                "path": "title",
                "location": "body"
            }
        ],
        [
            {
                "type": "field",
                "value": "",
                "msg": "length must be between 1 and 500 if provided",
                "path": "subtitle",
                "location": "body"
            }
        ],
        ...
    ]
}
```

### AlternativeValidationError

Expect the same as GroupedAlternativeValidationError except the `nestedErrors` field is flattened (1D-Array).

| Property | description |
|:---|:---|
| `type` | will be always `alternative` |
| `msg` | error message why the provided value failed |
| `nestedErrors` | 1D Array of `FieldValidationError` |

Example:

```json
{
    "type": "alternative",
    "msg": "at least one valid field must be provided",
    "nestedErrors": [
        {
            "type": "field",
            "value": "",
            "msg": "length must be between 1 and 500 if provided",
            "path": "title",
            "location": "body"
        },
        {
            "type": "field",
            "value": "",
            "msg": "length must be between 1 and 500 if provided",
            "path": "subtitle",
            "location": "body"
        }
        ...
    ]
}
```

### UnknownFieldValidationError

Occurs when an unknown field was provided to an endpoint.

| Property | description |
|:---|:---|
| `type` | will be always `unknown_fields` |
| `msg` | error message |
| `fields` | List of objects describing all unknown fields |
| `fields[].path` | field name of the provided request data where the error occured |
| `fields[].location` | location of the field `query`, `params`, `body`... |
| `fields[].value` | value of the unknown field |

Example:

```json
{
    "type": "unknown_fields",
    "msg": "error",
    "fields": [
        {
            "path": "titlee",
            "location": "body",
            "value": "The Chronos Key"
        }
    ]
}
```


## Setup and Installation

## Running Tests


## Attributions

<a href="https://www.flaticon.com/free-icons/digital-book" title="digital book icons">Digital book icons created by Canticons - Flaticon</a>
