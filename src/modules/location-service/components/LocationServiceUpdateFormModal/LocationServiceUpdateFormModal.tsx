import { Form, Formik } from 'formik'
import { FC, useState } from 'react'
import Alert from 'react-bootstrap/Alert'
import Modal from 'react-bootstrap/Modal'
import { FormattedMessage } from 'react-intl'

import AdminLocationServicesAPI from '@api/admin/locationServiceAPI'

import { Button } from '@components/Button'
import { FileInputField } from '@components/Form/FileInput'
import FormControl from '@components/FormControl/FormControl'

import { PermissionsControl } from '@modules/permissions'

import { PermissionEnum } from '@/constants/permission'
import { useAlert } from '@/hooks'
import AxiosUtil from '@/utils/axiosUtil'
import FormUtil, { FormShape } from '@/utils/formUtil'
import TypeUtil from '@/utils/typeUtil'

type LocationServiceUpdateFormModalShape = FormShape<{
  image_file_path: string
}>

type LocationServiceUpdateFormModalProps = {
  isShow: boolean
  modalTitle: React.ReactNode
  initialValues?: Partial<LocationServiceUpdateFormModalShape>
  onSubmit: (values: LocationServiceUpdateFormModalShape) => Promise<void>
  onCancel: () => void
}

const defaultValues: LocationServiceUpdateFormModalShape = {
  image_file_path: '',
}

const LocationServiceUpdateFormModal: FC<LocationServiceUpdateFormModalProps> = (props) => {
  const alert = useAlert()
  const [error, setError] = useState<string>()

  return (
    <Modal
      centered
      show={props.isShow}
      onHide={() => {
        setError(undefined)
        props.onCancel()
      }}
    >
      <Modal.Header closeButton>
        <Modal.Title as="h3">{props.modalTitle}</Modal.Title>
      </Modal.Header>

      <Formik<LocationServiceUpdateFormModalShape>
        initialValues={props.initialValues ?? defaultValues}
        onSubmit={async (values, { setSubmitting, setErrors }) => {
          try {
            setSubmitting(true)
            await props.onSubmit(values)
          } catch (err) {
            if (AxiosUtil.isAxiosError(err)) {
              const errors = FormUtil.parseErrorResponse(err.response?.data.errors)
              if (errors) {
                setErrors(errors)
              } else {
                setError(err.response?.data.message || err.message)
              }
            } else {
              alert.error({ text: String(err) })
            }
          } finally {
            setSubmitting(false)
          }
        }}
      >
        {(formik) => (
          <Form
            onSubmit={formik.handleSubmit}
            noValidate
          >
            <Modal.Body className="scroll-y mx-5 mx-xl-15 my-7">
              <Alert
                show={TypeUtil.isDefined(error)}
                variant="danger"
                className="p-5 mb-10"
              >
                {error}
              </Alert>

              <FormControl>
                <FormControl.Label isRequired>
                  <FormattedMessage id="vocabulary.icon" />
                </FormControl.Label>
                <PermissionsControl
                  allow={[PermissionEnum.ADMIN_LOCATION_SERVICE_UPLOAD_IMAGE]}
                  renderError
                >
                  <FileInputField
                    name="image_file_path"
                    accept=".svg"
                    uploadFn={AdminLocationServicesAPI.uploadImage}
                    accessor={({ data }) => data.data.path}
                  />
                </PermissionsControl>
                <FormControl.ErrorMessage message={formik.errors.image_file_path} />
              </FormControl>
            </Modal.Body>

            <Modal.Footer className="justify-content-center">
              <Button
                theme="light"
                onClick={props.onCancel}
                disabled={formik.isSubmitting}
              >
                <FormattedMessage id="form.discard" />
              </Button>

              <Button
                theme="primary"
                type="submit"
                disabled={!formik.dirty}
                isLoading={formik.isSubmitting}
              >
                <FormattedMessage id="form.submit" />
              </Button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  )
}

export type { LocationServiceUpdateFormModalShape }

export default LocationServiceUpdateFormModal
