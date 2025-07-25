import { BaseModel, ID } from './base'
import LanguageModel from './language'

type ProjectLabelLanguageModel = BaseModel & {
  default_name: string
  language: LanguageModel | null
  language_id: ID
  project_label_id: ID
}

export type { ProjectLabelLanguageModel }
