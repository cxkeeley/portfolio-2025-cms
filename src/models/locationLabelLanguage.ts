import { BaseModel, ID } from './base'
import LanguageModel from './language'

type LocationLabelLanguageModel = BaseModel & {
  default_name: string
  language: LanguageModel | null
  language_id: ID
  location_label_id: ID
}

export type { LocationLabelLanguageModel }
