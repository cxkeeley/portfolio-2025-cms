import { BaseModel, ID } from './base'
import { LocationServiceModel } from './locationService'

type LocationHasServiceModel = BaseModel & {
  location_id: ID
  location_service: LocationServiceModel | null
  location_service_id: ID
  position: number
}

export type { LocationHasServiceModel }
