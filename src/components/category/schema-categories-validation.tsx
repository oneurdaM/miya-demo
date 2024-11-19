import * as yup from 'yup'

export const CategoriesSchema = yup.object().shape({
  name: yup.string().required('El nombre es requerido'),
  image: yup.string().required('La imagen es requerida'),
})
