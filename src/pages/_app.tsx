import { useEffect, useState } from 'react'
import { Router, useRouter } from 'next/router'
import type { AppProps } from 'next/app'
import { appWithTranslation } from 'next-i18next'
import { ToastContainer } from 'react-toastify'
import { QueryClient, QueryClientProvider } from 'react-query'
import { Hydrate } from 'react-query/hydration'
import { ReactQueryDevtools } from 'react-query/devtools'

import 'react-toastify/dist/ReactToastify.css'
import '@/assets/css/main.css'
import '@fancyapps/ui/dist/fancybox/fancybox.css'
import "react-multi-carousel/lib/styles.css";


import { SettingsProvider } from '@/contexts/settings.context'
import { UIProvider } from '@/contexts/ui.context'
import { SocketProvider } from '@/contexts/socket.context'

import { useSettingsQuery } from '@/data/settings'

import ErrorMessage from '@/components/ui/error-message'
import PageLoader from '@/components/ui/page-loader/page-loader'
import { ModalProvider } from '@/components/ui/modal/modal.context'
import DefaultSeo from '@/components/ui/default-seo'
import ManagedModal from '@/components/ui/modal/managed-modal'
import PrivateRoute from '@/utils/private-route'
import { Config } from '@/config'
import type { NextPageWithLayout } from '@/types'
import Script from 'next/script'
import * as ga from '@/config/analitycs'

const Noop: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <>{children}</>
)

const AppSettings: React.FC<{ children?: React.ReactNode }> = (props) => {
  const { settings, loading, error } = useSettingsQuery()
  if (loading) return <PageLoader />
  if (error) return <ErrorMessage message={error.message} />
  return <SettingsProvider initialValue={settings?.options} {...props} />
}
type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

const CustomApp = ({ Component, pageProps }: AppPropsWithLayout) => {
  const Layout = (Component as any).Layout || Noop
  const authProps = (Component as any).authenticate
  const [queryClient] = useState(() => new QueryClient())
  const getLayout = Component.getLayout ?? ((page) => page)
  const router = useRouter()

  const { locale } = useRouter()
  const dir = Config.getDirection(locale)

  useEffect(() => {
    const handleRouteChange = (url: URL) => {
      ga.pageview(url)
    }
    router.events.on('routeChangeComplete', handleRouteChange)
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events])

  return (
    <div dir={dir}>
      <QueryClientProvider client={queryClient}>
        <Hydrate state={pageProps?.dehydratedState}>
          <AppSettings>
            <SocketProvider>
              <UIProvider>
                <ModalProvider>
                  <>
                    <DefaultSeo />
                    <Script
                      src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALITYCS}`}
                      strategy="afterInteractive"
                    />
                    <Script id="google-analytics" strategy="afterInteractive">
                      {` window.dataLayer = window.dataLayer || []; 
                        function gtag(){window.dataLayer.push(arguments);}
                        gtag('js', new Date());
                        gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALITYCS}');`}
                    </Script>

                    {authProps ? (
                      <PrivateRoute authProps={authProps}>
                        <Layout {...pageProps}>
                          <Component {...pageProps} />
                        </Layout>
                      </PrivateRoute>
                    ) : (
                      <Layout {...pageProps}>
                        <Component {...pageProps} />
                      </Layout>
                    )}
                    <ToastContainer autoClose={2000} theme="colored" />
                    <ManagedModal />
                  </>
                </ModalProvider>
              </UIProvider>
            </SocketProvider>
          </AppSettings>
          <ReactQueryDevtools />
        </Hydrate>
      </QueryClientProvider>
    </div>
  )
}

export default appWithTranslation(CustomApp)
