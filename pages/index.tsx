import type { NextPage } from 'next';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const Home: NextPage = () => {
	const router = useRouter();

	useEffect(() => {}, []);

	return (
		<div>
			<h1>Hi Health at home</h1>
		</div>
	);
};

export default Home;
