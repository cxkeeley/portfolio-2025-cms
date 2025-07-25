import { BaseModel, ID } from './base'
import LanguageModel from './language'

type TeamLanguageModel = BaseModel & {
  content: string | null
  team_id: ID
  language: LanguageModel
  language_id: ID
  quote: string
  quote_author: string
}

export default TeamLanguageModel
