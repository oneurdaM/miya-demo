/* eslint-disable @typescript-eslint/no-explicit-any */
import {useForm} from 'react-hook-form'
import Image from 'next/image'
import {yupResolver} from '@hookform/resolvers/yup'
import {useRouter} from 'next/router'
import {useTranslation} from 'react-i18next'

import Card from '@/components/common/card'
import Button from '@/components/ui/button'
import Description from '@/components/ui/description'
import Input from '@/components/ui/input'
import Label from '@/components/ui/label'
import FileInput from '@/components/ui/file-input'
import SwitchInput from '@/components/ui/switch-input'

import {slugglify} from '@/utils/slugglify'
import {CreateCategoryInput} from '@/types/category'
import {CategoriesSchema} from './schema-categories-validation'

import {useCreateCategoryMutation} from '@/data/category'

const CategoryForm = ({defaultValues}: {defaultValues?: Partial<CreateCategoryInput>}) => {
  const {t} = useTranslation()

  const {mutate: createCategory,isLoading: creating} =
    useCreateCategoryMutation()

  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: {errors},
    control,
  } = useForm<any>({
    resolver: yupResolver(CategoriesSchema),
    defaultValues: defaultValues ?? {
      name: '',
      content: '',
      image: '',
      is_approved: false,
    },
  })

  async function onSubmit(values: CreateCategoryInput) {
    const body: any = {
      name: values.name,
      slug: slugglify(values.name),
      content: values.content,
      thumbnail: values.image,
      image: values.image,
      is_approved: values.is_approved,
    }
    createCategory(body)
  }

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)}>
      <div className="my-5 flex flex-wrap border-b border-dashed border-border-base pb-8 sm:my-8">
        <Description
          title="Imágen"
          details={'Sube una imágen para la categoría.'}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />
        <Card className="w-full sm:w-8/12 md:w-2/3">
          <FileInput name="image" control={control} multiple={false} />
          {defaultValues?.image && (
            <Image
              src={defaultValues?.image}
              alt="Category Image"
              width={100}
              height={100}
            />
          )}
        </Card>
      </div>
      <div className="my-5 flex flex-wrap sm:my-8">
        <Description
          title="Categoría"
          details="Esta categoría podrá ser utilizada para clasificar los articulos de tu blog."
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <Input
            label="Título"
            {...register('name')}
            type="text"
            variant="outline"
            className="mb-4"
            error={errors.name?.message?.toString()}
          />

          <div className="flex items-center gap-x-4">
            <SwitchInput name="is_approved" control={control} />
            <Label className="mb-0">Publicar</Label>
          </div>
        </Card>
      </div>
      <div className="mb-4 text-end">
        <Button
          type="button"
          onClick={() => router.back()}
          className="bg-zinc-600 mx-3"
        >
          {t('form:form-button-back')}
        </Button>

        <Button disabled={creating} loading={creating}>
          Crear
        </Button>
      </div>
    </form>
  )
}

export default CategoryForm
