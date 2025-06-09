import { BaseModel, ID } from "./base";
import { FileModel } from "./file";

type BannerModel = BaseModel & {
  image_file: FileModel
  image_file_id: ID
  position: number
  url: string | null
}

export type { BannerModel }
