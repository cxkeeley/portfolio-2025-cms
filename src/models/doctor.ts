import { BaseModel, ID } from './base'
import DoctorLanguageModel from './doctorLanguage'
import { FileModel } from './file'
import { LocationModel } from './location'

type DoctorModel = BaseModel & {
  degree: string | null
  doctor_languages: Array<DoctorLanguageModel>
  image_file: FileModel
  image_file_id: ID
  is_active: boolean
  job_title: string
  large_thumbnail_file: FileModel
  large_thumbnail_file_id: ID
  location: LocationModel | null
  location_id: ID
  name: string
  slug: string
  start_practice_month: number
  start_practice_year: number
  thumbnail_file: FileModel
  thumbnail_file_id: ID
  year_of_experience: number
}

export default DoctorModel
