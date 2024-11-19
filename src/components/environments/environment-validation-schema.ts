import * as yup from 'yup'

export const environmentValidationSchema = yup.object().shape({
  name: yup.string().required('El nombre del entorno es requerido'),
  description: yup.string().required('La descripción del entorno es requerido'),
  primary_color: yup.string().required('El color primario es obligatorio'),
  // active: yup.boolean(),
  logo: yup.string().required('El logo primario es obligatorio'),
})
