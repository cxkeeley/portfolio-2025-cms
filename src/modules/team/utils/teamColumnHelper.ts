import { createColumnHelper } from '@tanstack/react-table'

import TeamModel from '@models/team'

const teamColumnHelper = createColumnHelper<TeamModel>()

export default teamColumnHelper
