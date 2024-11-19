import {useRef,useEffect,useLayoutEffect} from 'react';

export const useIsomorphicEffect =
	typeof window !== 'undefined' ? useLayoutEffect : useEffect;

function useEventListener(
	eventName: any,
	handler: any,
	element?: any,
	options?: any,
) {
	// Create a ref that stores handler
	const savedHandler = useRef(handler);

	useIsomorphicEffect(() => {
		savedHandler.current = handler;
	},[handler]);

	useEffect(() => {
		const targetElement = element?.current ?? window;

		if (!(targetElement && targetElement.addEventListener)) return;

		const listener = (event: any) => savedHandler.current(event);

		targetElement.addEventListener(eventName,listener,options);

		return () => {
			targetElement.removeEventListener(eventName,listener,options);
		};
	},[eventName,element,options]);
}

export {useEventListener};
