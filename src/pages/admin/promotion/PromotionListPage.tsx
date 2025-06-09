import { Button } from '@/components/Button'
import { KTCard } from '@/components/KTCard'
import { useAlert, useRequestState, useToast } from '@/hooks'
import { PromotionModel, PromotionStatusEnum } from '@/models/promotion'
import { PermissionsControl } from '@/modules/permissions'
import { FC } from 'react'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Stack from 'react-bootstrap/Stack'
import { FormattedMessage, useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import { initialQueryState } from '@models/apiBase'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { QUERIES } from '@/constants/queries'
import AdminPromotionsAPI, { ResponsePromotions } from '@/api/admin/promotionsAPI'
import FloatLoadingIndicator from '@/components/FloatLoadingIndicator'
import ErrorCard from '@/components/ErrorCard'
import { DragDropContext, Draggable, Droppable, OnDragEndResponder } from 'react-beautiful-dnd'
import { usePermissions } from '@/modules/permissions/core/PermissionsProvider'
import { PermissionEnum } from '@/constants/permission'
import TypeUtil from '@/utils/typeUtil'
import { AxiosResponse } from 'axios'
import ArrayUtil from '@/utils/arrayUtil'
import AxiosUtil from '@/utils/axiosUtil'
import { SearchBar } from '@/components/SearchBar'
import { EmptyContentPlaceholder } from '@/components/EmptyContentPlaceholder'
import { Image } from '@/components/Image'
import { PROMOTION_IMAGE_THUMBNAIL_ASPECT_RATIO } from '@/modules/promotion/constants'

type Props = {}

const PromotionListPage: FC<Props> = () => {
  const intl = useIntl()
  const alert = useAlert()
  const toast = useToast()
  const { hasPermissions } = usePermissions()
  const queryClient = useQueryClient()

  const hasMovePermission = hasPermissions(PermissionEnum.ADMIN_PROMOTION_MOVE)

  const { query, phrase, filters, setFilters, setPhrase } = useRequestState<
    PromotionModel,
    { status: PromotionStatusEnum }
  >({
    ...initialQueryState,
    filters: {
      status: PromotionStatusEnum.PUBLISHED,
    },
  })

  const filterQuery = { phrase: query.phrase, status: query.status }

  const canMovePromotion =
    hasMovePermission &&
    (!TypeUtil.isDefined(phrase) || TypeUtil.isEmpty(phrase)) &&
    filters?.status === PromotionStatusEnum.PUBLISHED

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [QUERIES.ADMIN_PROMOTION_LIST, filterQuery],
    queryFn: () => AdminPromotionsAPI.filter(filterQuery),
    select: (r) => r.data.data?.promotions,
    keepPreviousData: true,
  })

  // move optimistic update
  const { mutate: movePromotion } = useMutation({
    mutationFn: (params: { promotion: PromotionModel; fromIndex: number; toIndex: number }) =>
      AdminPromotionsAPI.move(params.promotion.id, { position: params.toIndex + 1 }),
    onMutate: async (params) => {
      await queryClient.cancelQueries({ queryKey: [QUERIES.ADMIN_PROMOTION_LIST, filterQuery] })

      const previousData = queryClient.getQueryData([QUERIES.ADMIN_PROMOTION_LIST, filterQuery])

      queryClient.setQueryData<AxiosResponse<ResponsePromotions>>(
        [QUERIES.ADMIN_PROMOTION_LIST, filterQuery],
        (old) =>
          ({
            ...old,
            data: {
              data: {
                promotions: ArrayUtil.reorder(old?.data.data?.promotions || [], params.fromIndex, params.toIndex),
              },
            },
          } as AxiosResponse<ResponsePromotions>)
      )

      return previousData
    },
    onError: (err, params, previousData) => {
      queryClient.setQueryData([QUERIES.ADMIN_PROMOTION_LIST, filterQuery], previousData) // rollback

      if (AxiosUtil.isAxiosError(err) && err.response?.data.message) {
        toast.error(
          intl.formatMessage(
            { id: 'promotion.alert.move_promotion_failed' },
            { name: params.promotion.default_title, error: err.response.data.message }
          )
        )
      } else {
        toast.error(
          intl.formatMessage(
            { id: 'promotion.alert.move_promotion_failed' },
            { name: params.promotion.default_title, error: String(err) }
          )
        )
      }
    },
    onSettled: () => {
      refetch() // Always refetch after error or success
    },
  })

  const handleSearch = (keyword?: string) => {
    setPhrase(keyword)
  }

  const handleDragEnd: OnDragEndResponder = (result) => {
    if (result.reason !== 'DROP' || !data || !result.destination) return

    const promotion = data[result.source.index]

    movePromotion({
      promotion,
      fromIndex: result.source.index,
      toIndex: result.destination.index,
    })
  }

  const handleDelete = async (promotion: PromotionModel) => {
    try {
      const { isConfirmed } = await alert.warning({
        text: intl.formatMessage({ id: 'alert.delete.prompt' }, { name: promotion.default_title }),
        confirmButtonText: intl.formatMessage({ id: 'alert.delete.confirm' }),
      })

      if (!isConfirmed) return

      await AdminPromotionsAPI.delete(promotion.id)
      refetch()
      toast.success(intl.formatMessage({ id: 'promotion.alert.delete_promotion_success' }))
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
        <KTCard className="h-100">
          <KTCard.Header>
            <div className="d-flex align-items-center me-5">
              <div className="btn-group">
                <Button
                  variant="outline"
                  textColor="muted"
                  activeColor="primary"
                  isActive={filters?.status === PromotionStatusEnum.PUBLISHED}
                  onClick={() => setFilters((prev) => ({ ...prev, status: PromotionStatusEnum.PUBLISHED }))}
                >
                  <FormattedMessage id="vocabulary.published" />
                </Button>

                <Button
                  variant="outline"
                  textColor="muted"
                  activeColor="primary"
                  isActive={filters?.status === PromotionStatusEnum.DRAFT}
                  onClick={() => setFilters((prev) => ({ ...prev, status: PromotionStatusEnum.DRAFT }))}
                >
                  <FormattedMessage id="vocabulary.draft" />
                </Button>
              </div>
            </div>

            <SearchBar
              initialValue={phrase}
              onChange={handleSearch}
              placeholder={intl.formatMessage({ id: 'promotion.placeholder.search' })}
            />

            <KTCard.Toolbar className="ms-auto">
              <PermissionsControl allow={[PermissionEnum.ADMIN_PROMOTION_CREATE]}>
                <Link to="/admin/promotions/create">
                  <Button theme="primary">
                    <i className="fa-solid fa-plus" />
                    <FormattedMessage id="promotion.button.add_promotion" />
                  </Button>
                </Link>
              </PermissionsControl>
            </KTCard.Toolbar>
          </KTCard.Header>

          <KTCard.Body className="flex-grow-1 scroll-y h-50px">
            {data.length > 0 ? (
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="promotion-list">
                  {(droppableProvided) => (
                    <Stack
                      {...droppableProvided.droppableProps}
                      ref={droppableProvided.innerRef}
                      gap={3}
                    >
                      {data.map((promotion, index) => (
                        <Draggable
                          index={index}
                          draggableId={promotion.id}
                          key={promotion.id}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              style={provided.draggableProps.style}
                              className="bg-body border rounded p-5 d-flex align-items-center gap-5"
                            >
                              {canMovePromotion && (
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
                                    src={promotion.image_file?.link}
                                    aspectRatio={PROMOTION_IMAGE_THUMBNAIL_ASPECT_RATIO}
                                  />
                                </div>

                                <div>
                                  <div className="fs-5 fw-bold">{promotion.default_title}</div>
                                </div>
                              </div>

                              <Stack
                                direction="horizontal"
                                gap={3}
                              >
                                <PermissionsControl allow={PermissionEnum.ADMIN_PROMOTION_SHOW}>
                                  <Link to={`/admin/promotions/${promotion.id}`}>
                                    <Button
                                      variant="icon"
                                      theme="light"
                                      activeColor="primary"
                                      size="sm"
                                    >
                                      <i className="fa-solid fa-eye" />
                                    </Button>
                                  </Link>
                                </PermissionsControl>

                                <PermissionsControl allow={PermissionEnum.ADMIN_PROMOTION_DELETE}>
                                  <Button
                                    variant="icon"
                                    theme="light"
                                    activeTextColor="danger"
                                    size="sm"
                                    onClick={() => handleDelete(promotion)}
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
            ) : (
              <div className="h-100 d-flex justify-content-center flex-column text-center">
                <EmptyContentPlaceholder.Illustration />
                <EmptyContentPlaceholder.Title As="h4">
                  <FormattedMessage id="promotion.placeholder.empty_promotion_article" />
                </EmptyContentPlaceholder.Title>
              </div>
            )}
          </KTCard.Body>
        </KTCard>
      </Col>
    </Row>
  )
}

export default PromotionListPage
