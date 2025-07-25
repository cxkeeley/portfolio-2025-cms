import { BaseModel, ID } from './base'
import { FileModel } from './file'

type ProjectReviewModel = BaseModel & {
  client_image_alt: string
  client_image_file: FileModel | null
  client_image_file_id: ID
  client_name: string
  project_id: ID
  story: string
}

export type { ProjectReviewModel }
