import { BaseModel, ID } from './base'
import { FileModel } from './file'
import { LocationGroupLanguageModel } from './locationGroupLanguage'

type LocationGroupModel = BaseModel & {
  image_file: FileModel | null
  image_file_id: ID
  languages: Array<LocationGroupLanguageModel> | null
  name: string
}

export type { LocationGroupModel }
