import { BaseModel, ID } from './base'
import DoctorModel from './doctor'

type MainPageDoctorModel = BaseModel & {
  doctor: DoctorModel
  doctor_id: ID
  position: number
}

export type { MainPageDoctorModel }
