import { BaseModel, ID } from './base'
import LanguageModel from './language'

type ProjectLanguageModel = BaseModel & {
  address: string
  description: string
  language: LanguageModel | null
  language_id: ID
  project_id: ID
  name: string
  short_name: string
  slug: string
}

export type { ProjectLanguageModel }
