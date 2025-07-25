import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { FC } from 'react'
import { DragDropContext, Draggable, Droppable, OnDragEndResponder } from 'react-beautiful-dnd'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Stack from 'react-bootstrap/Stack'
import { FormattedMessage, useIntl } from 'react-intl'

import AdminOurDoctorPageDoctorsAPI, { PayloadCreateOurDoctorPageDoctor } from '@api/admin/ourTeamPageTeamsAPI'

import { OurDoctorPageDoctorModel } from '@models/ourdoctorPageDoctor'

import { Button } from '@components/Button'
import EmptyContentCard from '@components/EmptyContentCard'
import ErrorCard from '@components/ErrorCard'
import FloatLoadingIndicator from '@components/FloatLoadingIndicator'
import { KTCard } from '@components/KTCard'

import DoctorNameCell from '@modules/doctor/components/DoctorNameCell'
import {
  OurDoctorPageDoctorFormCard,
  OurDoctorPageDoctorFormCardShape,
} from '@modules/our-doctor-page-doctor/components/OurDoctorPageDoctorFormCard'
import { PermissionsControl } from '@modules/permissions'
import { usePermissions } from '@modules/permissions/core/PermissionsProvider'

import { PermissionEnum } from '@/constants/permission'
import { QUERIES } from '@/constants/queries'
import { useAlert, useBoolState, useToast } from '@/hooks'
import ArrayUtil from '@/utils/arrayUtil'
import AxiosUtil from '@/utils/axiosUtil'
import FormUtil from '@/utils/formUtil'

