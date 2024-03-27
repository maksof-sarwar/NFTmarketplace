'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { CollectionForm } from './_component/form';

export default () => {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const router = useRouter();

	useEffect(() => {
		const enteredPassword = prompt(
			'Please enter the password to access the page:'
		);
		if (enteredPassword === 'ADMIN') {
			setIsAuthenticated(true);
			return;
		}
		alert('Wrong password');
		router.replace('/');
	}, []);

	return (
		isAuthenticated && (
			<div className="flex justify-center items-center  flex-col">
				<h1 className="font-heading text-3xl text-primary font-extrabold uppercase mb-5">
					Collection Info
				</h1>
				<CollectionForm />
			</div>
		)
	);
};
