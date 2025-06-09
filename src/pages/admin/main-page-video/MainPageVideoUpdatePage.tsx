import { useQuery } from '@tanstack/react-query'
import { FC } from 'react'
import { useIntl } from 'react-intl'
import { useNavigate, useParams } from 'react-router-dom'

import AdminMainPageVideosAPI, { PayloadUpdateMainPageVideo } from '@api/admin/mainPageVideoAPI'

import ErrorCard from '@components/ErrorCard'
import FloatLoadingIndicator from '@components/FloatLoadingIndicator'

import MainPageVideoCreateFormCard, {
  MainPageVideoFormCardShape,
} from '@modules/main-page-video/components/MainPageVideoFormCard/MainPageVideoFormCard'

import { QUERIES } from '@/constants/queries'
import { useToast } from '@/hooks'
import FormUtil from '@/utils/formUtil'
import TypeUtil from '@/utils/typeUtil'

const MainPageVideoUpdatePage: FC = () => {
  const intl = useIntl()
  const toast = useToast()
  const navigate = useNavigate()
  const { mainPageVideoId } = useParams()

  const { data, error, isLoading } = useQuery({
    queryKey: [QUERIES.ADMIN_MAIN_PAGE_VIDEO_DETAIL, mainPageVideoId],
    queryFn: () => AdminMainPageVideosAPI.get(mainPageVideoId!),
    enabled: TypeUtil.isDefined(mainPageVideoId),
    select: (r) => r.data.data?.main_page_video,
  })

  const goBack = () => {
    navigate(-1)
  }

  const handleSubmit = async (values: MainPageVideoFormCardShape) => {
    const payload = FormUtil.parseValues<PayloadUpdateMainPageVideo>(values)

    const response = await AdminMainPageVideosAPI.update(mainPageVideoId!, payload)

    toast.success(intl.formatMessage({ id: 'main_page_video.alert.update_main_page_video.success' }))

    if (response.data.data?.main_page_video) {
      navigate(`/admin/main-page-videos/${response.data.data.main_page_video.id}`)
    } else {
      goBack()
    }
  }

  if (isLoading) {
    return <FloatLoadingIndicator />
  }

  if (!data || error) {
    return <ErrorCard />
  }

  return (
    <MainPageVideoCreateFormCard
      initialThumbnailSrc={data.thumbnail_file.link}
      initialValues={{
        is_active: data.is_active,
        title: data.title,
        uri: data.uri,
        thumbnail_file_path: undefined,
      }}
      onSubmit={handleSubmit}
      onCancel={goBack}
    />
  )
}

export default MainPageVideoUpdatePage
