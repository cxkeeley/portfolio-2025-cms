import { BaseModel, ID } from './base'
import { FileModel } from './file'
import { PromotionLanguageModel } from './promotionLanguage'
import { UserModel } from './user'

enum PromotionStatusEnum {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
}

type PromotionModel = BaseModel & {
  default_title: string | null
  image_file: FileModel | null
  image_file_id: ID
  languages: Array<PromotionLanguageModel> | null
  position: number
  status: PromotionStatusEnum
  user: UserModel | null
  user_id: ID
  whatsapp_text: string | null
}

export { PromotionStatusEnum }

export type { PromotionModel }
