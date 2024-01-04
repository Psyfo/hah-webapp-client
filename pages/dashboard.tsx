import type { NextPage } from 'next';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
	PRIMARY_COLOR,
	SECONDARY_COLOR,
	THIRD_COLOR,
} from '../app/constants/themeConstants';
import 'react-toastify/dist/ReactToastify.css';
import {
	hasNumber,
	hasSpecialChars,
	hasUpperCase,
	validateEmail,
} from '../app/utils/stringM';
import Link from 'next/link';
import { print } from '../app/utils/console';
import { postEmailConfirmation, signInApi } from '../app/api/authApi';
import { ToastContainer, toast } from 'react-toastify';
import { encrypt } from '../app/utils/crypto';
import { CRYPTO } from '../app/constants/constants';
import Loader from '../app/components/loader';

const Dashboard = () => {
	const router = useRouter();
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		document.body.style.backgroundColor = THIRD_COLOR;
	}, []);

	return (
		<div className='min-h-screen flex flex-col justify-center items-center content-center'>
			<img src='./images/logo.svg' className='h-24 w-24' />
			<div>
				<h1 className='text-xl text-bold text-gray-600 text-left mb-3'>
					Welcome to Dashboard
				</h1>
			</div>
			<div className='w-full h-full'>
				{loading ? (
					<div className='flex flex-col justify-center items-center content-center'>
						<Loader />
					</div>
				) : (
					<div></div>
				)}
			</div>

			<ToastContainer position='top-right' autoClose={5000} />
		</div>
	);
};

export default Dashboard;
