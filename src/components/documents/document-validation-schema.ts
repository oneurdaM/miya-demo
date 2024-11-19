import * as yup from 'yup'

export const documentValidationSchema = yup.object().shape({
  validUntil: yup.string().required('El contenido es requerido'),
  documentType: yup.object().required('La posición es requerida'),
  filePath: yup.mixed()
  .required('Se requiere un archivo')
  .test('fileSize', 'Se requiere un archivo PDF', value => {
    //@ts-ignore
    return value && value.length > 0;
  }),
})
