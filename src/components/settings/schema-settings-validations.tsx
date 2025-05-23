import * as yup from 'yup'

export const SettingsSchema = yup.object().shape({
  logo: yup.string().required('El logo es requerido'),
  siteName: yup.string().required('El nombre es requerido'),
  siteSubtitle: yup.string().required('El siteSubtitle es requerido'),
  metaTitle: yup.string().required('El metaTitle es requerido'),
  metaDescription: yup.string().required('El metaDescription es requerido'),
  metaTags: yup.string().required('El metaTags es requerido'),
  canonicalUrl: yup.string().required('El canonicalUrl es requerido'),
  ogTitle: yup.string().required('El ogTitle es requerido'),
  ogDescription: yup.string().required('El ogDescription es requerido'),
  ogImage: yup.string().required('El ogImage es requerido'),
  ogUrl: yup.string().required('El ogUrl es requerido'),
  twitterHandle: yup.string().required('El twitterHandle es requerido'),
  twitterCardType: yup.string().required('El twitterCardType es requerido'),
  location: yup.string().required('La location es requerido'),
  contactNumber: yup.string().required('El contactNumber es requerido'),
  website: yup.string().required('El website es requerido'),
  facebookUrl: yup.string().required('El facebookUrl es requerido'),
  twitterUrl: yup.string().required('El twitterUrl es requerido'),
  instagramUrl: yup.string().required('El instagramUrl es requerido'),
  youtubeUrl: yup.string().required('El youtubeUrl es requerido'),
  linkedinUrl: yup.string().required('El linkedinUrl es requerido'),
  tiktokUrl: yup.string().required('El tiktokUrl es requerido'),
})
