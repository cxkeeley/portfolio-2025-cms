import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import axios from 'axios'
import { createRoot } from 'react-dom/client'
import { Toaster, ToastOptions } from 'react-hot-toast'

import { ToastBar } from '@components/ToastBar'

import { AuthProvider } from '@modules/auth/core/AuthProvider'
import { I18nProvider } from '@modules/i18n/core/I18nProvider'
import { SplashScreenProvider } from '@modules/splash-screen/core/SplashScrenProvider'

import { LayoutProvider } from '@/layouts/core'
import { setupAxios } from '@/libs/axios'
import { AppRoutes } from '@/routes/AppRoutes'

import '@/assets/sass/style.react.scss'
import '@/assets/sass/plugins.scss'
import '@/assets/sass/style.scss'

/**
 * Creates `axios-mock-adapter` instance for provided `axios` instance, add
 * basic Metronic mocks and returns it.
 *
 * @see https://github.com/ctimmerm/axios-mock-adapter
 */
/**
 * Inject Metronic interceptors for axios.
 *
 * @see https://github.com/axios/axios#interceptors
 */
setupAxios(axios)

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: 0,
      refetchOnWindowFocus: false,
    },
  },
})

const toastOptions: ToastOptions = {
  duration: 2500,
  position: 'bottom-right',
}

const container = document.getElementById('root')
if (container) {
  createRoot(container).render(
    <QueryClientProvider client={queryClient}>
      <I18nProvider>
        <SplashScreenProvider>
          <LayoutProvider>
            <AuthProvider>
              <AppRoutes />
            </AuthProvider>
          </LayoutProvider>
        </SplashScreenProvider>
      </I18nProvider>
      <Toaster toastOptions={toastOptions}>{(t) => <ToastBar toast={t} />}</Toaster>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
