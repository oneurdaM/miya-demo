import * as yup from 'yup'

export const ProfileSchema = yup.object().shape({
  email: yup.string().email().required('El correo es requerido'),
  firstName: yup.string().required('El nombre es requerido'),
  lastName: yup.string().required('El apellido es requerido'),
  role: yup.object().required('EL rol es requerido'),
  image: yup.string().required('La imagen es requerida'),
  shift: yup.object().required('El horario es requerido'),
  jobPositionId: yup.object().required('La posición es requerida'),
  password: yup.string().required('La contraseña es requerida'),
  sector: yup.object().required('El sector es requerido'),
})
