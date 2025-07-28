import { Form, Formik } from 'formik'
import { FC, useRef } from 'react'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import { FormattedMessage, useIntl } from 'react-intl'

import { Option } from '@models/option'

import { Button } from '@components/Button'
import { RadioButtonGroupField } from '@components/Form/RadioButtonGroup'
import { FormControl } from '@components/FormControl'
import { KTSVG } from '@components/KTSVG'
import { MenuFilterDropdown } from '@components/MenuFilterDropdown'

import { PermissionsControl } from '@modules/permissions'

import { PermissionEnum } from '@/constants/permission'
import { useBoolState } from '@/hooks'

import { ProjectFilterProjectGroupSelectField } from '../ProjectFilterProjectGroupSelectField'

type ProjectListFormFilterShape = {
  is_coming_soon?: boolean
  project_group_id?: Option
}

type ProjectListFormFilterProps = {
  initialValues?: ProjectListFormFilterShape | undefined
  onSubmit: (values: ProjectListFormFilterShape) => void
  onReset: () => void
  disabled?: boolean
}

const ProjectListFormFilter: FC<ProjectListFormFilterProps> = ({ initialValues, disabled, onSubmit, onReset }) => {
  const intl = useIntl()
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [isShowDropdown, toggleDropdown, , hideDropdown] = useBoolState()

  return (
    <>
      <Button
        ref={buttonRef}
        disabled={disabled}
        className="me-3"
        variant="light"
        theme="primary"
        onClick={toggleDropdown}
      >
        <KTSVG
          path="/media/icons/duotune/general/gen031.svg"
          className="svg-icon-2"
        />
        <FormattedMessage id="vocabulary.filter" />
      </Button>

      <MenuFilterDropdown
        isShow={isShowDropdown}
        onOuterClick={hideDropdown}
        targetRef={buttonRef}
        title={<FormattedMessage id="table.filter.title" />}
      >
        <Formik<ProjectListFormFilterShape>
          enableReinitialize
          initialValues={{ ...initialValues }}
          onSubmit={(values) => {
            onSubmit(values)
            hideDropdown()
          }}
          onReset={() => {
            onReset()
            hideDropdown()
          }}
        >
          {({ handleSubmit, errors }) => {
            return (
              <Form onSubmit={handleSubmit}>
                <Row className="gap-7 mb-7">
                  <Col xs={12}>
                    <FormControl>
                      <FormControl.Label>
                        <FormattedMessage id="project.label.status" />
                      </FormControl.Label>
                      <RadioButtonGroupField
                        direction="horizontal"
                        name="is_coming_soon"
                        options={[
                          {
                            value: null,
                            label: intl.formatMessage({ id: 'form.radio.all' }),
                          },
                          {
                            value: false,
                            label: intl.formatMessage({ id: 'form.radio.active' }),
                          },
                          {
                            value: true,
                            label: intl.formatMessage({ id: 'project.form.radio.coming_soon' }),
                          },
                        ]}
                      />
                      <FormControl.ErrorMessage message={errors.is_coming_soon} />
                    </FormControl>
                  </Col>

                  <Col xs={12}>
                    <FormControl>
                      <FormControl.Label>
                        <FormattedMessage id="model.project_group" />
                      </FormControl.Label>
                      <PermissionsControl
                        allow={PermissionEnum.ADMIN_PROJECT_GROUP_OPTION_FOR_PROJECT_FORM}
                        renderError
                      >
                        <ProjectFilterProjectGroupSelectField
                          name="project_group_id"
                          menuPosition="absolute"
                        />
                      </PermissionsControl>
                      <FormControl.ErrorMessage message={errors.project_group_id} />
                    </FormControl>
                  </Col>
                </Row>

                <div className="d-flex justify-content-end">
                  <Button
                    type="reset"
                    disabled={disabled}
                    variant="light"
                    activeColor="primary"
                    className="fw-medium me-2 px-6"
                  >
                    <FormattedMessage id="form.reset" />
                  </Button>

                  <Button
                    type="submit"
                    disabled={disabled}
                    theme="primary"
                    className="fw-medium px-6"
                  >
                    <FormattedMessage id="form.apply" />
                  </Button>
                </div>
              </Form>
            )
          }}
        </Formik>
      </MenuFilterDropdown>
    </>
  )
}

export type { ProjectListFormFilterShape, ProjectListFormFilterProps }

export default ProjectListFormFilter
