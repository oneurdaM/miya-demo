import dynamic from 'next/dynamic'
const AdminDashboard = dynamic(() => import('@/components/layout/admin'))

export default function AppLayout() {
  return <AdminDashboard />
}
