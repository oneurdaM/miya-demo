import { FC } from 'react'
import dynamic from 'next/dynamic'
import { IJitsiMeetingProps } from '@jitsi/react-sdk/lib/types'

import Layout from '@/components/layout/admin'
import { useRouter } from 'next/router'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

const JitsiMeeting = dynamic(
  () =>
    import('@jitsi/react-sdk').then(({ JitsiMeeting }) => JitsiMeeting) as any,
  {
    ssr: false,
  }
) as FC<IJitsiMeetingProps>

export default function JitsiMeetComponent() {
  const { query } = useRouter()

  return (
    <>
      <JitsiMeeting
        roomName={query.roomName as string}
        configOverwrite={{
          startWithAudioMuted: true,
          disableModeratorIndicator: true,
          startScreenSharing: true,
          enableEmailInStats: false,
        }}
        interfaceConfigOverwrite={{
          DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
        }}
        // FIXIT: This is a temporary solution to fix the issue with the Jitsi Meet SDK
        userInfo={{
          displayName: `Jhon Doe`,
          email: 'admin@gmail.com',
        }}
        onApiReady={(externalApi) => {
          // here you can attach custom event listeners to the Jitsi Meet External API
          // you can also store it locally to execute commands
        }}
        getIFrameRef={(iframeRef) => {
          iframeRef.style.height = '800px'
        }}
      />
    </>
  )
}

JitsiMeetComponent.Layout = Layout

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common', 'form', 'table'])),
  },
})
