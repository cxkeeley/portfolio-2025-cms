import { BaseModel, ID } from './base'
import LanguageModel from './language'

type ProjectGroupLanguageModel = BaseModel & {
  image_alt: string
  language: LanguageModel | null
  language_id: ID
  project_group_id: ID
  name: string
}

export type { ProjectGroupLanguageModel }
