import Button from '../ui/button';
import {ArrowUp} from '../icons/arrow-up';
import {CheckCircleIcon} from '../icons/check-circle';
import {CloseIcon} from '../icons/close-icon';
import {useModalAction} from '../ui/modal/modal.context';
import {TrashIcon} from '../icons/trash';
import MetricInfo from './metric';

const ExpandedContentDocuments = ({record}: any) => {
	const {openModal} = useModalAction();
	console.log('ExpandedContentDocuments:',record);
	const handleCreateDocument = () => {
		openModal('CREATE_DOCUMENT');
	};

	const openFile = (filePath: string) => {
		const fileExtension = filePath.split('.').pop()?.toLowerCase();
		const isSupported = fileExtension === 'pdf' || ['jpg','jpeg','png'].includes(fileExtension || '');

		if (isSupported) {
			window.open(filePath,'_blank');
		} else {
			alert('Este archivo no se puede abrir. Solo se admiten PDF e imágenes.');
		}
	};

	const handleDeleteDocument = (doc: any) => {
		openModal('DELETE_DOCUMENT',doc);
	};

	return (
		<div className='p-5 bg-white flex flex-col gap-6' id="expanded-content">
			<div className='flex justify-between items-center mb-4'>
				<div className='flex gap-3 items-center cursor-pointer'>
					<h1 className='text-lg font-semibold text-primaryColor'>{record?.userName}</h1>
					<span className='font-normal text-gray-400 text-sm'>Puedes agregar o actualizar el estado de los documentos</span>
				</div>

				<Button onClick={handleCreateDocument} size="medium" className='bg-primaryColor text-white rounded-[12px] p-2 px-4 text-sm font-medium'>
					Documento nuevo
					<ArrowUp className='ml-2' />
				</Button>
			</div>

			<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
				<div className="flex flex-col rounded-[12px] p-5 border border-gray-100 bg-white">
					<div className="flex flex-col mb-6">
						<h2 className="text-sm font-normal text-grayText">Total de documentos:</h2>
						<div className="flex justify-between mt-4">
							<p className="text-2xl font-semibold text-primaryColor">Documentos</p>
							<p className="text-primaryColor text-lg ml-4">{record?.documents.length}</p>
						</div>

						{/* Lista de documentos */}
						<div className='mt-4'>
							{record?.documents.map((doc: any,index: number) => (
								<div key={index} className='flex justify-between items-center border-b border-gray-100 py-2'>
									<p className='text-sm font-normal text-gray-400'>{doc.documentType.name}</p>
									<button onClick={() => openFile(doc.filePath)} className="text-blue-500 underline text-sm">
										Abrir archivo
									</button>
									<button onClick={() => handleDeleteDocument(doc)} className="text-red-500 hover:text-red-700">
										<TrashIcon className="w-5 h-5" />
									</button>
									{doc.valid ? (
										<div className='flex items-center gap-2 cursor-pointer' onClick={() => openModal('CHANGE_STATUS_DOCUMENT',doc)}>
											<CheckCircleIcon className='w-5 h-5 text-green-500' />
										</div>
									) : (
										<div className='flex items-center gap-2 cursor-pointer' onClick={() => openModal('CHANGE_STATUS_DOCUMENT',doc)}>
											<CloseIcon className='w-5 h-5 text-red-500' />
										</div>
									)}
								</div>
							))}
						</div>
					</div>
				</div>

				<MetricInfo metric={record} />
			</div>
		</div>
	);
};

export default ExpandedContentDocuments;
