/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react'
import Card from '@/components/common/card'
import { useModalAction, useModalState } from '../ui/modal/modal.context'
import ValidateDocumentForm from '../auth/validate-document-form'
import { useDeleteDocumentMutation } from '@/data/documents'

type DocumentTypeFormProps = {
  name: string
}

type IProps = {
  initialValues?: DocumentTypeFormProps
}

export default function ValidDateDocument({ initialValues }: IProps) {
    const { data: modalData } = useModalState()
    const { closeModal } = useModalAction()
    const { mutate: deleteDoc, isLoading: loading } = useDeleteDocumentMutation()

  
  return (
    <Card>
      <ValidateDocumentForm id={modalData.id} onClose={closeModal} />
    </Card>
  )
}
