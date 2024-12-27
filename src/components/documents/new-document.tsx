import { useForm, Controller } from 'react-hook-form';
import Description from '../ui/description';
import Card from '../common/card';
import FileInput from '../ui/file-input';
import Input from '../ui/input';
import Button from '../ui/button';
import SwitchInput from '../ui/switch-input';
import Image from 'next/image';
import {
  useUpdateDocumentatMutation,
  useCreateDocumentMutation,
  useDocumentTypesQuery,
} from '@/data/documents';
import { CreateDocument, Document } from '@/types/documents';
import { useUsersQuery } from '@/data/users';
import Select from '../select/select';
import { useModalAction, useModalState } from '../ui/modal/modal.context';
import { useEffect, useState } from 'react';
import FileInputPdf from '../ui/file-input-pdf';

export default function CreateOrUpdateDocumentForm() {
  const { data } = useModalState();
  const { closeModal } = useModalAction();

  const { mutate: updateDocument, isLoading: updating } = useUpdateDocumentatMutation();
  const { mutate: createDocument, isLoading: creating } = useCreateDocumentMutation();

  const { documentTypes } = useDocumentTypesQuery();
  const [requiredDocuments, setRequiredDocuments] = useState([]); // Inicia con un array vacío
  const [selectedUser, setSelectedUser] = useState<any>({
	label: '',
	value: '',
	id: '',
	jobPositionId: '',
  }); 
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<CreateDocument>({
    defaultValues: data?.record ?? {
      documentType: '',
      issuedAt: '',
      validUntil: '',
      filePath: '',
      valid: false,
    },
  });

  const { users, loading: loadingUsers } = useUsersQuery({ limit: 100, page: 1 });


  const documentTypeOptions = requiredDocuments.map((docType: { name: string; id: string }) => ({
    label: docType.name,
    value: docType.id,
  }));

  const userOptions = users?.map((user) => ({
    label: `${user.firstName} ${user.lastName}`,
    value: user.id,
    id: user.id,
    jobPositionId: user.jobPositionId,
  })) ?? [];


  useEffect(() => {
    if (data?.record) {
      setRequiredDocuments(data.record.requiredDocuments || []); 
      setSelectedUser({
        label: `${data.record.firstName} ${data.record.lastName}`,
        value: data.record.userId,
        id: data.record.userId,
        jobPositionId: data.record.jobPositionId,
      });

      setValue('user', {
        label: `${data.record.firstName} ${data.record.lastName}`,
        value: data.record.userId,
        id: data.record.userId,
        jobPositionId: data.record.jobPositionId,
      });
    } else {
      setRequiredDocuments(documentTypes || []); 
    }
  }, [data, setValue, documentTypes]);

  async function onSubmit(values: any) {
    if (!values.documentType || !values.user) {
      alert('Por favor, completa todos los campos obligatorios.');
      return;
    }

    const payload: CreateDocument = {
      documentType: values.documentType.value,
      userId: values.user.value,
      jobPositionId: values.user.jobPositionId,
      issuedAt: values.issuedAt,
      validUntil: values.validUntil ? new Date(values.validUntil).toISOString() : undefined,
      valid: values.valid || false,
    };

    if (data?.record) {
      updateDocument({ id: data?.record.id.toString(), ...payload });
    } else {
      createDocument({ ...payload, filePath: values.filePath || null });
    }

    closeModal();
  }

  return (
    <Card>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="sm:my8 my-5 flex flex-wrap">
          {/* Archivo del Documento */}
          <Description
            title="Archivo del documento"
            className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
            details="Suba el archivo del documento. Se aceptan PDF e imágenes."
          />
          <Card className="mb-5 w-full sm:w-8/12 md:w-2/3">
            <FileInputPdf name="filePath" control={control} multiple={false} />
            {data?.record?.filePath && (
              <div className="mt-4">
                <Image
                  src={data?.record.filePath}
                  width={100}
                  height={100}
                  alt="Previsualización del Documento"
                  className="rounded"
                />
              </div>
            )}
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
              render={({ field }) => (
                <Select
                  className="my-3"
                  options={documentTypeOptions}
                  isLoading={!documentTypes}
                  placeholder="Selecciona tipo de documento"
                  {...field}
                />
              )}
            />
            <Input
              variant="outline"
              label="Fecha de Emisión"
              type="date"
              {...register('issuedAt', { required: 'La fecha de emisión es obligatoria.' })}
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
              defaultValue={selectedUser}
              render={({ field }) => (
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
            {data?.record ? 'Actualizar Documento' : 'Crear Documento'}
          </Button>
        </div>
      </form>
    </Card>
  );
}
