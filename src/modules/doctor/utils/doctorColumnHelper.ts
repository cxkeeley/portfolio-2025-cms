import { createColumnHelper } from '@tanstack/react-table'

import DoctorModel from '@models/team'

const doctorColumnHelper = createColumnHelper<DoctorModel>()

export default doctorColumnHelper
