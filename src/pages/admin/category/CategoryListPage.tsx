import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AxiosResponse } from 'axios'
import { FC } from 'react'
import { DragDropContext, Draggable, Droppable, OnDragEndResponder } from 'react-beautiful-dnd'
import { Col, Row } from 'react-bootstrap'
import Stack from 'react-bootstrap/Stack'
import { FormattedMessage, useIntl } from 'react-intl'
import { Link } from 'react-router-dom'

import AdminCategoryAPI, { ResponseCategories } from '@api/admin/categoriesAPI'

import CategoryModel from '@models/category'

import { Button } from '@components/Button'
import EmptyContentCard from '@components/EmptyContentCard'
import ErrorCard from '@components/ErrorCard'
import FloatLoadingIndicator from '@components/FloatLoadingIndicator'
import { KTCard } from '@components/KTCard'

import { PermissionsControl } from '@modules/permissions'
import { usePermissions } from '@modules/permissions/core/PermissionsProvider'

import { PermissionEnum } from '@/constants/permission'
import { QUERIES } from '@/constants/queries'
import { useAlert, useToast } from '@/hooks'
import ArrayUtil from '@/utils/arrayUtil'
import AxiosUtil from '@/utils/axiosUtil'

const CategoryListPage: FC = () => {
  const intl = useIntl()
  const alert = useAlert()
  const toast = useToast()
  const queryClient = useQueryClient()
  const { hasPermissions } = usePermissions()

  const hasMovePermission = hasPermissions(PermissionEnum.ADMIN_CATEGORY_MOVE)

  const { data, isLoading, refetch, error } = useQuery({
    queryKey: [QUERIES.GET_ADMIN_CATEGORIES_FILTER],
    queryFn: () => AdminCategoryAPI.filter(),
    select: (r) => r.data.data?.categories,
  })

  // move optimistic update
  const { mutate: moveCategory } = useMutation({
    mutationFn: (params: { category: CategoryModel; fromIndex: number; toIndex: number }) =>
      AdminCategoryAPI.move(params.category.id, { position: params.toIndex + 1 }),
    onMutate: async (params) => {
      await queryClient.cancelQueries({ queryKey: [QUERIES.GET_ADMIN_CATEGORIES_FILTER] })

      const previousData = queryClient.getQueryData([QUERIES.GET_ADMIN_CATEGORIES_FILTER])

      queryClient.setQueryData<AxiosResponse<ResponseCategories>>(
        [QUERIES.GET_ADMIN_CATEGORIES_FILTER],
        (old) =>
          ({
            ...old,
            data: {
              data: {
                categories: ArrayUtil.reorder(old?.data.data?.categories || [], params.fromIndex, params.toIndex),
              },
            },
          } as AxiosResponse<ResponseCategories>)
      )

      return previousData
    },
    onError: (err, params, previousData) => {
      queryClient.setQueryData([QUERIES.GET_ADMIN_CATEGORIES_FILTER], previousData) // rollback

      if (AxiosUtil.isAxiosError(err) && err.response?.data.message) {
        toast.error(
          intl.formatMessage(
            { id: 'category.alert.move_category_failed' },
            { name: params.category.default_name, error: err.response.data.message }
          )
        )
      } else {
        toast.error(
          intl.formatMessage(
            { id: 'category.alert.move_category_failed' },
            { name: params.category.default_name, error: String(err) }
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

    const category = data[result.source.index]

    moveCategory({
      category,
      fromIndex: result.source.index,
      toIndex: result.destination.index,
    })
  }

  const handleDelete = async (category: CategoryModel) => {
    const { isConfirmed } = await alert.question({
      text: intl.formatMessage({ id: 'alert.delete.prompt' }, { name: category.default_name }),
      confirmButtonText: intl.formatMessage({ id: 'alert.delete.confirm' }),
    })

    if (!isConfirmed) return

    try {
      await AdminCategoryAPI.delete(category.id)

      refetch()
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
                <FormattedMessage id="category.card.list_title" />
              </KTCard.Title>

              <KTCard.Toolbar className="ms-auto">
                <PermissionsControl allow={PermissionEnum.ADMIN_CATEGORY_CREATE}>
                  <Link to="/admin/categories/create">
                    <Button theme="primary">
                      <i className="fa-solid fa-plus" />
                      <FormattedMessage id="category.button.create" />
                    </Button>
                  </Link>
                </PermissionsControl>
              </KTCard.Toolbar>
            </KTCard.Header>

            <KTCard.Body className="flex-grow-1 scroll-y h-50px">
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="category-list">
                  {(droppableProvided) => (
                    <Stack
                      gap={3}
                      {...droppableProvided.droppableProps}
                      ref={droppableProvided.innerRef}
                    >
                      {data.map((category, index) => (
                        <Draggable
                          index={index}
                          draggableId={category.id}
                          key={category.id}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              style={provided.draggableProps.style}
                              className="bg-body border rounded p-5 d-flex align-items-center gap-5"
                            >
                              {hasMovePermission && (
                                <div {...provided.dragHandleProps}>
                                  <i className="fa fa-bars fs-3" />
                                </div>
                              )}

                              <div className="mb-0 fs-6 fw-medium flex-grow-1">{category.default_name}</div>

                              <Stack
                                direction="horizontal"
                                gap={3}
                              >
                                <PermissionsControl allow={PermissionEnum.ADMIN_CATEGORY_SHOW}>
                                  <Link to={`/admin/categories/${category.id}`}>
                                    <Button
                                      variant="icon"
                                      theme="light"
                                      activeTextColor="primary"
                                      size="sm"
                                    >
                                      <i className="fa-solid fa-eye" />
                                    </Button>
                                  </Link>
                                </PermissionsControl>

                                <PermissionsControl allow={PermissionEnum.ADMIN_CATEGORY_DELETE}>
                                  <Button
                                    variant="icon"
                                    theme="light"
                                    activeTextColor="danger"
                                    size="sm"
                                    onClick={() => handleDelete(category)}
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
          <EmptyContentCard title={<FormattedMessage id="category.message.empty_placeholder" />}>
            <PermissionsControl allow={PermissionEnum.ADMIN_CATEGORY_CREATE}>
              <Link to="/admin/categories/create">
                <Button theme="primary">
                  <i className="fa-solid fa-plus" />
                  <FormattedMessage id="category.button.create" />
                </Button>
              </Link>
            </PermissionsControl>
          </EmptyContentCard>
        )}
      </Col>
    </Row>
  )
}

export default CategoryListPage
