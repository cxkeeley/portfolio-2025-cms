import { BaseModel, ID } from "./base";
import { LocationGroupModel } from "./locationGroup";

type MainPageLocationGroupModel = BaseModel & {
  location_group: LocationGroupModel
  location_group_id: ID
  position: number
}

export type { MainPageLocationGroupModel }
