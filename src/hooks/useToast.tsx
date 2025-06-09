import toast from 'react-hot-toast'

const useToast = () => {
  const error = (message: string) => {
    return toast.error(message)
  }

  const info = (message: string) => {
    return toast(message, {
      icon: <i className="fa-solid fa-circle-info fs-2 text-info" />,
    })
  }

  const warning = (message: string) => {
    return toast(message, {
      icon: <i className="fa-solid fa-triangle-exclamation fs-2 text-warning" />,
    })
  }

  const success = (message: string) => {
    return toast.success(message)
  }

  const loading = (message: string) => {
    return toast.loading(message)
  }

  const promise = toast.promise

  return {
    error,
    info,
    warning,
    loading,
    success,
    promise,
  }
}

export { useToast }
