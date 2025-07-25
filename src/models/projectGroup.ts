import { BaseModel, ID } from './base'
import { FileModel } from './file'
import { ProjectGroupLanguageModel } from './projectGroupLanguage'

type ProjectGroupModel = BaseModel & {
  image_file: FileModel | null
  image_file_id: ID
  languages: Array<ProjectGroupLanguageModel> | null
  name: string
}

export type { ProjectGroupModel }
