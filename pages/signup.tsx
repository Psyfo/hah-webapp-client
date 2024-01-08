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
import { postEmailConfirmation } from '../app/api/authApi';
import { ToastContainer, toast } from 'react-toastify';
import { encrypt } from '../app/utils/crypto';
import { CRYPTO } from '../app/constants/constants';
import Loader from '../app/components/loader';

const SignUp = () => {
	const router = useRouter();
	const [email, setEmail] = useState('');
	const [initialPassword, setInitialPassword] = useState('');
	const [confirmationPassword, setConfirmationPassword] = useState('');
	const [termsChecked, setTermsChecked] = useState('');
	const [emailWarn, setEmailWarn] = useState(false);
	const [emailMessage, setEmailMessage] = useState('');
	const [passWarn, setPassWarn] = useState(false);
	const [passWordMessage, setPassWordMessage] = useState('');
	const [checked, setChecked] = useState(false);
	const [loading, setLoading] = useState(false);
	const [emailSent, setEmailSent] = useState(false);

	useEffect(() => {
		document.body.style.backgroundColor = THIRD_COLOR;
	}, []);

	const handleChangeEmail = (e: any) => {
		setEmail(e.target.value);
	};

	const handleInputBlur = () => {
		if (!validateEmail(email)) {
			setEmailWarn(true);
			setEmailMessage('Please enter valid email address');
		} else {
			setEmailWarn(false);
			setEmailMessage('');
		}
	};

	const handleInputBlurPassword = () => {
		if (initialPassword.length < 10) {
			setPassWarn(true);
			setPassWordMessage('Password must contain at least 10 characters.');
		} else if (!hasUpperCase(initialPassword)) {
			setPassWarn(true);
			setPassWordMessage(
				'Password must include lowercases, UPPERCASEs, numbers and special characters '
			);
		} else if (!hasSpecialChars(initialPassword)) {
			setPassWarn(true);
			setPassWordMessage('Password must include special characters ');
		} else {
			setPassWarn(false);
			setPassWordMessage('');
		}
	};

	const handleChangePassword = (e: any) => {
		if (e.target.value.length < 10) {
			setPassWarn(true);
			setPassWordMessage('Password must contain at least 10 characters.');
		} else if (!hasUpperCase(e.target.value)) {
			setPassWarn(true);
			setPassWordMessage(
				'Password must include lowercases, UPPERCASEs, numbers and special characters '
			);
		} else if (!hasSpecialChars(e.target.value)) {
			setPassWarn(true);
			setPassWordMessage('Password must include special characters ');
		} else if (!hasNumber(e.target.value)) {
			setPassWarn(true);
			setPassWordMessage('Password must include atleast one number/digit ');
		} else {
			setPassWarn(false);
			setPassWordMessage('');
		}
		setInitialPassword(e.target.value);
	};

	const signUp = () => {
		if (checked) {
			setTermsChecked('');

			if (email == '') {
				setEmailWarn(true);
				setEmailMessage('This field is required');
			} else {
				if (!validateEmail(email)) {
					setEmailWarn(true);
					setEmailMessage('Please enter valid email address');
				} else {
					if (initialPassword.length < 10) {
						setPassWarn(true);
						setPassWordMessage('Password must contain at least 10 characters.');
					} else if (!hasUpperCase(initialPassword)) {
						setPassWarn(true);
						setPassWordMessage(
							'Password must include lowercases, UPPERCASEs, numbers and special characters '
						);
					} else if (!hasSpecialChars(initialPassword)) {
						setPassWarn(true);
						setPassWordMessage('Password must include special characters ');
					} else if (!hasNumber(initialPassword)) {
						setPassWarn(true);
						setPassWordMessage(
							'Password must include atleast one number/digit '
						);
					} else {
						setLoading(true);
						let encryptPassword = encrypt(initialPassword, CRYPTO);
						// Sign up
						postEmailConfirmation(email, encryptPassword)
							.then((r) => {
								setLoading(false);
								if (r.data.data) {
									setEmailSent(true);
									toast.success('Verification Email sent');
								} else {
									toast.error('Email already exists');
								}
							})
							.catch((e) => {
								setLoading(false);
								console.error(e);
								setEmailSent(false);
								toast.error('There was an error, please try again');
							});
					}
				}
			}
		} else {
			setTermsChecked('Please agree on Terms & Conditions to continue.');
		}
	};

	return (
		<div className='min-h-screen flex flex-col justify-center items-center content-center'>
			<img src='./images/logo.svg' className='h-24 w-24' />
			<div>
				<h1 className='text-xl text-bold text-gray-600 text-left mb-3'>
					Patient Sign Up
				</h1>
			</div>
			{emailSent ? (
				<div className='flex flex-col space-y-4 justify-center content-center items-center w-full px-8 md:w-1/2 lg:1/3'>
					<h1 className='text-center text-gray-600'>
						Email Sent, check your inbox and use the link
					</h1>
					<button
						onClick={() => {
							setEmailSent(false);
							setChecked(false);
						}}
						style={{
							backgroundColor: SECONDARY_COLOR,
							borderColor: SECONDARY_COLOR,
						}}
						className='rounded-md bg-white w-full h-10 text-black text-sm border-2'
					>
						Restart
					</button>
				</div>
			) : (
				<div className='w-full h-full'>
					{loading ? (
						<div className='flex flex-col justify-center items-center content-center'>
							<Loader />
						</div>
					) : (
						<form
							className='w-full px-8 md:w-1/2 lg:1/3'
							onSubmit={(e) => {
								e.preventDefault();
								signUp();
							}}
						>
							<div className='w-full flex flex-col justify-between h-full'>
								<div className='mb-3'>
									<p
										className={
											emailWarn
												? 'text-sm text-bold text-red-500'
												: 'text-sm text-bold text-gray-600'
										}
									>
										{emailWarn ? emailMessage : 'Email'}
									</p>
									<input
										value={email}
										onBlur={handleInputBlur}
										onChange={handleChangeEmail}
										className='rounded-md bg-white w-full h-10 p-2'
									/>
								</div>
								<div className='mb-3'>
									<p
										className={
											passWarn
												? 'text-sm text-bold text-red-500'
												: 'text-sm text-bold text-gray-600'
										}
									>
										{passWarn ? passWordMessage : 'Password'}
									</p>
									<input
										type='password'
										onChange={handleChangePassword}
										value={initialPassword}
										onBlur={handleInputBlurPassword}
										className='rounded-md bg-white w-full h-10 p-2'
									/>
									<p>{}</p>
								</div>
								<input
									type='submit'
									value='Sign Up'
									style={{
										backgroundColor: PRIMARY_COLOR,
										borderColor: PRIMARY_COLOR,
									}}
									className='rounded-md bg-white w-full h-10 text-white text-sm border-2 p-2 mb-3'
								/>
								<div className='text-center w-full'>
									<p className='text-red-500'>{termsChecked}</p>
									<input
										onChange={() => {
											setChecked(!checked);
											setTermsChecked('');
										}}
										type='checkbox'
										id='terms'
										name='terms'
										value='terms'
										className='accent-[#137EA0] text-white bg-whites'
									/>
									<label htmlFor='terms'>
										{' '}
										I understand the Terms and Conditions
									</label>
									<br></br>
								</div>
								<Link href={'/terms'}>
									<p className='text-center text-xs text-gray-500 mb-4 font-bold underline'>
										See Terms
									</p>
								</Link>
							</div>
							<div className='mt-12 flex flex-col space-y-4'>
								<Link href={'/terms'}>
									<p className='text-center text-xs text-gray-500 mb-4 font-bold underline'>
										Apply for Practioner Account
									</p>
								</Link>
								<button
									onClick={() => {
										router.push('/login');
									}}
									style={{
										backgroundColor: SECONDARY_COLOR,
										borderColor: SECONDARY_COLOR,
									}}
									className='rounded-md bg-white w-full h-10 text-black text-sm border-2'
								>
									Login
								</button>
							</div>
						</form>
					)}
				</div>
			)}

			<ToastContainer position='top-right' autoClose={5000} />
		</div>
	);
};

export default SignUp;
