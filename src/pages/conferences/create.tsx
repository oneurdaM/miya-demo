import {useTranslation} from "react-i18next"
import HostConference from "@/components/conferences/conference-form"
import {serverSideTranslations} from "next-i18next/serverSideTranslations"
import Layout from '@/components/layout/admin'


export default function CreateConference() {
	const {t} = useTranslation()

	return (
		<>
			<div className="flex border-b border-dashed border-border-base py-5 sm:py-8">
				<h1 className="text-lg font-semibold text-heading">
					{t('form:input-host-conference')}
				</h1>
			</div>
			<HostConference />
		</>
	)
}

CreateConference.Layout = Layout

export const getStaticProps = async ({locale}: any) => ({
	props: {
		...(await serverSideTranslations(locale,['common','form'])),
	},
})
