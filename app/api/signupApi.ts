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
