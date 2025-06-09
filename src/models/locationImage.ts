import { BaseModel, ID } from "./base";
import { FileModel } from "./file";
import { LocationImageLanguageModel } from "./locationImageLanguage";

type LocationImageModel = BaseModel & {
  image_alt: string
  image_caption: string
  image_file: FileModel | null
  image_file_id: ID
  languages: LocationImageLanguageModel[] | null
  position: number
}

export type { LocationImageModel }
