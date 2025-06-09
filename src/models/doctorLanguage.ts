import { BaseModel, ID } from './base'
import LanguageModel from './language'

type DoctorLanguageModel = BaseModel & {
  content: string | null
  doctor_id: ID
  language: LanguageModel
  language_id: ID
  quote: string
  quote_author: string
}

export default DoctorLanguageModel
