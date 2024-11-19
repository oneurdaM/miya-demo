import React,{useState} from 'react'
import {useTranslation} from 'react-i18next'

import {Controller,useForm} from 'react-hook-form'

import {DatePicker} from '@/components/ui/date-picker'

import {useCreateUserMutation,useUpdateUserMutation} from '@/data/users'
import {useShiftQuery} from '@/data/shift'

import Card from '@/components/common/card'
import Description from '@/components/ui/description'

import Button from '@/components/ui/button'
import Label from '@/components/ui/label'
import SelectInput from '@/components/ui/select-input'
import router,{useRouter} from 'next/router'

import {useUploadMutation} from '@/data/upload'
import {
  useSectorPutdQuery,
  userSectorListQuery,
  userSectorQuery,
} from '@/data/analytics'
import {yupResolver} from '@hookform/resolvers/yup'
import ValidationError from '../ui/form-validation-error'
import FileInputPdf from '../ui/file-input-pdf'
import {DocumentTypeOptions} from '@/utils/documentNames'
import {Checkbox} from 'rizzui'
import {documentValidationSchema} from './document-validation-schema'
import {addDays,getMonth,getYear} from 'date-fns'
import {
  useMeQuery,
  userDocumentByIdQuery,
  useUserByIdWithouTrackingQuery,
  useUserQuery,
} from '@/data/user'
import {capitalizeWords} from '@/utils/functions'
import {es} from 'date-fns/locale'
import {range} from '@/utils/slugglify'

type IProps = {}

type FormValue = {}

export default function DocumentAddUserForm({userId,files}: any) {
  const [startDate,setStartDate] = useState(new Date())
  const years = range(getYear(new Date()),2100,1)
  const months = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ]

  const {t} = useTranslation()
  const {mutate: updateUser,isLoading: loading} = useUpdateUserMutation()

  const router = useRouter()
  const {mutate: upload,isLoading: uploadLoading} = useUploadMutation()

  // const {
  //   mutate: create,
  //   isLoading: createLoading,
  //   error,
  // } = documentAddMutation()

  const {user: userById} = useUserQuery({
    id: userId,
  })

  // let filteredArray

  // if (documents?.data?.length > 0) {
  //   filteredArray = DocumentTypeOptions?.map((option: any) => ({
  //     ...option,
  //     isDisabled: documents?.data?.some(
  //       //@ts-ignore
  //       (doc: any) => doc.documentType === option.value
  //     ),
  //   }))
  // } else {
  //   filteredArray = DocumentTypeOptions
  // }

  const [validNew,setValidNew] = useState(false)

  const {
    register,
    control,
    handleSubmit,
    resetField,
    setValue,
    formState: {errors},
  } = useForm<any>({
    resolver: yupResolver(documentValidationSchema),
  })

  async function onSubmit(values: any) {
    const body = {
      documentType: values.documentType.value,
      jobPositionId: userById?.jobPosition?.id,
      validUntil: new Date(convertDate(values.validUntil)),
      valid: validNew ? validNew : false,
      userId: Number(userId),
      filePath: values.filePath,
    }

    // create(body)
  }

  const handleCheck = (value: any) => {
    setValidNew(value)
  }

  function convertDate(date: string) {
    return new Date(date).toISOString().slice(0,-5)
  }

  const formattedDocuments = userById?.jobPosition?.requireDocuments?.map(
    (doc) => ({
      label: capitalizeWords(doc.name),
      value: doc.id,
      isDisabled: userById.documents?.some(
        (userDoc: any) => userDoc.documentTypeId === doc.id
      ),
    })
  )

  return (
    <>
      <div className="flex flex-wrap pb-8 my-5 border-b border-dashed border-border-base sm:my-8">
        <Description
          title={t('form:input-label-text-file') ?? ''}
          details={t('form:pdf-help-text') ?? ''}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <FileInputPdf name="filePath" control={control} multiple={false} />
            <ValidationError
              message={(errors.filePath?.message as string) ?? ''}
            />

            <Label className="mb-4 mt-5">{`${t(
              'form:form-select-file'
            )}`}</Label>
            <SelectInput
              {...register('documentType')}
              control={control}
              getOptionLabel={(option: any) => option.label}
              getOptionValue={(option: any) => option.value}
              options={formattedDocuments ?? []}
              isMulti={false}
              isOptionDisabled={(option: any) => option.isDisabled}
            />
            <ValidationError
              message={(errors.documentType?.message as string) ?? ''}
            />

            <div className="flex w-full my-10">
              <div className="w-full">
                <Label>{`Fecha de expiración *`}</Label>

                <Controller
                  control={control}
                  name="validUntil"
                  render={({field: {onChange,onBlur,value}}) => (
                    //@ts-ignore
                    // <DatePicker
                    //   placeholderText="Fecha de expiración"
                    //   isClearable={true}
                    //   dateFormat="dd/MM/yyyy"
                    //   onChange={onChange}
                    //   onBlur={onBlur}
                    //   selected={value}
                    //   selectsEnd
                    //   minDate={addDays(new Date(), 0)} // Deshabilita fechas anteriores a hoy
                    //   className="flex h-12 w-full appearance-none items-center rounded-md px-4 text-sm text-heading transition duration-300 ease-in-out focus:border-accent focus:outline-none"
                    // />

                    <DatePicker
                      locale={es}
                      renderCustomHeader={({
                        date,
                        changeYear,
                        changeMonth,
                        decreaseMonth,
                        increaseMonth,
                        prevMonthButtonDisabled,
                        nextMonthButtonDisabled,
                      }) => (
                        <div
                          style={{
                            margin: 10,
                            display: 'flex',
                            justifyContent: 'center',
                          }}
                        >
                          <button
                            type="button"
                            onClick={decreaseMonth}
                            disabled={prevMonthButtonDisabled}
                          >
                            {'<'}
                          </button>
                          <select
                            value={getYear(date)}
                            onChange={({target: {value}}) =>
                              //@ts-ignore
                              changeYear(value)
                            }
                          >
                            {years.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>

                          <select
                            value={months[getMonth(date)]}
                            onChange={({target: {value}}) =>
                              changeMonth(months.indexOf(value))
                            }
                          >
                            {months.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>

                          <button
                            type="button"
                            onClick={increaseMonth}
                            disabled={nextMonthButtonDisabled}
                          >
                            {'>'}
                          </button>
                        </div>
                      )}
                      selected={startDate}
                      onChange={(date) => {
                        onChange(date)
                        //@ts-ignore

                        setStartDate(date)
                      }}
                    />
                  )}
                />

                <ValidationError
                  message={errors.validUntil?.message?.toString() ?? ''}
                />
              </div>

              <div className="w-full p-0 sm:w-1/2 sm:ps-2 ">
                <Label className="mb-6">{`Validez del documento`}</Label>
                <Checkbox
                  name="valid"
                  checked={validNew}
                  className="cursor-pointer ml-7"
                  onChange={(e) => {
                    handleCheck(e.target.checked)
                  }}
                />
                <ValidationError
                  message={errors.valid?.message?.toString() ?? ''}
                />
              </div>
            </div>
            <div className="w-full text-end mt-8">
              <Button
                type="button"
                onClick={() => router.back()}
                className="bg-zinc-600 mx-3"
              >
                {t('form:form-button-back')}
              </Button>
              <Button>
                Subir documento
                {/* {initialValues
                  ? t('form:form-update-user')
                  : t('form:form-create-user')} */}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </>
  )
}
