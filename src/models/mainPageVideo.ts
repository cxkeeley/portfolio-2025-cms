import { BaseModel, ID } from './base'
import { FileModel } from './file'

type MainPageVideoModel = BaseModel & {
  is_active: boolean
  position: number
  thumbnail_file: FileModel
  thumbnail_file_id: ID
  title: string
  uri: string
}

export type { MainPageVideoModel }
