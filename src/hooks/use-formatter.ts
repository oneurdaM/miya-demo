import {useCallback,useMemo} from "react";

export default function useFormatter() {

	const formatter = useMemo(() => new Intl.NumberFormat('en-US',{
		style: 'currency',
		currency: 'MXN',
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	}),[]);

	const format = useCallback((number: number) => {
		return formatter.format(number)
	},[formatter])
	return {
		format
	}

}