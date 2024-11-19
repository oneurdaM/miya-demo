/* eslint-disable @typescript-eslint/no-explicit-any */
import {useState} from 'react'
import {useDropzone} from 'react-dropzone'
import {useTranslation} from 'next-i18next'

import {UploadIcon} from '@/components/icons/upload-icon'
import Loader from '@/components/ui/loader/loader'
import {useUploadMutation} from '@/data/upload'
import Image from 'next/image'

interface UploaderProps {
  onChange: (url: string) => void;
  multiple: boolean;
  helperText?: string;
}

export default function Uploader({onChange,multiple,helperText}: UploaderProps) {
  const {t} = useTranslation()
  const [pdf,setPdf] = useState<string>('')
  const {mutate: upload,isLoading: loading} = useUploadMutation()
  const [error,setError] = useState<string | null>(null)
  const {getRootProps,getInputProps} = useDropzone({
    multiple,
    accept: {
      'application/pdf': [], // Aceptar solo archivos PDF
    },
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles.length > 1 && !multiple) {
        setError(t('text-multiple-files'))
        return
      }
      const formData = new FormData()
      acceptedFiles.forEach((file: File) => {
        formData.append('file',file)
      })
      try {
        upload(formData,{
          onSuccess: (data: unknown) => {
            if (typeof data === 'string') {
              setPdf(data)
              onChange(data)
            }
          },
        })
      } catch (e: any) {
        setError(e.message)
      }
    },
  })

  return (
    <section className="upload">
      <div
        {...getRootProps({
          className:
            'border-dashed border-2 border-border-base h-36 rounded flex flex-col justify-center items-center cursor-pointer focus:border-accent-400 focus:outline-none',
        })}
      >
        <input {...getInputProps()} />
        <UploadIcon className="text-muted-light" />
        <p className="mt-4 text-center text-sm text-body">
          {helperText ? (
            <span className="font-semibold text-gray-500">{helperText}</span>
          ) : (
            <>
              <span className="font-semibold text-accent">
                {t('text-upload-highlight-pdf')}
              </span>{' '}
              {t('text-upload-message')} <br />
              <span className="text-xs text-body">{t('text-pdf-format')}</span>
            </>
          )}
        </p>
        {error && (
          <p className="mt-4 text-center text-sm text-red-600">{error}</p>
        )}
      </div>

      {(!!pdf || loading) && (
        <aside className="mt-2 flex flex-wrap">
          {!loading && (
            <div
              className={`relative mt-2 inline-flex flex-col overflow-hidden rounded  me-2`}
            >
              <figure className="relative h-16 w-28">
                <Image
                  src="/pdf.png"
                  alt={'PDF preview'}
                  className="object-contain h-full w-full"
                />
              </figure>
            </div>
          )}
          {loading && (
            <div className="mt-2 flex h-16 items-center ms-2">
              <Loader simple={true} className="h-6 w-6" />
            </div>
          )}
        </aside>
      )}
    </section>
  )
}
