import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import React from 'react'
import { DragDropContext, Draggable, Droppable, OnDragEndResponder } from 'react-beautiful-dnd'
import { Stack } from 'react-bootstrap'
import { FormattedMessage, useIntl } from 'react-intl'
import { NavLink } from 'react-router-dom'

import AdminLocationImagesAPI, { PayloadAdminLocationImageCreate } from '@api/admin/projectImagesAPI'

import { ID } from '@models/base'
import { LocationImageModel } from '@models/locationImage'

import { Button } from '@components/Button'
import { EmptyContentPlaceholder } from '@components/EmptyContentPlaceholder'
import ErrorCard from '@components/ErrorCard'

import LocationImage from '@modules/article/components/ArticleImage/ArticleImage'
import { PermissionsControl } from '@modules/permissions'
import { usePermissions } from '@modules/permissions/core/PermissionsProvider'

import { PagePermission } from '@/constants/pagePermission'
import { PermissionEnum } from '@/constants/permission'
import { QUERIES } from '@/constants/queries'
import { useAlert, useBoolState, useToast } from '@/hooks'
import ArrayUtil from '@/utils/arrayUtil'
import AxiosUtil from '@/utils/axiosUtil'
import FormUtil from '@/utils/formUtil'

import LocationContentTabBodyLoading from '../LocationContentTabBodyLoading'
import LocationImageFormModal, { LocationImageFormModalShape } from '../LocationImageFormModal'

type Props = {
  locationId: ID
}

type PayloadImageMove = {
  locationImage: LocationImageModel
  fromIndex: number
  toIndex: number
}

