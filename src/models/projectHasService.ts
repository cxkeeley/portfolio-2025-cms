import { BaseModel, ID } from './base'
import { ProjectServiceModel } from './projectService'

type ProjectHasServiceModel = BaseModel & {
  project_id: ID
  project_service: ProjectServiceModel | null
  project_service_id: ID
  position: number
}

export type { ProjectHasServiceModel }
