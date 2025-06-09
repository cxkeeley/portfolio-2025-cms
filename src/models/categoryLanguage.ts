import { BaseModel, ID } from './base'
import LanguageModel from './language'

type CategoryLanguageModel = BaseModel & {
  category_id: ID
  language: LanguageModel | null
  language_id: ID
  name: string
  slug: string
}

export default CategoryLanguageModel
