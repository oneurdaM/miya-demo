import {useDeleteShiftMutation} from "@/data/shift";
import ConfirmationCard from "../common/confirmation-card";
import {useModalAction,useModalState} from "../ui/modal/modal.context";

const ShiftDeleteView = () => {
	const {data} = useModalState();
	const {closeModal} = useModalAction();
	const {mutate: deleteShift,isLoading: loading} = useDeleteShiftMutation();
	function handleDelete() {
		try {
			deleteShift({
				id: data,
			});
			closeModal();
		} catch (error) {
			closeModal();
		}
	}

	return (
		<ConfirmationCard
			onCancel={closeModal}
			onDelete={handleDelete}
			deleteBtnLoading={loading}
			cancelBtnLoading={loading}
		/>
	);
}

export default ShiftDeleteView;