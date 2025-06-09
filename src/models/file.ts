import { BaseModel } from './base'

type FileModel = BaseModel & {
  link: string
  name: string
  path: string
}

export type { FileModel }
