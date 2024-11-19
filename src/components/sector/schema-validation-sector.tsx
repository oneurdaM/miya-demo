import * as yup from 'yup'

export const SectoreSchema = yup.object().shape({
  name: yup.string().required('El nombre es requerido'),
})
