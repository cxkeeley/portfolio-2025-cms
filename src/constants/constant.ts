import { LanguageCodeEnum } from "@models/language"

const APP_NAME = process.env.REACT_APP_NAME
const API_URL = process.env.REACT_APP_API_URL
const WEBSITE_URL = process.env.REACT_APP_WEBSITE_URL

const NODE_ENV = process.env.NODE_ENV

const DEFAULT_LANGUAGE = LanguageCodeEnum.ID

export { APP_NAME, API_URL, NODE_ENV, WEBSITE_URL, DEFAULT_LANGUAGE }
