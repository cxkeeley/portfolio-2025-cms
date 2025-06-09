import { BaseModel, ID } from "./base"
import { FileModel } from "./file"
import { LocationLabelLanguageModel } from "./locationLabelLanguage"

type LocationLabelModel = BaseModel & {
  default_name: string
  location_label_languages: LocationLabelLanguageModel[] | null
  map_icon_file: FileModel | null
  map_icon_file_id: ID
}

export type { LocationLabelModel }
