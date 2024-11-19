import { useSettingsQuery } from '@/data/settings'

import { useMeQuery } from '@/data/user'
import VisitStore from './visit-store'
import SearchBar from './search-bar'
import MessageBar from './message-bar'
import StoreNoticeBar from './store-notice-bar'
import RecentOrderBar from './recent-order-bar'

type IProps = {}

const DashboardTopBar = ({}: IProps) => {
  const { data, loading: meLoading, error: meError } = useMeQuery()
  const {
    // @ts-ignore
    settings: { options },
  } = useSettingsQuery()

  return (
    <>
      <div className="mb-6 overflow-hidden rounded shadow">
        <VisitStore />
        <SearchBar />

        {options?.pushNotification?.all?.message ? (
          <MessageBar user={data} />
        ) : (
          ''
        )}

        {options?.pushNotification?.all?.storeNotice ? (
          <StoreNoticeBar user={data} />
        ) : (
          ''
        )}

        {options?.pushNotification?.all?.order ? (
          <RecentOrderBar user={data} />
        ) : (
          ''
        )}
      </div>
    </>
  )
}

export default DashboardTopBar
