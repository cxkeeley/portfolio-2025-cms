import { BaseModel, ID } from './base'
import TeamModel from './team'

type OurTeamPageTeamModel = BaseModel & {
  team: TeamModel
  team_id: ID
  position: number
}

export type { OurTeamPageTeamModel }
