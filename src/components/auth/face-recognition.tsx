import Router from 'next/router'
import {useTranslation} from 'react-i18next';
import {nanoid} from 'nanoid'

import {allowedRoles,hasAccess,setAuthCredentials} from '@/utils/auth-utils'

import WebcamComponent from "@/components/ui/webcam";
import {useUploadBiometrics} from '@/data/upload'
import Loader from '@/components/ui/loader/loader';
import {Routes} from '@/config/routes';
import {toast} from 'react-toastify';


const FaceRecognitionComponent = () => {
	const {t} = useTranslation()
	const {mutate: upload,isLoading: uploadLoading} = useUploadBiometrics()

	const onSave = (image: string) => {
		const id = nanoid(10)

		const formData = new FormData()
		const binaryData = atob(image.split(',')[1])
		const arrayBuffer = new ArrayBuffer(binaryData.length)

		const view = new Uint8Array(arrayBuffer)
		for (let i = 0; i < binaryData.length; i++) {
			view[i] = binaryData.charCodeAt(i)
		}

		const nameImage = `${id}.jpeg`
		const blob = new Blob([arrayBuffer],{type: 'image/jpeg'})
		formData.append('file',blob,nameImage)
		upload(formData,{
			onSuccess: (data: any) => {
				if (data.code == 200) {
					if (hasAccess(allowedRoles,data.role)) {
						setAuthCredentials(data.jwt,data.role);
						Router.push(Routes.dashboard);
					} else {
						toast.error(t('form:error-enough-permission'));
					}
				}
			},
			onError: (error: any) => {
				throw new Error(error)
			}
		})
	}

	if (uploadLoading) return (
		<div className="flex justify-center items-center h-screen">
			<Loader text={t("form:loading-biometric-data") ?? ''} />
		</div>
	)

	return (
		<>
			<WebcamComponent onSave={onSave} />
		</>
	);
}

export default FaceRecognitionComponent;