const LocationImagesTabBody: React.FC<Props> = (props) => {
  const queryClient = useQueryClient()
  const toast = useToast()
  const alert = useAlert()
  const intl = useIntl()
  const { hasPermissions } = usePermissions()
  const hasMovePermission = hasPermissions([PermissionEnum.ADMIN_LOCATION_IMAGE_MOVE])
  const [isShowCreateModal, , showCreateModal, hideCreateModal] = useBoolState()

  const queryKey = [QUERIES.ADMIN_LOCATION_IMAGE_LIST]
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: queryKey,
    queryFn: () => AdminLocationImagesAPI.filter({ location_id: props.locationId }),
    select: (r) => r.data.data.location_images,
  })

  // move optimistic update
  const { mutate: move } = useMutation({
    mutationFn: (params: PayloadImageMove) => {
      return AdminLocationImagesAPI.move(params.locationImage.id, {
        location_id: props.locationId,
        position: params.toIndex + 1,
      })
    },
    onMutate: async (params) => {
      await queryClient.cancelQueries({ queryKey })
      const previousData = queryClient.getQueryData(queryKey)
      queryClient.setQueryData<Awaited<ReturnType<typeof AdminLocationImagesAPI.filter>>>(queryKey, (old) => {
        if (old) {
          const newLocationImages = ArrayUtil.reorder(
            old.data.data.location_images || [],
            params.fromIndex,
            params.toIndex
          )
          return {
            ...old,
            data: {
              data: {
                location_images: newLocationImages,
              },
            },
          }
        }
        return undefined
      })
      return previousData
    },
    onError: (err, _, previousData) => {
      queryClient.setQueryData(queryKey, previousData) // rollback
      if (AxiosUtil.isAxiosError(err) && err.response?.data.message) {
        toast.error(err.response.data.message)
      } else {
        toast.error(String(err))
      }
    },
    onSettled: () => {
      refetch() // Always refetch after error or success
      refetchLocationDetail()
    },
  })

  const refetchLocationDetail = () => {
    queryClient.invalidateQueries({ queryKey: [QUERIES.ADMIN_LOCATION_DETAIL, { locationId: props.locationId }] })
  }

  const handleDragEnd: OnDragEndResponder = (result) => {
    if (result.reason !== 'DROP' || !data || !result.destination) return
    const locationImage = data[result.source.index]
    move({
      locationImage: locationImage,
      fromIndex: result.source.index,
      toIndex: result.destination.index,
    })
  }

  const deleteLocationImage = async (item: LocationImageModel) => {
    try {
      const { isConfirmed } = await alert.warning({
        text: intl.formatMessage({ id: 'location_image.message.delete_confirm_prompt' }),
        confirmButtonText: intl.formatMessage({ id: 'alert.delete.confirm' }),
      })
      if (!isConfirmed) return

      await AdminLocationImagesAPI.delete(item.id)

      refetch()
      refetchLocationDetail()
      toast.success(intl.formatMessage({ id: 'location_image.message.delete_success' }))
    } catch (err) {
      if (AxiosUtil.isAxiosError(err) && err.response?.data.message) {
        alert.error({ text: err.response.data.message })
      } else {
        alert.error({ text: String(err) })
      }
    }
  }

  const handleSubmitCreateModal = async (values: LocationImageFormModalShape) => {
    const payload = FormUtil.parseValues<PayloadAdminLocationImageCreate>({
      ...values,
      location_id: props.locationId,
    })
    await AdminLocationImagesAPI.create(payload)

    refetch()
    hideCreateModal()

    toast.success(intl.formatMessage({ id: 'location_image.message.create_success' }))
  }

  if (data) {
    return (
      <React.Fragment>
        <div>
          {data.length > 0 ? (
            <React.Fragment>
              <div className="mb-5">
                <PermissionsControl allow={[PermissionEnum.ADMIN_LOCATION_IMAGE_CREATE]}>
                  <Button
                    theme="primary"
                    onClick={showCreateModal}
                  >
                    <i className="fa-solid fa-plus" />
                    <FormattedMessage id="location.button.add_image" />
                  </Button>
                </PermissionsControl>
              </div>

              <div className="max-h-200px p-5 border rounded overflow-y-auto">
                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId="location-image-list">
                    {(droppableProvided) => (
                      <Stack
                        gap={3}
                        {...droppableProvided.droppableProps}
                        ref={droppableProvided.innerRef}
                      >
                        {data?.map((locationImage, index) => (
                          <Draggable
                            index={index}
                            draggableId={locationImage.id}
                            key={locationImage.id}
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
                                    <i className="fa-solid fa-grip-vertical fs-3" />
                                  </div>
                                )}

                                <div className="flex-equal">
                                  <div className="d-flex align-items-center gap-5">
                                    <LocationImage
                                      src={locationImage.image_file!.link}
                                      width={100}
                                    />
                                    <div>
                                      <h6 className="fw-normal mb-1">{locationImage.image_caption}</h6>
                                      <p className="text-gray-600 mb-0">{locationImage.image_alt}</p>
                                    </div>
                                  </div>
                                </div>

                                <Stack
                                  direction="horizontal"
                                  gap={3}
                                >
                                  <PermissionsControl allow={PagePermission.ADMIN_LOCATION_IMAGE_DETAIL}>
                                    <NavLink to={`/admin/locations/${props.locationId}/images/${locationImage.id}`}>
                                      <Button
                                        variant="icon"
                                        theme="light"
                                        activeTextColor="primary"
                                        size="sm"
                                      >
                                        <i className="fa-solid fa-eye" />
                                      </Button>
                                    </NavLink>
                                  </PermissionsControl>

                                  <PermissionsControl allow={PermissionEnum.ADMIN_LOCATION_IMAGE_DELETE}>
                                    <Button
                                      variant="icon"
                                      theme="light"
                                      activeTextColor="danger"
                                      size="sm"
                                      onClick={() => deleteLocationImage(locationImage)}
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
              </div>
            </React.Fragment>
          ) : (
            <div className="border rounded text-center p-5 min-h-200px">
              <EmptyContentPlaceholder.Illustration />

              <EmptyContentPlaceholder.Title
                As="h5"
                className="mt-2"
              >
                <FormattedMessage id="location_image.message.empty_placeholder" />
              </EmptyContentPlaceholder.Title>

              <div className="my-5">
                <PermissionsControl allow={[PermissionEnum.ADMIN_LOCATION_IMAGE_CREATE]}>
                  <Button
                    theme="primary"
                    onClick={showCreateModal}
                  >
                    <i className="fa-solid fa-plus" />
                    <FormattedMessage id="location.button.add_image" />
                  </Button>
                </PermissionsControl>
              </div>
            </div>
          )}
        </div>

        <LocationImageFormModal
          isShow={isShowCreateModal}
          modalTitle={<FormattedMessage id="location_image.section.modal_create_title" />}
          onSubmit={handleSubmitCreateModal}
          onHide={hideCreateModal}
          onCancel={hideCreateModal}
        />
      </React.Fragment>
    )
  }

  if (isLoading) {
    return <LocationContentTabBodyLoading />
  }

  if (error) {
    return <ErrorCard />
  }

  return null
}

export default LocationImagesTabBody
