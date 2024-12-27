/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useUpdateUserMutation } from '@/data/users'

import Card from '@/components/common/card'
import Description from '@/components/ui/description'

import Button from '@/components/ui/button'
import Label from '@/components/ui/label'

import TextArea from '../ui/text-area'
import { useRouter } from 'next/router'
import {
  useCreateSettingsMutation,
  useSettingsQuery,
  useUpdateSettingsMutation,
} from '@/data/settings'

export default function ProfileUpdateOrCreateForm({ initialValues }: any) {
  const { t } = useTranslation()
  const { mutate: updateUser, isLoading: loading } = useUpdateUserMutation()
  const router = useRouter()

  const {
    mutate: updateMutation,
    isLoading: updating,
    error: errorUpdating,
  } = useUpdateSettingsMutation()
  const {
    mutate: createMutation,
    isLoading: creating,
    error: errorCreating,
  } = useCreateSettingsMutation()

  const { settings } = useSettingsQuery()

  const [content, setContent] = useState(settings.terms ? settings.terms : '')

  async function onSubmit(values: any) {
    if (Object.keys(settings).length > 0) {
      const updateData = {
        id: settings.id,
        terms: content,
      }
      updateMutation(updateData)
    } else {
      const createData = {
        terms: content,
      }

      createMutation(createData)
    }
  }

  return (
    <>
      <div className="flex flex-wrap pb-8 my-5 border-b border-dashed border-border-base sm:my-8">
        <Description
          title={t('form:input-label-ters') ?? ''}
          details={t('form:terms-help-text') ?? ''}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <div className="mb-10">
            <span className=" ">
              <p className="text-center text-xl font-bold">
                Guía de Markdown para terminos y condiciones
              </p>
              <div className=" border-2 rounded-t-md p-3">
                Para utilizar encabezados usa "# Encabezado": # Prueba
                <div>
                  <span className="font-bold mr-2">Resultado:</span>
                  <span className="text-2xl font-bold">Prueba</span>
                </div>
              </div>
              <div className=" border-2 p-3">
                Texto en Negrita y Cursiva usa "*Cursiva*" o **Negritas**: -
                *Cursiva* - **Negritas**
                <div>
                  <span className="font-bold mr-2">Resultado:</span>
                  <span className="mr-2 font-bold">Negritas</span>
                  <span className="mr-2 italic">Cursiva</span>
                </div>
              </div>
              <div className=" border-2 p-3">
                Enlaces usar "[texto]"(url): - [Ejemplo texto](url) <br />
                <div>
                  <span className="font-bold">Resultado:</span>
                  <span className="text-blue-500 underline cursor-pointer">
                    Ejemplo texto
                  </span>
                </div>
              </div>
              <div className=" border-2 p-3">
                Linea separadora usa esto "---": ---
                <div className="mb-2">
                  <span className="font-bold">Resultado: </span>
                  <div className="border-b border-gray-200"></div>
                </div>
              </div>
              <div className=" border-2 p-3 rounded-b-md ">
                Para listas usa esto "-": - Ejemplo <br />
                <div className="flex">
                  <span className="mr-2 font-bold">Resultado:</span>{' '}
                  <li>Ejemplo</li>
                </div>
              </div>
            </span>
          </div>

          <Label>Terminos y condiciones</Label>
          <TextArea
            className=" "
            rows={15}
            name={''}
            onChange={(e) => {
              setContent(e.target.value)
            }}
            value={content}
          ></TextArea>
        </Card>
        <div className="w-full text-end mt-10">
          <Button
            type="button"
            onClick={() => router.back()}
            className="bg-zinc-600 mx-3"
          >
            {t('form:form-button-back')}
          </Button>

          <Button
            onClick={onSubmit}
            loading={loading || updating || creating}
            disabled={content.trim() === '' ? true : false}
          >
            {Object.keys(settings).length > 0
              ? t('form:form-update-terms')
              : t('form:form-creaate-terms')}
          </Button>
        </div>
      </div>
    </>
  )
}
