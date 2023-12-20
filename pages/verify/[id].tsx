import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router';
import Loader from '../../app/components/loader';

const b = () => {
	const [loading, setLoading] = useState(false);
	const router = useRouter();
	const [stepOneDone, setStepOneDone] = useState('');
	const [stepTwoDone, setStepTwoDone] = useState('');
	const [activeStep, setActiveStep] = useState(0);

	useEffect(() => {}, []);

	const getView = () => {
		switch (activeStep) {
			case 0:
				return <p>Step One</p>;
			case 1:
				return <p>Step Two</p>;

			default:
				break;
		}
	};

	return (
		<div>
			{loading ? (
				<div className='flex flex-col items-center content-center'>
					<Loader />
				</div>
			) : (
				<div className='bg-white rounded-[30px] p-4 '>
					<ul className='steps'>
						<li className={'step' + stepOneDone}>Verify Email</li>
						<li className={'step' + stepTwoDone}>Personal Details</li>
					</ul>
					{getView()}
				</div>
			)}
			<ToastContainer position='top-right' autoClose={5000} />
		</div>
	);
};

export default b;
