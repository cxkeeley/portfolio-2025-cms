import { BaseModel, ID } from './base'
import LanguageModel from './language'

type ProjectImageLanguageModel = BaseModel & {
  image_alt: string
  image_caption: string
  language: LanguageModel | null
  language_id: ID
  project_image_id: ID
}

export type { ProjectImageLanguageModel }
