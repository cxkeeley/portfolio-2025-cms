import { useQuery } from '@tanstack/react-query'
import { FC } from 'react'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import { FormattedMessage } from 'react-intl'
import { Link, useParams } from 'react-router-dom'

import AdminMainPageVideosAPI from '@api/admin/mainPageVideoAPI'

import ErrorCard from '@components/ErrorCard'
import FloatLoadingIndicator from '@components/FloatLoadingIndicator'

import { MainPageVideoDetailCard } from '@modules/main-page-video/components/MainPageVideoDetailCard'
import { MainPageVideoThumbnailCard } from '@modules/main-page-video/components/MainPageVideoThumbnailCard'
import { PermissionsControl } from '@modules/permissions'

import { PermissionEnum } from '@/constants/permission'
import { QUERIES } from '@/constants/queries'
import TypeUtil from '@/utils/typeUtil'

const MainPageVideoDetailPage: FC = () => {
  const { mainPageVideoId } = useParams()

  const { data, error, isLoading } = useQuery({
    queryKey: [QUERIES.ADMIN_MAIN_PAGE_VIDEO_DETAIL, mainPageVideoId],
    queryFn: () => AdminMainPageVideosAPI.get(mainPageVideoId!),
    enabled: TypeUtil.isDefined(mainPageVideoId),
    select: (r) => r.data.data?.main_page_video,
  })

  if (isLoading) {
    return <FloatLoadingIndicator />
  }

  if (!data || error) {
    return <ErrorCard />
  }

  return (
    <Row>
      <Col xl={8}>
        <MainPageVideoDetailCard
          title={data.title}
          uri={data.uri}
          isActive={data.is_active}
          thumbnailImageSrc={data.thumbnail_file.link}
          updatedAt={data.updated_at}
          toolbar={
            <PermissionsControl allow={PermissionEnum.ADMIN_MAIN_PAGE_VIDEO_UPDATE}>
              <Link
                className="btn btn-primary"
                to={`/admin/main-page-videos/edit/${mainPageVideoId}`}
              >
                <i className="fa-solid fa-pen" />
                <FormattedMessage id="vocabulary.edit" />
              </Link>
            </PermissionsControl>
          }
        />
      </Col>
      <Col xs={4}>
        <MainPageVideoThumbnailCard
          thumbnailImageSrc={data.thumbnail_file.link}
          toolbar={
            <PermissionsControl allow={PermissionEnum.ADMIN_MAIN_PAGE_VIDEO_UPDATE}>
              <Link
                className="btn btn-secondary btn-icon btn-sm"
                to={`/admin/main-page-videos/edit/${mainPageVideoId}`}
              >
                <i className="fa-solid fa-pen" />
              </Link>
            </PermissionsControl>
          }
        />
      </Col>
    </Row>
  )
}

export default MainPageVideoDetailPage
