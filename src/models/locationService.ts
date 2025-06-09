import { BaseModel, ID } from "./base";
import { FileModel } from "./file";
import { LocationServiceLanguageModel } from "./locationServiceLanguage";

type LocationServiceModel = BaseModel & {
  default_image_alt: string | null
  default_short_description: string | null
  default_title: string | null
  image_file: FileModel | null
  image_file_id: ID
  languages: LocationServiceLanguageModel[] | null
}

export type { LocationServiceModel }
