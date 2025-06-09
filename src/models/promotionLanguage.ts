import { BaseModel, ID } from './base'
import LanguageModel from './language'
import { PromotionLanguageImageModel } from './promotionLanguageImage'

type PromotionLanguageModel = BaseModel & {
  content: string | null
  images: Array<PromotionLanguageImageModel> | null
  language: LanguageModel | null
  language_id: ID
  lead: string | null
  promotion_id: ID
  reference: string | null
  slug: string
  term_and_conditions: string | null
  title: string
}

export type { PromotionLanguageModel }
