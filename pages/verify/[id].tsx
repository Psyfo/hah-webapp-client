import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router';
import Loader from '../../app/components/loader';
import { PRIMARY_COLOR, THIRD_COLOR } from '../../app/constants/themeConstants';

const b = () => {
	const [loading, setLoading] = useState(false);
	const router = useRouter();
	const [stepOneDone, setStepOneDone] = useState('step-info');
	const [stepTwoDone, setStepTwoDone] = useState('');
	const [activeStep, setActiveStep] = useState(0);
	const [verified, setVerified] = useState(false);

	useEffect(() => {
		document.body.style.backgroundColor = THIRD_COLOR;
	}, []);

	const getView = () => {
		switch (activeStep) {
			case 0:
				return (
					<div className='flex flex-col w-full'>
						{verified ? (
							<div className='flex flex-col justify-between space-y-20  h-full w-full'>
								<div className='flex flex-col items-center content-center justify-center w-full'>
									<svg
										xmlns='http://www.w3.org/2000/svg'
										viewBox='0 0 24 24'
										fill='currentColor'
										data-slot='icon'
										className='w-20 h-20'
									>
										<path d='M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67Z' />
										<path d='M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z' />
									</svg>
									<h1 className='font-extrabold text-xl'>Congratulations!</h1>
									<p>Your email is now verified</p>
								</div>
								<button
									onClick={() => {
										setActiveStep(1);
										setStepTwoDone('step-info');
									}}
									style={{
										backgroundColor: PRIMARY_COLOR,
										borderColor: PRIMARY_COLOR,
									}}
									className='rounded-md bg-white w-full h-10 text-black text-sm border-2 text-white'
								>
									Continue
								</button>
							</div>
						) : (
							<div className='flex flex-col justify-between space-y-20  min-h-[500px] w-full'>
								<div className='flex flex-col items-center content-center w-full text-center space-y-2'>
									<svg
										xmlns='http://www.w3.org/2000/svg'
										viewBox='0 0 24 24'
										fill='currentColor'
										data-slot='icon'
										className='w-20 h-20'
									>
										<path
											fill-rule='evenodd'
											d='M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z'
											clip-rule='evenodd'
										/>
									</svg>

									<h1 className='font-extrabold text-xl'>Sorry!</h1>
									<p>We can not verify your email write now.</p>
									<p>Please check and try again later</p>
									<button
										onClick={() => {
											setActiveStep(1);
											setStepTwoDone('step-info');
										}}
										style={{
											backgroundColor: PRIMARY_COLOR,
											borderColor: PRIMARY_COLOR,
										}}
										className='rounded-md bg-white w-full h-10 text-black text-sm border-2 text-white'
									>
										Open Email App
									</button>
								</div>
								<div className='flex flex-row justify-between w-full'>
									<p>Resend verification</p>
									<p>Change Email</p>
								</div>
							</div>
						)}
					</div>
				);
			case 1:
				return <p>Step Two</p>;

			default:
				break;
		}
	};

	return (
		<div className='flex flex-col items-center justify-center content-center px-8  min-h-screen h-full py-4'>
			<div>
				<h1 className='text-3xl'>Verify Email</h1>
			</div>
			{loading ? (
				<div className='flex flex-col items-center '>
					<Loader />
				</div>
			) : (
				<div className='p-2 flex flex-col items-center '>
					<ul className='steps w-full'>
						<li className={'step ' + stepOneDone}>
							<div className='flex flex-col'>
								<p className='text-xs'>Step 1</p>
								<p>Verify Email</p>
							</div>
						</li>
						<li className={'step ' + stepTwoDone}>
							<div className='flex flex-col'>
								<p className='text-xs'>Step 1</p>
								<p>Personal Details</p>
							</div>
						</li>
					</ul>
					{getView()}
				</div>
			)}
			<ToastContainer position='top-right' autoClose={5000} />
		</div>
	);
};

export default b;
