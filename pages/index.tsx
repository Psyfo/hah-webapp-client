import type { NextPage } from 'next';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import SignUp from './signup';

const Home: NextPage = () => {
	const router = useRouter();

	useEffect(() => {}, []);

	return <SignUp />;
};

export default Home;
