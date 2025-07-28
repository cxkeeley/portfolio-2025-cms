import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { FC } from 'react'
import { DragDropContext, Draggable, Droppable, OnDragEndResponder } from 'react-beautiful-dnd'
import { Col, Row, Stack } from 'react-bootstrap'
import { FormattedMessage, useIntl } from 'react-intl'

import AdminMainPageProjectGroupsAPI, { PayloadCreateMainPageProjectGroup } from '@api/admin/mainPageProjectGroupsAPI'

import { MainPageProjectGroupModel } from '@models/mainPageProjectGroup'

import { Button } from '@components/Button'
import EmptyContentCard from '@components/EmptyContentCard'
import ErrorCard from '@components/ErrorCard'
import FloatLoadingIndicator from '@components/FloatLoadingIndicator'
import { KTCard } from '@components/KTCard'

import MainPageProjectGroupFormCard, {
  MainPageProjectGroupFormCardShape,
} from '@modules/main-page-project-group/components/MainPageProjectGroupFormCard/MainPageProjectGroupFormCard'
import { PermissionsControl } from '@modules/permissions'
import { usePermissions } from '@modules/permissions/core/PermissionsProvider'
import ProjectGroupNameCell from '@modules/project-group/components/ProjectGroupNameCell'

import { PermissionEnum } from '@/constants/permission'
import { QUERIES } from '@/constants/queries'
import { useAlert, useBoolState, useToast } from '@/hooks'
import ArrayUtil from '@/utils/arrayUtil'
import AxiosUtil from '@/utils/axiosUtil'
import FormUtil from '@/utils/formUtil'

