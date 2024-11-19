import React from 'react'
import { Document, Page } from '@react-pdf/renderer'

type PDFViewerProps = {
  pdfUrl: string
}
const PDFViewer: React.FC<PDFViewerProps> = ({ pdfUrl }) => {
  return <iframe src={pdfUrl} width="100%" height="700px"></iframe>
}

export default PDFViewer
