import { useIntl } from 'react-intl'
import Swal from 'sweetalert2'
import withReactContent, { ReactSweetAlertOptions } from 'sweetalert2-react-content'

import { KTSVG } from '@components/KTSVG'

type AlertProps = ReactSweetAlertOptions

const useAlert = () => {
  const intl = useIntl()

  const alert = withReactContent(
    Swal.mixin({
      buttonsStyling: false,
      closeButtonHtml: '<span class="btn-close"></span>',
      customClass: {
        title: 'fs-2 fw-semibold',
        htmlContainer: 'text-gray-600 fs-4',
        cancelButton: 'btn btn-secondary',
        confirmButton: 'btn btn-primary',
        denyButton: 'btn btn-danger',
      },
    })
  )

  const success = (props: AlertProps) => {
    return alert.fire({
      ...props,
      icon: 'success',
      iconHtml: (
        <KTSVG
          path="/media/svg/alert/alert-success.svg"
          svgClassName="w-100 h-100"
        />
      ),
    })
  }

  const info = (props: AlertProps) => {
    return alert.fire({
      ...props,
      showCloseButton: true,
      icon: 'info',
      iconHtml: (
        <KTSVG
          path="/media/svg/alert/alert-info.svg"
          svgClassName="w-100 h-100"
        />
      ),
    })
  }

  const warning = (props: AlertProps) => {
    const cancelButtonText = props.cancelButtonText || intl.formatMessage({ id: 'alert.button.cancel' })

    return alert.fire({
      ...props,
      cancelButtonText,
      showCancelButton: !!cancelButtonText,
      showCloseButton: true,
      icon: 'warning',
      iconHtml: (
        <KTSVG
          path="/media/svg/alert/alert-warning.svg"
          svgClassName="w-100 h-100"
        />
      ),
    })
  }

  const error = (props: AlertProps) => {
    return alert.fire({
      title: props.title,
      text: props.text,
      confirmButtonText: props.confirmButtonText ?? 'OK',
      icon: 'error',
      iconHtml: (
        <KTSVG
          path="/media/svg/alert/alert-error.svg"
          svgClassName="w-100 h-100"
        />
      ),
    })
  }

  const question = (props: AlertProps) => {
    const cancelButtonText = props.cancelButtonText || intl.formatMessage({ id: 'alert.button.cancel' })

    return alert.fire({
      cancelButtonText,
      showCancelButton: !!cancelButtonText,
      showCloseButton: true,
      icon: 'question',
      iconHtml: (
        <KTSVG
          path="/media/svg/alert/alert-question.svg"
          svgClassName="w-100 h-100"
        />
      ),
      ...props,
    })
  }

  return {
    success,
    warning,
    error,
    info,
    question,
  }
}

export { useAlert }
