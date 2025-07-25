import { createColumnHelper } from '@tanstack/react-table'

import { LocationReviewModel } from '@models/projectReview'

const locationReviewHelper = createColumnHelper<LocationReviewModel>()

export default locationReviewHelper
