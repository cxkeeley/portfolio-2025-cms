import { createColumnHelper } from '@tanstack/react-table'

import { ProjectReviewModel } from '@models/projectReview'

const projectReviewHelper = createColumnHelper<ProjectReviewModel>()

export default projectReviewHelper
