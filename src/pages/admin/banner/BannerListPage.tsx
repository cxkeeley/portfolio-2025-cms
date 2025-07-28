import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { FC } from 'react'
import { DragDropContext, Draggable, DropResult, Droppable } from 'react-beautiful-dnd'
import { Col, Row, Stack } from 'react-bootstrap'
import { FormattedMessage, useIntl } from 'react-intl'
import { Link, NavLink } from 'react-router-dom'

import ErrorCard from '@components/ErrorCard/ErrorCard'
import FloatLoadingIndicator from '@components/FloatLoadingIndicator'
import { Image } from '@components/Image'
import { KTCard } from '@components/KTCard'

import { MOBILE_BANNER_ASPECT_RATIO } from '@modules/banner/constants'
import { PermissionsControl } from '@modules/permissions'

import AdminBannersAPI from '@/api/admin/bannersAPI'
import { Button } from '@/components/Button'
import EmptyContentCard from '@/components/EmptyContentCard'
import { PermissionEnum } from '@/constants/permission'
import { QUERIES } from '@/constants/queries'
import { useAlert, useToast } from '@/hooks'
import { BannerModel } from '@/models/banner'
import ArrayUtil from '@/utils/arrayUtil'
import AxiosUtil from '@/utils/axiosUtil'

type Props = {}

