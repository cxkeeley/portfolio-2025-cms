import { BaseModel, ID } from './base'
import CategoryLanguageModel from './categoryLanguage'
import { FileModel } from './file'

type CategoryModel = BaseModel & {
  default_name: string | null
  default_slug: string | null
  file: FileModel
  image_file_id: ID
  languages?: CategoryLanguageModel[]
  position: number
}

export default CategoryModel
