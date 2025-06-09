import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { FC } from 'react'
import { DragDropContext, Draggable, Droppable, OnDragEndResponder } from 'react-beautiful-dnd'
import { Col, Row } from 'react-bootstrap'
import Stack from 'react-bootstrap/Stack'
import { FormattedMessage, useIntl } from 'react-intl'
import { Link } from 'react-router-dom'

import AdminMainPageVideosAPI, { QueryMainPageVideoFilter } from '@api/admin/mainPageVideoAPI'

import { initialQueryState } from '@models/apiBase'
import { MainPageVideoModel } from '@models/mainPageVideo'

import { Button } from '@components/Button'
import { EmptyContentPlaceholder } from '@components/EmptyContentPlaceholder'
import ErrorCard from '@components/ErrorCard'
import FloatLoadingIndicator from '@components/FloatLoadingIndicator'
import { Image } from '@components/Image'
import { KTCard } from '@components/KTCard'

import { MAIN_PAGE_VIDEO_THUMBNAIL_ASPECT_RATIO } from '@modules/main-page-video/constants'
import { PermissionsControl } from '@modules/permissions'
import { usePermissions } from '@modules/permissions/core/PermissionsProvider'

import { PermissionEnum } from '@/constants/permission'
import { QUERIES } from '@/constants/queries'
import { useAlert, useRequestState, useToast } from '@/hooks'
import ArrayUtil from '@/utils/arrayUtil'
import AxiosUtil from '@/utils/axiosUtil'
import TypeUtil from '@/utils/typeUtil'

