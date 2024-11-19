import ConfirmationCard from '../common/confirmation-card'
import {InfoIcon} from '../icons/info-icon'
import {useModalAction,useModalState} from '../ui/modal/modal.context'
import {useUpdateDocumentatMutation} from '@/data/documents'

const DocumentStatusView = () => {
	const {data: info} = useModalState()
	const {closeModal} = useModalAction()

	const {mutate: update,isLoading: loading} =
		useUpdateDocumentatMutation()

	async function handleChangeDelete() {
		// deleteEnvironment({id: data})
		const data = {
			...info,
			valid: !info.valid,
		}
		update({id: info.id,data})
		closeModal()
	}

	return (
		<ConfirmationCard
			onCancel={closeModal}
			onDelete={handleChangeDelete}
			deleteBtnText={info.valid ? 'Invalidar' : 'Validar'}
			title="Actualizar Estado del Documento"
			deleteBtnLoading={loading}
			icon={<InfoIcon className="m-auto mt-4 h-12 w-12 text-accent" />}
			description={`¿Deseas cambiar el estado del documento a ${info.valid ? 'Inválido' : 'Válido'}? Actualmente está marcado como ${info.valid ? 'Válido' : 'Inválido'}.`}
		/>
	);
}

export default DocumentStatusView
