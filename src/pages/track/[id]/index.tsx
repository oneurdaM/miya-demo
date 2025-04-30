import {useRouter} from 'next/router'
import {serverSideTranslations} from 'next-i18next/serverSideTranslations'
import Layout from '@/components/layout/admin'
import ErrorMessage from '@/components/ui/error-message'
import Loader from '@/components/ui/loader/loader'
import {useUserQuery} from '@/data/user'
import {ICON,LATITUDE,LONGITUDE} from '@/utils/constants'
import Card from '@/components/common/card'
import PageHeading from '@/components/common/page-heading'
import {useTranslation} from 'react-i18next'
import {useUsersQuery} from '@/data/users'
import {switchJobPosition,UsersResponse} from '@/types/users'
import {useEffect,useState} from 'react'
import MapTrackUserId from '@/components/track/map-track-user-id'
import UserJobposition from '@/components/ui/userJobposition'
import {Routes} from '@/config/routes'
import {
  getAuthCredentials,
  isAuthenticated,
  hasAccess,
  allowedRoles,
} from '@/utils/auth-utils'
import {GetServerSideProps} from 'next'
import {useSocketContext} from '@/contexts/socket.context'

export default function UserPage() {
  const {trackUser,user_track} = useSocketContext(); // Agrega el método y estado del contexto
  const { all_users, online_users } = useSocketContext()

  const {t} = useTranslation();
  const router = useRouter();
  const {
    query: {id},
  } = router;

  const {user,loading,error} = useUserQuery({
    id: Number(id),
  });


  const jobPosition = user?.jobPosition?.name;
  const firstName = user?.firstName || 'Cargando';
  const lastName = user?.lastName || '. . .';

  useEffect(() => {
    if (id) {
      trackUser(String(id));
    }
  },[id,trackUser]);

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error.message} />;

// Buscar al usuario online correspondiente
const onlineUser = online_users?.find((u) => String(u.id) === id);

// Extraer coordenadas si existen
const latitude = onlineUser?.location?.latitude ?? LATITUDE;
const longitude = onlineUser?.location?.longitude ?? LONGITUDE;

  return (
    <Card className="mb-8 flex flex-col">
      <div className="flex w-full justify-between flex-col items-center md:flex-row">
        <div className="mb-4 md:mb-0 md:w-1/4 ">
          <PageHeading title={t('form:input-label-track-users')} />
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between mt-10">
        <div className="mb-5 md:mb-0">
          <UserJobposition
            firstName={firstName}
            lastName={lastName}
            jobposition={jobPosition}
          />
        </div>
      </div>

      <div className="flex gap-7 justify-center md:gap-8 lg:grid-cols-2 2xl:grid-cols-12">
        <MapTrackUserId
          title={'Users'}
          latitude={latitude || LATITUDE}
          longitude={longitude || LONGITUDE}
          userId={id}
        />
      </div>
    </Card>
  );
}

UserPage.Layout = Layout;


export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const {token,permissions} = getAuthCredentials(ctx)
  const locale = ctx.locale || 'es'
  if (
    !isAuthenticated({token,permissions}) ||
    !hasAccess(allowedRoles,permissions)
  ) {
    return {
      redirect: {
        destination: Routes.login,
        permanent: false,
      },
    }
  }
  return {
    props: {
      userPermissions: permissions,
      ...(await serverSideTranslations(locale,['table','common','form'])),
    },
  }
}
