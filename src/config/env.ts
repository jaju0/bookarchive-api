import dotenv from "dotenv";

declare global
{
    namespace NodeJS
    {
        interface ProcessEnv
        {
            JWT_SECRET?: string;
            PORT?: string;
            DATABASE_URI?: string;
            AUTHOR_QUERY_DEFAULT_PAGE_LIMIT?: string;
            AUTHOR_MIN_NAME_LENGTH?: string;
            AUTHOR_MAX_NAME_LENGTH?: string;
            AUTHOR_MIN_BIOGRAPHY_LENGTH?: string;
            AUTHOR_MAX_BIOGRAPHY_LENGTH?: string;
            BOOK_QUERY_DEFAULT_PAGE_LIMIT?: string;
            BOOK_MIN_TITLE_LENGTH?: string;
            BOOK_MAX_TITLE_LENGTH?: string;
            BOOK_MIN_SUBTITLE_LENGTH?: string;
            BOOK_MAX_SUBTITLE_LENGTH?: string;
            BOOK_MIN_DESCRIPTION_LENGTH?: string;
            BOOK_MAX_DESCRIPTION_LENGTH?: string;
            GENRE_QUERY_DEFAULT_PAGE_LIMIT?: string;
            GENRE_MIN_NAME_LENGTH?: string;
            GENRE_MAX_NAME_LENGTH?: string;
            GENRE_MIN_DESCRIPTION_LENGTH?: string;
            GENRE_MAX_DESCRIPTION_LENGTH?: string;
            PUBLISHER_QUERY_DEFAULT_PAGE_LIMIT?: string;
            PUBLISHER_MIN_NAME_LENGTH?: string;
            PUBLISHER_MAX_NAME_LENGTH?: string;
            PUBLISHER_MIN_ADDRESS_LENGTH?: string;
            PUBLISHER_MAX_ADDRESS_LENGTH?: string;
        }
    }
}

export interface AuthorVariables
{
    queryDefaultPageLimit: number;
    minNameLength: number;
    maxNameLength: number;
    minBiographyLength: number;
    maxBiographyLength: number;
}

export interface BookVariables
{
    queryDefaultPageLimit: number;
    minTitleLength: number;
    maxTitleLength: number;
    minSubtitleLength: number;
    maxSubtitleLength: number;
    minDescriptionLength: number;
    maxDescriptionLength: number;
}

export interface GenreVariables
{
    queryDefaultPageLimit: number;
    minNameLength: number;
    maxNameLength: number;
    minDescriptionLength: number;
    maxDescriptionLength: number;
}

export interface PublisherVariables
{
    queryDefaultPageLimit: number;
    minNameLength: number;
    maxNameLength: number;
    minAddressLength: number;
    maxAddressLength: number;
}

export interface EnvironmentVariables
{
    jwtSecret: string;
    port: number;
    databaseURI: string;
    author: AuthorVariables;
    book: BookVariables;
    genre: GenreVariables;
    publisher: PublisherVariables;
}

function integerVariableOptional(envVar: string | undefined, defaultValue: number)
{
    return envVar && Number.isInteger(+envVar) ? +envVar : defaultValue;
}

function loadVariables(path?: string)
{
    dotenv.config({ path });

    if(!process.env.JWT_SECRET)
    {
        console.error("JWT_SECRET environment variable not set");
        process.exit(1);
    }

    if(!process.env.DATABASE_URI)
    {
        console.error("DATABASE_URI environment variable not set");
        process.exit(1);
    }

    return <EnvironmentVariables> {
        jwtSecret: process.env.JWT_SECRET,
        port: integerVariableOptional(process.env.PORT, 3000),
        databaseURI: process.env.DATABASE_URI,
        author: {
            queryDefaultPageLimit: integerVariableOptional(process.env.AUTHOR_QUERY_DEFAULT_PAGE_LIMIT, 1000),
            minNameLength: integerVariableOptional(process.env.AUTHOR_MIN_NAME_LENGTH, 1),
            maxNameLength: integerVariableOptional(process.env.AUTHOR_MAX_NAME_LENGTH, 100),
            minBiographyLength: integerVariableOptional(process.env.AUTHOR_MIN_BIOGRAPHY_LENGTH, 1),
            maxBiographyLength: integerVariableOptional(process.env.AUTHOR_MAX_BIOGRAPHY_LENGTH, 100000),
        },
        book: {
            queryDefaultPageLimit: integerVariableOptional(process.env.BOOK_QUERY_DEFAULT_PAGE_LIMIT, 1000),
            minTitleLength: integerVariableOptional(process.env.BOOK_MIN_TITLE_LENGTH, 1),
            maxTitleLength: integerVariableOptional(process.env.BOOK_MAX_TITLE_LENGTH, 500),
            minSubtitleLength: integerVariableOptional(process.env.BOOK_MIN_SUBTITLE_LENGTH, 1),
            maxSubtitleLength: integerVariableOptional(process.env.BOOK_MAX_SUBTITLE_LENGTH, 500),
            minDescriptionLength: integerVariableOptional(process.env.BOOK_MIN_DESCRIPTION_LENGTH, 1),
            maxDescriptionLength: integerVariableOptional(process.env.BOOK_MAX_DESCRIPTION_LENGTH, 100000),
        },
        genre: {
            queryDefaultPageLimit: integerVariableOptional(process.env.GENRE_QUERY_DEFAULT_PAGE_LIMIT, 1000),
            minNameLength: integerVariableOptional(process.env.GENRE_MIN_NAME_LENGTH, 1),
            maxNameLength: integerVariableOptional(process.env.GENRE_MAX_NAME_LENGTH, 100),
            minDescriptionLength: integerVariableOptional(process.env.GENRE_MIN_DESCRIPTION_LENGTH, 1),
            maxDescriptionLength: integerVariableOptional(process.env.GENRE_MAX_DESCRIPTION_LENGTH, 100000),
        },
        publisher: {
            queryDefaultPageLimit: integerVariableOptional(process.env.PUBLISHER_QUERY_DEFAULT_PAGE_LIMIT, 1000),
            minNameLength: integerVariableOptional(process.env.PUBLISHER_MIN_NAME_LENGTH, 1),
            maxNameLength: integerVariableOptional(process.env.PUBLISHER_MAX_NAME_LENGTH, 100),
            minAddressLength: integerVariableOptional(process.env.PUBLISHER_MIN_ADDRESS_LENGTH, 1),
            maxAddressLength: integerVariableOptional(process.env.PUBLISHER_MAX_ADDRESS_LENGTH, 200),
        },
    };
}

export const EnvironmentVariables = loadVariables();