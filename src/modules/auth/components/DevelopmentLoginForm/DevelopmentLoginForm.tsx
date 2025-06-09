import { Form, Formik } from 'formik'
import { FC, useState } from 'react'

import { Button } from '@components/Button'

import AxiosUtil from '@/utils/axiosUtil'
import FormUtil from '@/utils/formUtil'

import { UserSelectField } from './fields/UserSelectField'

export type DevelopmentLoginFormShape = {
  email: string
}

type Props = {
  onSubmit: (values: DevelopmentLoginFormShape) => Promise<void>
}

const DevelopmentLoginForm: FC<Props> = ({ onSubmit }) => {
  const [error, setError] = useState<string>()

  return (
    <Formik<DevelopmentLoginFormShape>
      validateOnChange={false}
      initialValues={{
        email: '',
      }}
      onSubmit={async (values, { setSubmitting, setErrors }) => {
        try {
          setSubmitting(true)

          await onSubmit(values)
        } catch (err) {
          if (AxiosUtil.isAxiosError(err)) {
            const errors = FormUtil.parseErrorResponse(err.response?.data.errors)
            if (errors) {
              setErrors(errors)
            }
            setError(err.response?.data.message)
            console.error(err)
          }
        } finally {
          setSubmitting(false)
        }
      }}
    >
      {({ handleSubmit, isSubmitting, dirty }) => (
        <Form
          className="form"
          onSubmit={handleSubmit}
          noValidate
        >
          {error && <div className="alert alert-danger d-flex align-items-center p-5 mb-10">{error}</div>}

          {/* begin::Email */}
          <UserSelectField name="email" />
          {/* end::Email */}

          {/* begin::Actions */}
          <div className="mt-10">
            <Button
              theme="primary"
              type="submit"
              className="w-100"
              isLoading={isSubmitting}
              disabled={isSubmitting || !dirty}
            >
              Login with Email
            </Button>
          </div>
          {/* end::Actions */}
        </Form>
      )}
    </Formik>
  )
}

export { DevelopmentLoginForm }
