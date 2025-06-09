import { BaseModel, ID } from './base'
import { FileModel } from './file'
import { LocationGroupModel } from './locationGroup'
import { LocationLabelModel } from './locationLabel'
import { LocationLanguageModel } from './locationLanguage'

type LocationModel = BaseModel & {
  address: string
  description: string | null
  image_alt: string | null
  image_file: FileModel | null
  image_file_id: ID  | null
  is_coming_soon: boolean
  latitude: number | null
  languages: LocationLanguageModel[] | null
  location_group: LocationGroupModel | null
  location_group_id: ID
  location_label: LocationLabelModel | null
  location_label_id: ID
  longitude: number | null
  name: string
  phone_number: string
  short_name: string | null
}

export type { LocationModel }
