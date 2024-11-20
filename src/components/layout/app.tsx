import dynamic from 'next/dynamic'
import { ADMIN, SUPER_ADMIN } from '@/utils/constants'
import OwnerLayout from './staff'

const AdminDashboard = dynamic(() => import('@/components/layout/admin'))

export default function AppLayout({
  userPermissions,
  ...props
}: {
  userPermissions: string
}) {
  // if (userPermissions === SUPER_ADMIN || userPermissions === ADMIN) {
  return <AdminDashboard {...props} />
  // }

  // return <OwnerLayout {...props} />
}
