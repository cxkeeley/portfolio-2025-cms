import { BaseModel, ID } from "./base"
import LanguageModel from "./language"

type LocationLanguageModel = BaseModel & {
  address: string
  description: string
  language: LanguageModel | null
  language_id: ID
  location_id: ID
  name: string
  short_name: string
  slug: string
}

export type { LocationLanguageModel }
