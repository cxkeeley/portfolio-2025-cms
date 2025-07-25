import { BaseModel, ID } from './base'
import { FileModel } from './file'
import { ProjectGroupModel } from './projectGroup'
import { ProjectLabelModel } from './projectLabel'
import { ProjectLanguageModel } from './projectLanguage'

type ProjectModel = BaseModel & {
  address: string
  description: string | null
  image_alt: string | null
  image_file: FileModel | null
  image_file_id: ID | null
  is_coming_soon: boolean
  latitude: number | null
  languages: ProjectLanguageModel[] | null
  project_group: ProjectGroupModel | null
  project_group_id: ID
  project_label: ProjectLabelModel | null
  project_label_id: ID
  longitude: number | null
  name: string
  phone_number: string
  short_name: string | null
}

export type { ProjectModel }
