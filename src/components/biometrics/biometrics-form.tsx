import {useCallback,useRef} from "react";
import {useTranslation} from "react-i18next";
import Webcam from "react-webcam";

import StickyFooterPanel from "@/components/ui/sticky-footer-panel";
import Description from "@/components/ui/description";
import Card from "@/components/common/card";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";

type BiometricCreateFormProps = {
	setCaptureVideo: any;
	modelsLoaded: boolean;
	captureVideo: boolean;
	videoRef: any;
	canvasRef: any;
}

const BiometricCreateForm = ({setCaptureVideo,captureVideo}: BiometricCreateFormProps) => {
	const {t} = useTranslation();
	const webcamRef = useRef<Webcam | null>(null);

	const videoConstraints = {
		width: 1280,
		height: 720,
		facingMode: "user"
	};

	const capture = useCallback(
		() => {
			setCaptureVideo(true);
		},
		[webcamRef]
	);

	const closeWebcam = () => {
		if (webcamRef?.current) {
			setCaptureVideo(false);
		}
	}

	return (
		<>
			<div className="my-5 flex flex-wrap sm:my-8">
				<Description
					title={t('form:form-biometric-title-information') ?? ''}
					details={t('form:biometric-form-info-help-text') ?? ''}
					className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
				/>

				<Card className="w-full sm:w-8/12 md:w-2/3">
					<div className="mb-4 rounded-sm">
						{
							captureVideo ?
								<Webcam
									audio={false}
									height={720}
									ref={webcamRef}
									screenshotFormat="image/jpeg"
									width={1280}
									videoConstraints={videoConstraints}
								/> :
								null
						}
					</div>
					<Input
						label={t('form:form-label-first-name') ?? ''}
						name="first_name"
						type="text"
						variant="outline"
						className="mb-4"
						required
					/>
					{
						captureVideo ?
							<Button onClick={closeWebcam}>
								{t('form:close-webcam')}
							</Button> :
							<Button onClick={capture}>
								{t('form:open-webcam')}
							</Button>
					}
				</Card>

			</div>
			<StickyFooterPanel className="z-0">
				<div className="mb-4 text-end">
					<Button loading={false} disabled={false}>
						{t('form:button-upload-biometric')}
					</Button>
				</div>
			</StickyFooterPanel>
		</>
	);
}

export default BiometricCreateForm;