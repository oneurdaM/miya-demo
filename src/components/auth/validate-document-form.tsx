/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Controller, useForm } from 'react-hook-form'

import { DatePicker } from '@/components/ui/date-picker'
import ValidationError from '../ui/form-validation-error'

import { useModifyDocumentMutation } from '@/data/users'
import Card from '@/components/common/card'
import Description from '@/components/ui/description'
import Button from '@/components/ui/button'
import Label from '@/components/ui/label'
import PDFViewer from '../documents/PDFViewPage'
import { Checkbox } from 'rizzui'
import { Router, useRouter } from 'next/router'

type IProps = {
  initialValues?: any
  valid: boolean
  id: any
}

export default function ValidateDocumentForm({
  initialValues,
  valid,
  id,
}: IProps) {
  const { t } = useTranslation()

  const router = useRouter()
  const [documentsShow, setdocumentsShow] = useState(false)
  const [validNew, setValidNew] = useState(valid)

  const handleShowPDF = () => {
    setdocumentsShow(!documentsShow)
  }

  const { mutate: validateDocument, isLoading: loading } =
    useModifyDocumentMutation()

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<any>({
    defaultValues: {
      valid: initialValues?.valid ?? false,
      validUntil: initialValues?.validUntil
        ? new Date(initialValues?.validUntil)
        : new Date(),
    },
  })

  useEffect(() => {
    setValidNew(valid)

    reset({
      valid: initialValues?.valid ?? false,
      validUntil: initialValues?.validUntil
        ? new Date(initialValues?.validUntil)
        : new Date(),
    })
  }, [valid, initialValues])

  async function onSubmit(values: any) {
    const body = {
      id: id,
      validUntil: new Date(convertDate(values.validUntil)),
      valid: validNew ? validNew : false,
    }

    validateDocument({ ...body })
  }

  const handleCheck = (value: any) => {
    setValidNew(value)
  }

  function convertDate(date: string) {
    return new Date(date).toISOString().slice(0, -5)
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="my-5 flex flex-wrap border-b border-dashed border-border-base pb-8 sm:my-8">
          <Description
            title="Información del documento"
            details={t('form:form-validate-document-description') as string}
            className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
          />
          <Card className="mb-5 w-full sm:w-8/12 md:w-2/3">
            <div className="lg:flex justify-center ">
              <div className="w-full p-0 sm:w-1/2 sm:ps-2 ">
                <Label>{`Fecha de expiración *`}</Label>

                <Controller
                  control={control}
                  name="validUntil"
                  render={({ field: { onChange, onBlur, value } }) => (
                    //@ts-ignore
                    <DatePicker
                      placeholderText="Fecha de expiración"
                      isClearable={true}
                      dateFormat="dd/MM/yyyy"
                      onChange={onChange}
                      onBlur={onBlur}
                      selected={value}
                      selectsEnd
                      className="flex h-12 w-full appearance-none items-center rounded-md px-4 text-sm text-heading transition duration-300 ease-in-out focus:border-accent focus:outline-none"
                    />
                  )}
                />
                <ValidationError
                  message={errors.expiredAt?.message?.toString() ?? ''}
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
              </div>
            </div>
          </Card>
          <div className="w-full text-end">
            <Button>Guardar Documento</Button>
            {/* 
            <Button
              type="button"
              className=" bg-gray-600 mx-3 "
              onClick={handleShowPDF}
            >
              {!documentsShow ? 'Visualizar documento' : 'Cerrar documento'}
            </Button> */}
            <a
              className="bg-gray-500 text-white font-bold py-4 px-7 rounded-md mx-3 hover:bg-gray-800"
              href={initialValues?.filePath}
              target="_blank"
              rel="noopener noreferrer"
            >
              Ver PDF
            </a>

            <Button
              type="button"
              onClick={() => router.back()}
              className="bg-zinc-600 mx-3"
            >
              {t('form:form-button-back')}
            </Button>
          </div>
        </div>
      </form>

      {/* {documentsShow && <PDFViewer pdfUrl={initialValues.filePath} />} */}
    </>
  )
}