const OurDoctorPageDoctorListPage: FC = () => {
  const intl = useIntl()
  const toast = useToast()
  const alert = useAlert()
  const queryClient = useQueryClient()
  const { hasPermissions } = usePermissions()
  const [showCreateCardState, , showCreateCard, hideCreateCard] = useBoolState()

  const hasMovePermission = hasPermissions(PermissionEnum.ADMIN_OUR_DOCTOR_PAGE_DOCTOR_MOVE)

  const { data, isLoading, refetch, error } = useQuery({
    queryKey: [QUERIES.ADMIN_OUR_DOCTOR_PAGE_DOCTOR_LIST],
    queryFn: AdminOurDoctorPageDoctorsAPI.filter,
    select: (r) => r.data.data?.our_doctor_page_doctors,
  })

  // move optimistic update
  const { mutate: move } = useMutation({
    mutationFn: (params: { ourDoctorPageDoctor: OurDoctorPageDoctorModel; fromIndex: number; toIndex: number }) =>
      AdminOurDoctorPageDoctorsAPI.move(params.ourDoctorPageDoctor.id, { position: params.toIndex + 1 }),
    onMutate: async (params) => {
      await queryClient.cancelQueries({ queryKey: [QUERIES.ADMIN_OUR_DOCTOR_PAGE_DOCTOR_LIST] })

      const previousData = queryClient.getQueryData([QUERIES.ADMIN_OUR_DOCTOR_PAGE_DOCTOR_LIST])

      queryClient.setQueryData<Awaited<ReturnType<typeof AdminOurDoctorPageDoctorsAPI.filter>>>(
        [QUERIES.ADMIN_OUR_DOCTOR_PAGE_DOCTOR_LIST],
        (old) =>
          ({
            ...old,
            data: {
              data: {
                our_doctor_page_doctors: ArrayUtil.reorder(
                  old?.data.data?.our_doctor_page_doctors || [],
                  params.fromIndex,
                  params.toIndex
                ),
              },
            },
          } as Awaited<ReturnType<typeof AdminOurDoctorPageDoctorsAPI.filter>>)
      )

      return previousData
    },
    onError: (err, params, previousData) => {
      queryClient.setQueryData([QUERIES.ADMIN_OUR_DOCTOR_PAGE_DOCTOR_LIST], previousData) // rollback

      if (AxiosUtil.isAxiosError(err) && err.response?.data.message) {
        toast.error(
          intl.formatMessage(
            { id: 'our_doctor_page_doctor.alert.move_our_doctor_page_doctor_failed' },
            { name: params.ourDoctorPageDoctor.doctor.name, error: err.response.data.message }
          )
        )
      } else {
        toast.error(
          intl.formatMessage(
            { id: 'our_doctor_page_doctor.alert.move_our_doctor_page_doctor_failed' },
            { name: params.ourDoctorPageDoctor.doctor.name, error: String(err) }
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

    const ourDoctorPageDoctor = data[result.source.index]

    move({
      ourDoctorPageDoctor,
      fromIndex: result.source.index,
      toIndex: result.destination.index,
    })
  }

  const handleCreate = async (values: OurDoctorPageDoctorFormCardShape) => {
    const payload = FormUtil.parseValues<PayloadCreateOurDoctorPageDoctor>(values)

    const response = await AdminOurDoctorPageDoctorsAPI.create(payload)

    if (response.data.data?.our_doctor_page_doctor) {
      refetch()
      hideCreateCard()
      toast.success(intl.formatMessage({ id: 'our_doctor_page_doctor.alert.create_our_doctor_page_doctor_success' }))
    }
  }

  const handleDelete = async (item: OurDoctorPageDoctorModel) => {
    const { isConfirmed } = await alert.warning({
      text: intl.formatMessage({ id: 'alert.delete.prompt' }, { name: item.doctor.name }),
      confirmButtonText: intl.formatMessage({ id: 'alert.delete.confirm' }),
    })

    if (!isConfirmed) return

    try {
      await AdminOurDoctorPageDoctorsAPI.delete(item.id)

      refetch()
      toast.success(intl.formatMessage({ id: 'our_doctor_page_doctor.alert.delete_our_doctor_page_doctor_success' }))
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
      <Col xl={8}>
        {data.length > 0 ? (
          <KTCard className="h-100">
            <KTCard.Header>
              <KTCard.Title>
                <FormattedMessage id="doctor.card.list_doctor_title" />
              </KTCard.Title>

              <KTCard.Toolbar className="ms-auto">
                <PermissionsControl allow={PermissionEnum.ADMIN_OUR_DOCTOR_PAGE_DOCTOR_CREATE}>
                  <Button
                    theme="primary"
                    onClick={showCreateCard}
                  >
                    <i className="fa-solid fa-plus" />
                    <FormattedMessage id="our_doctor_page_doctor.button.add_doctor" />
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
                      {data.map((ourDoctorPageDoctor, index) => (
                        <Draggable
                          index={index}
                          draggableId={ourDoctorPageDoctor.id}
                          key={ourDoctorPageDoctor.id}
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
                                <DoctorNameCell
                                  degree={ourDoctorPageDoctor.doctor.degree}
                                  name={ourDoctorPageDoctor.doctor.name}
                                  imageSrc={ourDoctorPageDoctor.doctor.thumbnail_file.link}
                                />
                              </div>

                              <Stack
                                direction="horizontal"
                                gap={3}
                              >
                                <PermissionsControl allow={PermissionEnum.ADMIN_OUR_DOCTOR_PAGE_DOCTOR_DELETE}>
                                  <Button
                                    variant="icon"
                                    theme="light"
                                    activeTextColor="danger"
                                    size="sm"
                                    onClick={() => handleDelete(ourDoctorPageDoctor)}
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
            title={<FormattedMessage id="our_doctor_page_doctor.placeholder.empty_our_doctor_page_doctor" />}
          >
            <PermissionsControl allow={PermissionEnum.ADMIN_OUR_DOCTOR_PAGE_DOCTOR_CREATE}>
              <Button
                theme="primary"
                onClick={showCreateCard}
              >
                <i className="fa-solid fa-plus" />
                <FormattedMessage id="our_doctor_page_doctor.button.add_doctor" />
              </Button>
            </PermissionsControl>
          </EmptyContentCard>
        )}
      </Col>

      <Col xl={4}>
        {showCreateCardState && (
          <OurDoctorPageDoctorFormCard
            title={<FormattedMessage id="our_doctor_page_doctor.card.create_our_doctor_page_doctor" />}
            onSubmit={handleCreate}
            onCancel={hideCreateCard}
          />
        )}
      </Col>
    </Row>
  )
}

export default OurDoctorPageDoctorListPage
