import { BaseModel, ID } from './base'
import { FileModel } from './file'

type ArticleLanguageImageModel = BaseModel & {
  article_language_id: ID
  file: FileModel
  file_id: ID
  height_px: number
  width_px: number
}

export default ArticleLanguageImageModel
