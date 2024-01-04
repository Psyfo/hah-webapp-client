import axios from 'axios';
import { PATIENT_LOCAL_URL } from '../constants/constants';

export const postEmailConfirmation = async (
	email: string,
	password: string
) => {
	return axios.post(`${PATIENT_LOCAL_URL}/api/v1/emailconfirmation`, {
		email: email,
		password: password,
	});
};

export const postEmailVerification = async (verificationId: string) => {
	return axios.post(`${PATIENT_LOCAL_URL}/api/v1/emailverification`, {
		verificationId: verificationId,
	});
};

export const signInApi = async (email: string, password: string) => {
	return axios.post(`${PATIENT_LOCAL_URL}/api/v1/signin`, {
		email: email,
		password: password,
	});
};
