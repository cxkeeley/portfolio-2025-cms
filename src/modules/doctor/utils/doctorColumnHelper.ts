import { createColumnHelper } from '@tanstack/react-table'

import DoctorModel from '@models/doctor'

const doctorColumnHelper = createColumnHelper<DoctorModel>()

export default doctorColumnHelper
