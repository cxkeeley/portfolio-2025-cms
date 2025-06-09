import ArticleLanguageModel from './articleLanguage'
import { BaseModel, ID } from './base'
import CategoryModel from './category'
import { FileModel } from './file'
import { UserModel } from './user'

enum ArticleStatusEnum {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
}

type ArticleModel = BaseModel & {
  author_name: string
  default_title: string
  image_file: FileModel | null
  image_file_id: ID
  published_at: string
  reviewer: string
  status: ArticleStatusEnum
  user: UserModel
  user_id: ID
  category_id: ID
  category: CategoryModel
  languages: Array<ArticleLanguageModel> | null
}

type ArticleContentBlockModel = {
  id: string
  type: 'header' | 'paragraph' | 'list' | 'image'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any
}

type ArticleContentModel = {
  time: number
  blocks: ArticleContentBlockModel[]
}

export { ArticleStatusEnum }

export type { ArticleContentModel, ArticleContentBlockModel }

export type { ArticleModel }
