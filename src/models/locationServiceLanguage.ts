import { BaseModel, ID } from "./base"
import LanguageModel from "./language"

type LocationServiceLanguageModel = BaseModel & {
  image_alt: string | null
  language: LanguageModel | null
  language_id: ID
  location_service_id: ID
  short_description: string 
  title: string 
}

export type { LocationServiceLanguageModel }
