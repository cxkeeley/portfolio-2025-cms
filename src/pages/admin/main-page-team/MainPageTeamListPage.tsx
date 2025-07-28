import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { FC } from 'react'
import { DragDropContext, Draggable, Droppable, OnDragEndResponder } from 'react-beautiful-dnd'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Stack from 'react-bootstrap/Stack'
import { FormattedMessage, useIntl } from 'react-intl'

import AdminMainPageTeamsAPI, { PayloadCreateMainPageTeam } from '@api/admin/mainPageTeamAPI'

import { MainPageTeamModel } from '@models/mainPageTeam'

import { Button } from '@components/Button'
import EmptyContentCard from '@components/EmptyContentCard'
import ErrorCard from '@components/ErrorCard'
import FloatLoadingIndicator from '@components/FloatLoadingIndicator'
import { KTCard } from '@components/KTCard'

import TeamNameCell from '@modules/team/components/TeamNameCell'
import {
  MainPageTeamFormCard,
  MainPageTeamFormCardShape,
} from '@modules/main-page-team/components/MainPageTeamFormCard'
import { PermissionsControl } from '@modules/permissions'
import { usePermissions } from '@modules/permissions/core/PermissionsProvider'

import { PermissionEnum } from '@/constants/permission'
import { QUERIES } from '@/constants/queries'
import { useAlert, useBoolState, useToast } from '@/hooks'
import ArrayUtil from '@/utils/arrayUtil'
import AxiosUtil from '@/utils/axiosUtil'
import FormUtil from '@/utils/formUtil'

const MainPageTeamListPage: FC = () => {
  const intl = useIntl()
  const toast = useToast()
  const alert = useAlert()
  const queryClient = useQueryClient()
  const { hasPermissions } = usePermissions()
  const [showCreateCardState, , showCreateCard, hideCreateCard] = useBoolState()

  const hasMovePermission = hasPermissions(PermissionEnum.ADMIN_MAIN_PAGE_TEAM_MOVE)

  const { data, isLoading, refetch, error } = useQuery({
    queryKey: [QUERIES.ADMIN_MAIN_PAGE_TEAM_LIST],
    queryFn: AdminMainPageTeamsAPI.filter,
    select: (r) => r.data.data?.main_page_teams,
  })

  // move optimistic update
  const { mutate: move } = useMutation({
    mutationFn: (params: { mainPageTeam: MainPageTeamModel; fromIndex: number; toIndex: number }) =>
      AdminMainPageTeamsAPI.move(params.mainPageTeam.id, { position: params.toIndex + 1 }),
    onMutate: async (params) => {
      await queryClient.cancelQueries({ queryKey: [QUERIES.ADMIN_MAIN_PAGE_TEAM_LIST] })

      const previousData = queryClient.getQueryData([QUERIES.ADMIN_MAIN_PAGE_TEAM_LIST])

      queryClient.setQueryData<Awaited<ReturnType<typeof AdminMainPageTeamsAPI.filter>>>(
        [QUERIES.ADMIN_MAIN_PAGE_TEAM_LIST],
        (old) =>
          ({
            ...old,
            data: {
              data: {
                main_page_teams: ArrayUtil.reorder(
                  old?.data.data?.main_page_teams || [],
                  params.fromIndex,
                  params.toIndex
                ),
              },
            },
          } as Awaited<ReturnType<typeof AdminMainPageTeamsAPI.filter>>)
      )

      return previousData
    },
    onError: (err, params, previousData) => {
      queryClient.setQueryData([QUERIES.ADMIN_MAIN_PAGE_TEAM_LIST], previousData) // rollback

      if (AxiosUtil.isAxiosError(err) && err.response?.data.message) {
        toast.error(
          intl.formatMessage(
            { id: 'category.alert.move_category_failed' },
            { name: params.mainPageTeam.team.name, error: err.response.data.message }
          )
        )
      } else {
        toast.error(
          intl.formatMessage(
            { id: 'category.alert.move_category_failed' },
            { name: params.mainPageTeam.team.name, error: String(err) }
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

    const mainPageTeam = data[result.source.index]

    move({
      mainPageTeam,
      fromIndex: result.source.index,
      toIndex: result.destination.index,
    })
  }

  const handleCreate = async (values: MainPageTeamFormCardShape) => {
    const payload = FormUtil.parseValues<PayloadCreateMainPageTeam>(values)

    const response = await AdminMainPageTeamsAPI.create(payload)

    if (response.data.data?.main_page_team) {
      refetch()
      hideCreateCard()
      toast.success(intl.formatMessage({ id: 'main_page_team.alert.create_main_page_team_success' }))
    }
  }

  const handleDelete = async (item: MainPageTeamModel) => {
    const { isConfirmed } = await alert.warning({
      text: intl.formatMessage({ id: 'alert.delete.prompt' }, { name: item.team.name }),
      confirmButtonText: intl.formatMessage({ id: 'alert.delete.confirm' }),
    })

    if (!isConfirmed) return

    try {
      await AdminMainPageTeamsAPI.delete(item.id)

      refetch()
      toast.success(intl.formatMessage({ id: 'main_page_team.alert.delete_main_page_team_success' }))
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
                <FormattedMessage id="team.card.list_team_title" />
              </KTCard.Title>

              <KTCard.Toolbar className="ms-auto">
                <PermissionsControl allow={PermissionEnum.ADMIN_MAIN_PAGE_TEAM_CREATE}>
                  <Button
                    theme="primary"
                    onClick={showCreateCard}
                  >
                    <i className="fa-solid fa-plus" />
                    <FormattedMessage id="main_page_team.button.add_team" />
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
                      {data.map((mainPageTeam, index) => (
                        <Draggable
                          index={index}
                          draggableId={mainPageTeam.id}
                          key={mainPageTeam.id}
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
                                <TeamNameCell
                                  degree={mainPageTeam.team.degree}
                                  imageSrc={mainPageTeam.team.thumbnail_file.link}
                                  name={mainPageTeam.team.name}
                                />
                              </div>

                              <Stack
                                direction="horizontal"
                                gap={3}
                              >
                                <PermissionsControl allow={PermissionEnum.ADMIN_MAIN_PAGE_TEAM_DELETE}>
                                  <Button
                                    variant="icon"
                                    theme="light"
                                    activeTextColor="danger"
                                    size="sm"
                                    onClick={() => handleDelete(mainPageTeam)}
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
          <EmptyContentCard title={<FormattedMessage id="main_page_team.placeholder.empty_main_page_team" />}>
            <PermissionsControl allow={PermissionEnum.ADMIN_MAIN_PAGE_TEAM_CREATE}>
              <Button
                theme="primary"
                onClick={showCreateCard}
              >
                <i className="fa-solid fa-plus" />
                <FormattedMessage id="main_page_team.button.add_team" />
              </Button>
            </PermissionsControl>
          </EmptyContentCard>
        )}
      </Col>

      <Col xl={4}>
        {showCreateCardState && (
          <MainPageTeamFormCard
            title={<FormattedMessage id="main_page_team.card.create_main_page_team" />}
            onSubmit={handleCreate}
            onCancel={hideCreateCard}
          />
        )}
      </Col>
    </Row>
  )
}

export default MainPageTeamListPage
