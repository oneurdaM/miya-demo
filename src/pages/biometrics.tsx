import FaceRecognitionComponent from "@/components/auth/face-recognition";
import AuthPageLayout from "@/components/layout/auth-layout";
import {GetServerSideProps} from "next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";


export const getServerSideProps: GetServerSideProps = async ({
	locale,
}: any) => {
	return {
		props: {
			...(await serverSideTranslations(locale!,["common","form"])),
		},
	};
};

const BiometricsPage = () => {
	return (
		<AuthPageLayout>
			<FaceRecognitionComponent />
		</AuthPageLayout>
	);
}

export default BiometricsPage;
