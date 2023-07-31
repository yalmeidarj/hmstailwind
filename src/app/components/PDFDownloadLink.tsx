import React from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import MyDocument from './MyDocument '

const DownloadLink = ({ data }) => (
	<div className='text-black'>
		<PDFDownloadLink document={<MyDocument data={data} />} fileName="ShiftLoggers.pdf">
			{({ blob, url, loading, error }) => (loading ? 'Loading document...' : 'Create PDF')}
		</PDFDownloadLink>
	</div>
);

export default DownloadLink;