const BannerListPage: FC<Props> = () => {
  const intl = useIntl()
  const alert = useAlert()
  const toast = useToast()
  const queryClient = useQueryClient()

  const { data, isLoading, error, refetch } = useQuery({
    keepPreviousData: true,
    queryKey: [QUERIES.BANNER_LIST],
    queryFn: () => AdminBannersAPI.filter(),
    select: (r) => r.data.data?.banners,
  })

  // move optimistic update
  const { mutate: move } = useMutation({
    mutationFn: (params: { banner: BannerModel; fromIndex: number; toIndex: number }) => {
      return AdminBannersAPI.move(params.banner.id, { position: params.toIndex + 1 })
    },
    onMutate: async (params) => {
      await queryClient.cancelQueries({ queryKey: [QUERIES.BANNER_LIST] })

      const previousData = queryClient.getQueryData([QUERIES.BANNER_LIST])

      queryClient.setQueryData<Awaited<ReturnType<typeof AdminBannersAPI.filter>> | undefined>(
        [QUERIES.BANNER_LIST],
        (old) => {
          if (old?.data.data) {
            const reorderedBanners = ArrayUtil.reorder(old.data.data.banners, params.fromIndex, params.toIndex)

            return {
              ...old,
              data: {
                data: { banners: reorderedBanners },
              },
            }
          }

          return old
        }
      )

      return previousData
    },
    onError: (err, _, previousData) => {
      queryClient.setQueryData([QUERIES.ADMIN_MAIN_PAGE_TEAM_LIST], previousData) // rollback

      if (AxiosUtil.isAxiosError(err) && err.response?.data.message) {
        toast.error(err.response.data.message)
      } else {
        toast.error(intl.formatMessage({ id: 'banner.message.delete_error' }))
      }
    },
    onSettled: () => {
      refetch()
    },
  })

  const handleDragEnd = (result: DropResult) => {
    if (result.reason !== 'DROP' || !data || !result.destination) return

    const banner = data[result.source.index]

    move({
      banner,
      fromIndex: result.source.index,
      toIndex: result.destination.index,
    })
  }

  const deleteBanner = async (banner: BannerModel) => {
    try {
      const { isConfirmed } = await alert.warning({
        text: intl.formatMessage({ id: 'alert.delete.prompt' }, { name: '' }),
        confirmButtonText: intl.formatMessage({ id: 'alert.delete.confirm' }),
      })

      if (!isConfirmed) return

      await AdminBannersAPI.delete(banner.id)

      refetch()

      toast.success(intl.formatMessage({ id: 'banner.message.delete_success' }))
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

  if (error || !data) {
    return <ErrorCard />
  }

  return (
    <Row className="h-100">
      <Col lg={8}>
        {data.length > 0 ? (
          <KTCard className="h-100">
            <KTCard.Header>
              <KTCard.Title>
                <FormattedMessage id="banner.card.title" />
              </KTCard.Title>

              <KTCard.Toolbar>
                <PermissionsControl allow={PermissionEnum.ADMIN_BANNER_CREATE}>
                  <Link to="/admin/banners/create">
                    <Button theme="primary">
                      <i className="fa-solid fa-plus" />
                      <FormattedMessage id="banner.button.add" />
                    </Button>
                  </Link>
                </PermissionsControl>
              </KTCard.Toolbar>
            </KTCard.Header>

            <KTCard.Body className="flex-grow-1 scroll-y h-50px">
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="banner-list">
                  {(droppableProvided) => (
                    <Stack
                      {...droppableProvided.droppableProps}
                      ref={droppableProvided.innerRef}
                      gap={3}
                    >
                      {data.map((banner, index) => (
                        <Draggable
                          key={banner.id}
                          index={index}
                          draggableId={banner.id}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              style={provided.draggableProps.style}
                              className="bg-body border rounded px-5 py-3 d-flex align-items-center gap-5"
                            >
                              <PermissionsControl allow={[PermissionEnum.ADMIN_BANNER_MOVE]}>
                                <div {...provided.dragHandleProps}>
                                  <i className="fa fa-bars fs-3" />
                                </div>
                              </PermissionsControl>

                              <div className="d-flex gap-5 align-items-center flex-equal">
                                <Image
                                  aspectRatio={MOBILE_BANNER_ASPECT_RATIO}
                                  src={banner.image_file.link}
                                  height={60}
                                />

                                <div className="fs-6 flex-equal w-50px">
                                  {banner.url ? (
                                    <a
                                      href={banner.url}
                                      target="_blank"
                                      rel="noreferrer"
                                      style={{ overflowWrap: 'break-word' }}
                                    >
                                      {banner.url}
                                    </a>
                                  ) : (
                                    <span className="text-muted fst-italic">
                                      <FormattedMessage id="banner.message.empty_url" />
                                    </span>
                                  )}
                                </div>
                              </div>

                              <Stack
                                gap={3}
                                direction="horizontal"
                              >
                                <PermissionsControl allow={PermissionEnum.ADMIN_BANNER_UPDATE}>
                                  <NavLink to={`/admin/banners/edit/${banner.id}`}>
                                    <Button
                                      variant="icon"
                                      theme="light"
                                      activeTextColor="primary"
                                      size="sm"
                                    >
                                      <i className="fa-solid fa-pen" />
                                    </Button>
                                  </NavLink>
                                </PermissionsControl>
                                <PermissionsControl allow={PermissionEnum.ADMIN_BANNER_DELETE}>
                                  <Button
                                    variant="icon"
                                    theme="light"
                                    activeTextColor="danger"
                                    size="sm"
                                    onClick={() => deleteBanner(banner)}
                                  >
                                    <i className="fa-solid fa-trash" />
                                  </Button>
                                </PermissionsControl>
                              </Stack>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      <>{droppableProvided.placeholder}</>
                    </Stack>
                  )}
                </Droppable>
              </DragDropContext>
            </KTCard.Body>
          </KTCard>
        ) : (
          <EmptyContentCard title={<FormattedMessage id="banner.message.empty_placeholder" />}>
            <PermissionsControl allow={PermissionEnum.ADMIN_BANNER_CREATE}>
              <NavLink to="/admin/banners/create">
                <Button theme="primary">
                  <i className="fa-solid fa-plus" />
                  <FormattedMessage id="banner.button.add" />
                </Button>
              </NavLink>
            </PermissionsControl>
          </EmptyContentCard>
        )}
      </Col>
    </Row>
  )
}

export default BannerListPage
