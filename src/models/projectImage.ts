import { BaseModel, ID } from './base'
import { FileModel } from './file'
import { ProjectImageLanguageModel } from './projectImageLanguage'

type ProjectImageModel = BaseModel & {
  image_alt: string
  image_caption: string
  image_file: FileModel | null
  image_file_id: ID
  languages: ProjectImageLanguageModel[] | null
  position: number
}

export type { ProjectImageModel }
