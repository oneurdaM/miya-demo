import {useCallback,useState} from 'react';
import {useEventListener,useIsomorphicEffect} from './use-event-list';


export function useElementSize() {
	// Mutable values like 'ref.current' aren't valid dependencies
	// because mutating them doesn't re-render the component.
	// Instead, we use a state as a ref to be reactive.
	const [ref,setRef] = useState<any>(null);
	const [size,setSize] = useState<any>({
		width: 0,
		height: 0,
	});

	// Prevent too many rendering using useCallback
	const handleSize = useCallback(() => {
		setSize({
			width: ref?.offsetWidth || 0,
			height: ref?.offsetHeight || 0,
		});
	},[ref?.offsetHeight,ref?.offsetWidth]);

	useEventListener('resize',handleSize);

	useIsomorphicEffect(() => {
		handleSize();
	},[ref?.offsetHeight,ref?.offsetWidth]);

	return [setRef,size];
}
