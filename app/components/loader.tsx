import React, { FC } from 'react';
import { Grid } from 'react-loader-spinner';
import { SECONDARY_COLOR } from '../constants/themeConstants';

const Loader = () => {
	return (
		<Grid
			height='100'
			width='100'
			color={SECONDARY_COLOR}
			ariaLabel='grid-loading'
			radius='12.5'
			wrapperStyle={{}}
			wrapperClass=''
			visible={true}
		/>
	);
};

export default Loader;
