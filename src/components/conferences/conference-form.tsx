import {useTranslation} from "react-i18next";

import Description from "../ui/description";
import Card from "../common/card";
import Input from "../ui/input";
import Button from "../ui/button";
import {useRouter} from "next/router";
import {useForm} from "react-hook-form";

export default function HostConference() {
	const {t} = useTranslation()
	const router = useRouter()
	const {register,handleSubmit,formState: {errors}} = useForm<any>()

	async function onSubmit(values: {conferenceId: string}) {
		router.push(`/conferences/jitsi-meet?roomName=${values.conferenceId}`)
	}

	return (
		<form noValidate onSubmit={handleSubmit(onSubmit)}>
			<div className="my-5 flex flex-wrap sm:my-8">
				<Description
					title={t('form:input-label-host-conference') ?? ''}
					details={t('form:input-label-host-conference-details') ?? ''}
					className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
				/>

				<Card className="w-full sm:w-8/12 md:w-2/3">
					<Input
						label={t('form:input-label-conference-id') ?? ''}
						variant="outline"
						className="mb-5"
						{...register('conferenceId')}
					/>
				</Card>
			</div>

			<div className="mb-4 text-end sm:mb-8">
				<Button
					type="submit"
					className="w-full sm:w-auto">
					{t('form:button-label-host-conference') ?? ''}
				</Button>
			</div>
		</form>
	)
}