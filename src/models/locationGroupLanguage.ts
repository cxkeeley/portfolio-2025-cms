import { BaseModel, ID } from "./base"
import LanguageModel from "./language"

type LocationGroupLanguageModel = BaseModel &{
  image_alt: string
  language: LanguageModel | null
  language_id: ID
  location_group_id: ID
  name: string
}

export type { LocationGroupLanguageModel }
