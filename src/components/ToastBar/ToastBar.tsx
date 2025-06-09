import { FC } from 'react'
import toast, { ToastBar as TB, Toast } from 'react-hot-toast'

type Props = {
  toast: Toast
}

const ToastBar: FC<Props> = ({ toast: t }) => {
  return (
    <TB toast={t}>
      {({ icon, message }) => (
        <div className="d-flex align-items-center py-1 px-2">
          <span>{icon}</span>
          <div className="flex-equal px-3">{message}</div>
          {t.type !== 'loading' && (
            <button
              type="button"
              style={{ border: 0, background: 'none' }}
              onClick={() => toast.dismiss(t.id)}
            >
              <i className="fa-solid fa-times" />
            </button>
          )}
        </div>
      )}
    </TB>
  )
}

export { ToastBar }
