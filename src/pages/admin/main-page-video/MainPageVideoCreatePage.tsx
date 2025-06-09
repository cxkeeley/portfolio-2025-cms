import { FC } from 'react'
import { useIntl } from 'react-intl'
import { useNavigate } from 'react-router-dom'

import AdminMainPageVideosAPI, { PayloadCreateMainPageVideo } from '@api/admin/mainPageVideoAPI'

import {
  MainPageVideoFormCard,
  MainPageVideoFormCardShape,
} from '@modules/main-page-video/components/MainPageVideoFormCard'

import { useToast } from '@/hooks'
import FormUtil from '@/utils/formUtil'

const MainPageVideoCreatePage: FC = () => {
  const intl = useIntl()
  const toast = useToast()
  const navigate = useNavigate()

  const goBack = () => {
    navigate(-1)
  }

  const handleSubmit = async (values: MainPageVideoFormCardShape) => {
    const payload = FormUtil.parseValues<PayloadCreateMainPageVideo>(values)

    const response = await AdminMainPageVideosAPI.create(payload)

    toast.success(intl.formatMessage({ id: 'main_page_video.alert.create_main_page_video_success' }))

    if (response.data.data?.main_page_video) {
      navigate(`/admin/main-page-videos/${response.data.data.main_page_video.id}`)
    } else {
      goBack()
    }
  }

  return (
    <MainPageVideoFormCard
      onSubmit={handleSubmit}
      onCancel={goBack}
    />
  )
}

export default MainPageVideoCreatePage
