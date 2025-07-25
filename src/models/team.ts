import { BaseModel, ID } from './base'
import { FileModel } from './file'
import { ProjectModel } from './project'
import TeamLanguageModel from './teamLanguage'

type TeamModel = BaseModel & {
  degree: string | null
  team_languages: Array<TeamLanguageModel>
  image_file: FileModel
  image_file_id: ID
  is_active: boolean
  job_title: string
  large_thumbnail_file: FileModel
  large_thumbnail_file_id: ID
  project: ProjectModel | null
  project_id: ID
  name: string
  slug: string
  start_practice_month: number
  start_practice_year: number
  thumbnail_file: FileModel
  thumbnail_file_id: ID
  year_of_experience: number
}

export default TeamModel
