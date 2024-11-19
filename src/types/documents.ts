export type DocumentsPagination = {
  documents: any[]
  total: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}



// Tipo para el estado completo de un documento
export interface Document {
  id: number;                // Identificador único del documento
  documentType: string;      // Tipo de documento (por ejemplo, "ID", "Examen médico", etc.)
  issuedAt: string;          // Fecha de emisión del documento (en formato ISO)
  validUntil?: string;       // Fecha de expiración del documento (opcional, en formato ISO)
  filePath: string;          // URL o ruta del archivo del documento (PDF o imagen)
  valid: boolean;            // Estado de validez del documento (true si es válido, false si es inválido)
}

// Tipo para crear o actualizar un documento (sin `id`, ya que es generado por el backend)
export interface CreateDocument {
  documentType: string;      // Tipo de documento
  issuedAt: string;          // Fecha de emisión (obligatorio)
  validUntil?: string;       // Fecha de expiración (opcional)
  filePath?: string;         // URL o ruta del archivo, opcional en caso de actualización
  valid?: boolean;           // Estado de validez (predeterminado: false si no se proporciona)
  userId?: number;
  jobPositionId?: number;
  user?: any;
}
