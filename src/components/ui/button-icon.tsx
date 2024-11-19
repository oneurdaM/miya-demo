import React from 'react';
import Button from './button';
import {twMerge} from 'tailwind-merge';


type ButtonIconProps = {
	icon: React.ReactNode;
	color?: string;
	className?: string;
	onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
	loading?: boolean;
	id?: string;
};


const ButtonIcon: React.FC<ButtonIconProps> = ({
	icon,
	color = 'secondary',
	className,
	onClick,
	loading,
	id = 'button-icon',
	...rest
}) => {
	return (
		<Button
			id={id}
			loading={loading}
			color={color}
			onClick={onClick}
			{...rest}
			className={className ? twMerge(className) : ''}
		>
			{icon}
		</Button>
	);
};

export default ButtonIcon;