import { BaseModel, ID } from './base'
import TeamModel from './team'

type MainPageTeamModel = BaseModel & {
  team: TeamModel
  team_id: ID
  position: number
}

export type { MainPageTeamModel }
