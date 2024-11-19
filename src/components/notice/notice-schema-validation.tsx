import * as yup from 'yup'

export const noticeSchema = yup.object().shape({
  priority: yup.object().required('El nombre del entorno es requerido'),
  notice: yup.string().required('El título es requerido'),
  description: yup.string().required('La descripción es requerida'),
  effectiveFrom: yup.date().required('La fecha es requerida'),
  expiredAt: yup.date().required('La fecha de expiración es requerida'),
  environmentId: yup.object().required('El entorno es requerido'),
})
