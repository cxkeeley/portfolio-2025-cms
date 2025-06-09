import { createColumnHelper } from '@tanstack/react-table'

import { LocationReviewModel } from '@models/locationReview'

const locationReviewHelper = createColumnHelper<LocationReviewModel>()

export default locationReviewHelper
