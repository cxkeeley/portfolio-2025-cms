import { BaseModel, ID } from './base'
import { FileModel } from './file'

type PromotionLanguageImageModel = BaseModel & {
  promotion_language_id: ID
  file: FileModel | null
  file_id: ID
  height_px: number
  width_px: number
}

export type { PromotionLanguageImageModel }
