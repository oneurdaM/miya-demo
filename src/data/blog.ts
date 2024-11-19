/* eslint-disable @typescript-eslint/no-explicit-any */
import { BlogResponse, Note } from '@/types/blog'
import { mapPaginatorData } from '@/utils/data-mappers'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { toast } from 'react-toastify'
import { QueryOptionsType } from '../types'
import { API_ENDPOINTS } from './client/api-endpoints'
import { blogClient } from './client/blog'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'

export const useCreateNoteMutation = () => {
const {t} = useTranslation()

  const queryClient = useQueryClient()
  const router = useRouter()
  return useMutation(blogClient.create, {
    onSuccess: () => {
      toast.success(t('common:successfully-created'))
      router.back()
    },
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.BLOG)
    },
  })
}

export const useNotesQuery = (options: Partial<QueryOptionsType>) => {
  const { data, isLoading, error } = useQuery<BlogResponse, Error>(
    [API_ENDPOINTS.BLOG, options],
    () => blogClient.paginated(options),
    {
      keepPreviousData: true,
    }
  )

  return {
    notes: data?.data as Note[],
    loading: isLoading,
    paginatorInfo: mapPaginatorData(data as any),
    error,
  }
}

export const useNoteQuery = ({ slug }: { slug: string }) => {
  return useQuery<Note, Error>([API_ENDPOINTS.BLOG, slug], () =>
    blogClient.bySlug({ slug })
  )
}

export const useUpdateNoteMutation = () => {
const {t} = useTranslation()

  const queryClient = useQueryClient()
  return useMutation(blogClient.update, {
    onSuccess: () => {
      toast.success(t('common:successfully-updated'))
    },
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.BLOG)
    },
  })
}

export const useDeleteNoteMutation = () => {
const {t} = useTranslation()

  const queryClient = useQueryClient()
  return useMutation(blogClient.delete, {
    onSuccess: () => {
      toast.success(t("common:successfully-deleted"))
    },
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.BLOG)
    },
  })
}
