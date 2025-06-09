import { BaseModel, ID } from "./base";
import LanguageModel from "./language";

type LocationImageLanguageModel = BaseModel & {
  image_alt: string
  image_caption: string
  language: LanguageModel | null
  language_id: ID
  location_image_id: ID
}

export type { LocationImageLanguageModel }
