import { BaseModel, ID } from './base'
import { ProjectGroupModel } from './projectGroup'

type MainPageProjectGroupModel = BaseModel & {
  project_group: ProjectGroupModel
  project_group_id: ID
  position: number
}

export type { MainPageProjectGroupModel }