const MainPageProjectGroupListPage: FC = () => {
  const intl = useIntl()
  const toast = useToast()
  const alert = useAlert()
  const queryClient = useQueryClient()
  const { hasPermissions } = usePermissions()
  const [showCreateCardState, , showCreateCard, hideCreateCard] = useBoolState()

  const hasMovePermission = hasPermissions(PermissionEnum.ADMIN_MAIN_PAGE_PROJECT_GROUP_MOVE)

  const { data, isLoading, refetch, error } = useQuery({
    queryKey: [QUERIES.ADMIN_MAIN_PAGE_PROJECT_GROUP_LIST],
    queryFn: AdminMainPageProjectGroupsAPI.filter,
    select: (r) => r.data.data?.main_page_project_groups,
  })

  // move optimistic update
  const { mutate: move } = useMutation({
    mutationFn: (params: { mainPageProjectGroup: MainPageProjectGroupModel; fromIndex: number; toIndex: number }) =>
      AdminMainPageProjectGroupsAPI.move(params.mainPageProjectGroup.id, { position: params.toIndex + 1 }),
    onMutate: async (params) => {
      await queryClient.cancelQueries({ queryKey: [QUERIES.ADMIN_MAIN_PAGE_PROJECT_GROUP_LIST] })

      const previousData = queryClient.getQueryData([QUERIES.ADMIN_MAIN_PAGE_PROJECT_GROUP_LIST])

      queryClient.setQueryData<Awaited<ReturnType<typeof AdminMainPageProjectGroupsAPI.filter>>>(
        [QUERIES.ADMIN_MAIN_PAGE_PROJECT_GROUP_LIST],
        (old) =>
          ({
            ...old,
            data: {
              data: {
                main_page_project_groups: ArrayUtil.reorder(
                  old?.data.data?.main_page_project_groups || [],
                  params.fromIndex,
                  params.toIndex
                ),
              },
            },
          } as Awaited<ReturnType<typeof AdminMainPageProjectGroupsAPI.filter>>)
      )

      return previousData
    },
    onError: (err, params, previousData) => {
      queryClient.setQueryData([QUERIES.ADMIN_MAIN_PAGE_PROJECT_GROUP_LIST], previousData) // rollback

      if (AxiosUtil.isAxiosError(err) && err.response?.data.message) {
        toast.error(
          intl.formatMessage(
            { id: 'category.alert.move_category_failed' },
            { name: params.mainPageProjectGroup.project_group.name, error: err.response.data.message }
          )
        )
      } else {
        toast.error(
          intl.formatMessage(
            { id: 'category.alert.move_category_failed' },
            { name: params.mainPageProjectGroup.project_group.name, error: String(err) }
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

    const mainPageProjectGroup = data[result.source.index]

    move({
      mainPageProjectGroup,
      fromIndex: result.source.index,
      toIndex: result.destination.index,
    })
  }

  const handleCreate = async (values: MainPageProjectGroupFormCardShape) => {
    const payload = FormUtil.parseValues<PayloadCreateMainPageProjectGroup>(values)

    const response = await AdminMainPageProjectGroupsAPI.create(payload)

    if (response.data.data?.main_page_project_group) {
      refetch()
      hideCreateCard()
      toast.success(intl.formatMessage({ id: 'main_page_project_group.alert.create_main_page_project_group_success' }))
    }
  }

  const handleDelete = async (item: MainPageProjectGroupModel) => {
    const { isConfirmed } = await alert.warning({
      text: intl.formatMessage({ id: 'alert.delete.prompt' }, { name: item.project_group.name }),
      confirmButtonText: intl.formatMessage({ id: 'alert.delete.confirm' }),
    })

    if (!isConfirmed) return

    try {
      await AdminMainPageProjectGroupsAPI.delete(item.id)

      refetch()
      toast.success(intl.formatMessage({ id: 'main_page_project_group.alert.delete_main_page_project_group_success' }))
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
        {data.length > 0 ? (
          <KTCard className="h-100">
            <KTCard.Header>
              <KTCard.Title>
                <FormattedMessage id="project_group.card.list_project_group_title" />
              </KTCard.Title>

              <KTCard.Toolbar className="ms-auto">
                <PermissionsControl allow={PermissionEnum.ADMIN_MAIN_PAGE_PROJECT_GROUP_CREATE}>
                  <Button
                    theme="primary"
                    onClick={showCreateCard}
                  >
                    <i className="fa-solid fa-plus" />
                    <FormattedMessage id="main_page_project_group.button.add_project_group" />
                  </Button>
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
                      {data.map((mainPageProjectGroup, index) => (
                        <Draggable
                          index={index}
                          draggableId={mainPageProjectGroup.id}
                          key={mainPageProjectGroup.id}
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

                              <div className="flex-equal">
                                <ProjectGroupNameCell
                                  name={mainPageProjectGroup.project_group.name}
                                  imageSrc={mainPageProjectGroup.project_group.image_file?.link ?? ''}
                                />
                              </div>

                              <Stack
                                direction="horizontal"
                                gap={3}
                              >
                                <PermissionsControl allow={PermissionEnum.ADMIN_MAIN_PAGE_PROJECT_GROUP_DELETE}>
                                  <Button
                                    variant="icon"
                                    theme="light"
                                    activeTextColor="danger"
                                    size="sm"
                                    onClick={() => handleDelete(mainPageProjectGroup)}
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
          <EmptyContentCard
            title={<FormattedMessage id="main_page_project_group.placeholder.empty_main_page_project_group" />}
          >
            <PermissionsControl allow={PermissionEnum.ADMIN_MAIN_PAGE_PROJECT_GROUP_CREATE}>
              <Button
                theme="primary"
                onClick={showCreateCard}
              >
                <i className="fa-solid fa-plus" />
                <FormattedMessage id="main_page_project_group.button.add_project_group" />
              </Button>
            </PermissionsControl>
          </EmptyContentCard>
        )}
      </Col>

      <Col xl={4}>
        {showCreateCardState && (
          <MainPageProjectGroupFormCard
            title={<FormattedMessage id="main_page_project_group.card.create_main_page_project_group" />}
            onSubmit={handleCreate}
            onCancel={hideCreateCard}
          />
        )}
      </Col>
    </Row>
  )
}

export default MainPageProjectGroupListPage
