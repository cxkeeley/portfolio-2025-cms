import { Form, Formik, FormikHelpers } from 'formik'
import React, { FC, useState } from 'react'
import { Alert, Col, Row } from 'react-bootstrap'
import Modal from 'react-bootstrap/Modal'
import { FormattedMessage } from 'react-intl'

import { ID } from '@models/base'
import { Option } from '@models/option'

import { Button } from '@components/Button'
import FormControl from '@components/FormControl/FormControl'

import { PermissionsControl } from '@modules/permissions'
import ProjectServiceForProjectFormSelectField from '@modules/project-service/components/ProjectServiceForProjectFormSelectField'

import { PermissionEnum } from '@/constants/permission'
import { useAlert } from '@/hooks'
import AxiosUtil from '@/utils/axiosUtil'
import FormUtil, { FormDisabledFlags, FormShape } from '@/utils/formUtil'
import TypeUtil from '@/utils/typeUtil'

type ProjectServiceFormModalShape = FormShape<{
  project_service_id: Option
}>

type Props = {
  isShow: boolean
  modalTitle: React.ReactNode
  projectId: ID
  initialImageSrc?: string
  initialValues?: Partial<ProjectServiceFormModalShape>
  disabledFields?: Partial<FormDisabledFlags<ProjectServiceFormModalShape>>
  onSubmit: (values: ProjectServiceFormModalShape) => Promise<void>
  onCancel: () => void
  onHide: () => void
}

const defaultValues: ProjectServiceFormModalShape = {}

const ProjectServiceFormModal: FC<Props> = (props) => {
  const alert = useAlert()
  const [error, setError] = useState<string>()

  const onHide = () => {
    setError(undefined)
    props.onHide()
  }

  const handleSubmit = async (
    values: ProjectServiceFormModalShape,
    helpers: FormikHelpers<ProjectServiceFormModalShape>
  ) => {
    try {
      helpers.setSubmitting(true)
      await props.onSubmit(values)
    } catch (err) {
      if (AxiosUtil.isAxiosError(err)) {
        const errors = FormUtil.parseErrorResponse(err.response?.data.errors)
        if (errors) {
          helpers.setErrors(errors)
        } else {
          setError(err.response?.data.message || err.message)
        }
      } else {
        alert.error({ text: String(err) })
      }
    } finally {
      helpers.setSubmitting(false)
    }
  }

  return (
    <Modal
      size="lg"
      centered={true}
      show={props.isShow}
      onHide={onHide}
    >
      <Modal.Header closeButton>
        <Modal.Title as="h3">{props.modalTitle}</Modal.Title>
      </Modal.Header>

      <Formik<ProjectServiceFormModalShape>
        initialValues={props.initialValues ?? defaultValues}
        onSubmit={handleSubmit}
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

              <Row className="gap-7">
                <Col xs={12}>
                  <FormControl>
                    <FormControl.Label isRequired>
                      <FormattedMessage id="project.label.service" />
                    </FormControl.Label>
                    <PermissionsControl
                      renderError={true}
                      allow={[PermissionEnum.ADMIN_PROJECT_SERVICE_OPTION_FOR_PROJECT_FORM]}
                    >
                      <ProjectServiceForProjectFormSelectField
                        name="project_service_id"
                        projectId={props.projectId}
                        isDisabled={props.disabledFields?.project_service_id}
                      />
                    </PermissionsControl>
                    <FormControl.ErrorMessage message={formik.errors.project_service_id} />
                  </FormControl>
                </Col>
              </Row>
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

export type { ProjectServiceFormModalShape }

export default ProjectServiceFormModal