const MainPageVideoListPage: FC = () => {
  const intl = useIntl()
  const toast = useToast()
  const alert = useAlert()
  const queryClient = useQueryClient()
  const { hasPermissions } = usePermissions()
  const { query, phrase, filters, setFilters } = useRequestState<MainPageVideoModel, QueryMainPageVideoFilter>({
    ...initialQueryState,
    filters: {
      is_active: true,
    },
  })

  const isActiveList = filters?.is_active === true
  const isSearching = TypeUtil.isString(phrase) && phrase !== ''
  const hasMovePermission = hasPermissions(PermissionEnum.ADMIN_MAIN_PAGE_VIDEO_MOVE)
  const canMoveVideo = isActiveList && !isSearching && hasMovePermission

  const { data, isLoading, refetch, error } = useQuery({
    queryKey: [QUERIES.ADMIN_MAIN_PAGE_VIDEO_LIST, query],
    queryFn: () => AdminMainPageVideosAPI.filter(query),
    select: (r) => r.data.data?.main_page_videos,
    keepPreviousData: true,
  })

  // move optimistic update
  const { mutate: moveVideo } = useMutation({
    mutationFn: (params: { video: MainPageVideoModel; fromIndex: number; toIndex: number }) =>
      AdminMainPageVideosAPI.move(params.video.id, { position: params.toIndex + 1 }),
    onMutate: async (params) => {
      await queryClient.cancelQueries({ queryKey: [QUERIES.ADMIN_MAIN_PAGE_VIDEO_LIST] })

      const previousData = queryClient.getQueryData([QUERIES.ADMIN_MAIN_PAGE_VIDEO_LIST, query])

      queryClient.setQueryData<Awaited<ReturnType<typeof AdminMainPageVideosAPI.filter>>>(
        [QUERIES.ADMIN_MAIN_PAGE_VIDEO_LIST, query],
        (old) =>
          ({
            ...old,
            data: {
              data: {
                main_page_videos: ArrayUtil.reorder(
                  old?.data.data?.main_page_videos || [],
                  params.fromIndex,
                  params.toIndex
                ),
              },
            },
          } as Awaited<ReturnType<typeof AdminMainPageVideosAPI.filter>>)
      )

      return previousData
    },
    onError: (err, params, previousData) => {
      queryClient.setQueryData([QUERIES.GET_ADMIN_CATEGORIES_FILTER], previousData) // rollback

      if (AxiosUtil.isAxiosError(err) && err.response?.data.message) {
        toast.error(
          intl.formatMessage(
            { id: 'main_page_video.alert.move_main_page_video_failed' },
            { name: params.video.title, error: err.response.data.message }
          )
        )
      } else {
        toast.error(
          intl.formatMessage(
            { id: 'main_page_video.alert.move_main_page_video_failed' },
            { name: params.video.title, error: String(err) }
          )
        )
      }
    },
    onSettled: () => {
      refetch() // Always refetch after error or success
    },
  })

  const handleDragEnd: OnDragEndResponder = (result) => {
    if (result.reason !== 'DROP' || !data || !result.destination) return

    const video = data[result.source.index]

    moveVideo({
      video,
      fromIndex: result.source.index,
      toIndex: result.destination.index,
    })
  }

  const handleDelete = async (video: MainPageVideoModel) => {
    const { isConfirmed } = await alert.question({
      text: intl.formatMessage({ id: 'alert.delete.prompt' }, { name: video.title }),
      confirmButtonText: intl.formatMessage({ id: 'alert.delete.confirm' }),
    })

    if (!isConfirmed) return

    try {
      await AdminMainPageVideosAPI.delete(video.id)

      refetch()

      toast.success(intl.formatMessage({ id: 'main_page_video.alert.delete_main_page_video.success' }))
    } catch (err) {
      if (AxiosUtil.isAxiosError(err) && err.response?.data.message) {
        alert.error({ text: err.response.data.message })
      } else {
        alert.error({ text: String(err) })
      }
    }
  }

  if (isLoading) {
    return <FloatLoadingIndicator />
  }

  if (!data || error) {
    return <ErrorCard />
  }

  return (
    <Row className="h-100">
      <Col lg={8}>
        <KTCard className="h-100">
          <KTCard.Header>
            <div className="d-flex align-items-center">
              <div className="btn-group">
                <Button
                  variant="outline"
                  textColor="muted"
                  activeColor="primary"
                  isActive={filters?.is_active === true}
                  onClick={() => setFilters((prev) => ({ ...prev, is_active: true }))}
                >
                  <FormattedMessage id="button.active" />
                </Button>

                <Button
                  variant="outline"
                  textColor="muted"
                  activeColor="primary"
                  isActive={filters?.is_active === false}
                  onClick={() => setFilters((prev) => ({ ...prev, is_active: false }))}
                >
                  <FormattedMessage id="button.non_active" />
                </Button>
              </div>
            </div>

            <KTCard.Toolbar>
              <PermissionsControl allow={PermissionEnum.ADMIN_MAIN_PAGE_VIDEO_CREATE}>
                <Link
                  to="/admin/main-page-videos/create"
                  className="btn btn-primary"
                >
                  <i className="fa-solid fa-plus" />
                  <FormattedMessage id="main_page_video.button.add_video" />
                </Link>
              </PermissionsControl>
            </KTCard.Toolbar>
          </KTCard.Header>

          <KTCard.Body className="flex-grow-1 scroll-y h-50px">
            {data.length > 0 ? (
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="category-list">
                  {(droppableProvided) => (
                    <Stack
                      gap={3}
                      {...droppableProvided.droppableProps}
                      ref={droppableProvided.innerRef}
                    >
                      {data.map((video, index) => (
                        <Draggable
                          index={index}
                          draggableId={video.id}
                          key={video.id}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              style={provided.draggableProps.style}
                              className="bg-body border rounded p-5 d-flex align-items-center gap-5"
                            >
                              {canMoveVideo && (
                                <div {...provided.dragHandleProps}>
                                  <i className="fa fa-bars fs-3" />
                                </div>
                              )}

                              <div className="d-flex flex-equal gap-5 align-items-center">
                                <div className="w-100px rounded border">
                                  <Image
                                    width="100%"
                                    height="auto"
                                    className="rounded"
                                    src={video.thumbnail_file.link}
                                    aspectRatio={MAIN_PAGE_VIDEO_THUMBNAIL_ASPECT_RATIO}
                                  />
                                </div>

                                <div>
                                  <div className="fs-4 fw-bold">{video.title}</div>
                                  <a
                                    href={video.uri}
                                    target="_blank"
                                    rel="noreferrer"
                                  >
                                    {video.uri}
                                  </a>
                                </div>
                              </div>

                              <div className="d-flex align-items-center gap-3">
                                <PermissionsControl allow={PermissionEnum.ADMIN_MAIN_PAGE_VIDEO_SHOW}>
                                  <Link
                                    to={`/admin/main-page-videos/${video.id}`}
                                    className="btn btn-icon btn-light btn-active-color-primary btn-sm"
                                  >
                                    <i className="fa-solid fa-eye" />
                                  </Link>
                                </PermissionsControl>

                                <PermissionsControl allow={PermissionEnum.ADMIN_MAIN_PAGE_VIDEO_DELETE}>
                                  <Button
                                    variant="icon"
                                    theme="light"
                                    activeTextColor="danger"
                                    size="sm"
                                    onClick={() => handleDelete(video)}
                                  >
                                    <i className="fa-solid fa-trash" />
                                  </Button>
                                </PermissionsControl>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      <>{droppableProvided.placeholder}</>
                    </Stack>
                  )}
                </Droppable>
              </DragDropContext>
            ) : (
              <div className="h-100 d-flex justify-content-center flex-column text-center">
                <EmptyContentPlaceholder.Illustration />
                <EmptyContentPlaceholder.Title As="h3">
                  <FormattedMessage id="main_page_video.placeholder.empty_main_page_video" />
                </EmptyContentPlaceholder.Title>
              </div>
            )}
          </KTCard.Body>
        </KTCard>
      </Col>
    </Row>
  )
}

export default MainPageVideoListPage
