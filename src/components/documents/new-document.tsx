import {useForm,Controller} from 'react-hook-form';

import Description from '../ui/description';
import Card from '../common/card';
import FileInput from '../ui/file-input';
import Input from '../ui/input';
import Button from '../ui/button';
import SwitchInput from '../ui/switch-input';
import Image from 'next/image';
import {useUpdateDocumentatMutation,useCreateDocumentMutation,useDocumentTypesQuery} from '@/data/documents';
import {Document,CreateDocument} from '@/types/documents';
import {useUsersQuery} from '@/data/users';
import Select from '../select/select';
import {useModalAction} from '../ui/modal/modal.context';

type DocumentFormProps = {
	initialValues?: Document;
};

export default function CreateOrUpdateDocumentForm({initialValues}: DocumentFormProps) {
	const {closeModal} = useModalAction();
	const {
		mutate: updateDocument,
		isLoading: updating,
	} = useUpdateDocumentatMutation();
	const {
		mutate: createDocument,
		isLoading: creating,
	} = useCreateDocumentMutation();

	const {
		documentTypes,
		loading: loadingDocumentTypes,
	} = useDocumentTypesQuery();

	const {register,handleSubmit,control,formState: {errors}} = useForm<CreateDocument>({
		defaultValues: initialValues ?? {
			documentType: '',
			issuedAt: '',
			validUntil: '',
			filePath: '',
			valid: false,
		},
	});

	const {users,loading: loadingUsers} = useUsersQuery({
		limit: 100,
		page: 1,
	});

	// Mapear opciones de tipos de documento
	const documentTypeOptions = documentTypes?.map((docType: any) => ({
		label: docType.name,
		value: docType.id,
	})) ?? [];



	// Mapear opciones de usuarios
	const userOptions = users?.map((user: any) => ({
		label: `${user.firstName} ${user.lastName}`,
		value: user.id,
		id: user.id,
		jobPositionId: user.jobPositionId,
	})) ?? [];



	async function onSubmit(values: any) {
		console.log('values',values);

		const payload: CreateDocument = {
			documentType: values.documentType.value,
			userId: values.user.value,
			jobPositionId: values.user.jobPositionId,
			issuedAt: values.issuedAt,
			validUntil: new Date(values.validUntil).toISOString(), // Formatea a ISO
			valid: values.valid,
		};
		if (initialValues) {
			updateDocument({
				id: initialValues.id.toString(),
				...payload,
			});
		} else {
			createDocument({
				...payload,
				filePath: values.filePath || null,
			});
		}

		closeModal();
	}
	return (
		<Card>
			<form onSubmit={handleSubmit(onSubmit)} noValidate>
				<div className="sm:my8 my-5 flex flex-wrap">

					<Description
						title="Archivo del documento"
						className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
						details="Suba el archivo del documento. Se aceptan PDF e imágenes."
					/>
					<Card className="mb-5 w-full sm:w-8/12 md:w-2/3">
						<FileInput name="filePath" control={control} multiple={false} />
						{initialValues?.filePath ? (
							<Image src={initialValues.filePath} width={100} height={100} alt="Documento" />
						) : null}
					</Card>

					<Description
						title="Detalles del Documento"
						className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
						details="Información básica del documento."
					/>
					<Card className="w-full sm:w-8/12 md:w-2/3">
						<Controller
							control={control}
							name="documentType"
							render={({field}) => (
								<Select
									className="my-3"
									options={documentTypeOptions}
									isLoading={loadingDocumentTypes}
									placeholder="Selecciona tipo de documento"
									{...field}
								/>
							)}
						/>

						<Input
							variant="outline"
							label="Fecha de Emisión"
							type="date"
							{...register('issuedAt',{required: true})}
							error={errors.issuedAt?.message}
							className="mb-2"
						/>
						<Input
							variant="outline"
							label="Fecha de Expiración"
							type="date"
							{...register('validUntil')}
							error={errors.validUntil?.message}
							className="mb-2"
						/>

						<Controller
							control={control}
							name="user"
							render={({field}) => (
								<Select
									className="my-3"
									options={userOptions}
									isLoading={loadingUsers}
									placeholder="Selecciona perfil de usuario"
									isClearable={true}
									{...field}
								/>
							)}
						/>

						<div className="flex items-center mt-2">
							<SwitchInput
								control={control}
								name="valid"
								label="Válido"
								disabled={false}
								className="mb-2"
							/>
						</div>
					</Card>
				</div>

				<div className="mb-4 text-end">
					<Button loading={updating || creating} disabled={updating || creating}>
						Crear Documento
					</Button>
				</div>
			</form>
		</Card>
	);
}
