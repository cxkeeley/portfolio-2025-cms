import ArticleLanguageImageModel from './articleLanguageImage'
import { BaseModel, ID } from './base'
import LanguageModel from './language'

type ArticleLanguageModel = BaseModel & {
  article_id: ID
  content: string | null
  images: Array<ArticleLanguageImageModel> | null
  image_caption: string | null
  language_id: ID
  language: LanguageModel | null
  lead: string | null
  reference: string | null
  slug: string
  title: string
}

export default ArticleLanguageModel
