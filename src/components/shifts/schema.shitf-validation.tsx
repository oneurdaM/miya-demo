import * as yup from 'yup'

export const ShiftSchema = yup.object().shape({
  name: yup.string().required('El nombre es requerido'),
  start: yup.string().required('La hora de inicio es requeridad'),
  end: yup.string().required('La hora de fin es requeridad'),
})
