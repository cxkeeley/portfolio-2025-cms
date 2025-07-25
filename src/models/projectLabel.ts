import { BaseModel, ID } from './base'
import { FileModel } from './file'
import { ProjectLabelLanguageModel } from './projectLabelLanguage'

type ProjectLabelModel = BaseModel & {
  default_name: string
  project_label_languages: ProjectLabelLanguageModel[] | null
  map_icon_file: FileModel | null
  map_icon_file_id: ID
}

export type { ProjectLabelModel }
