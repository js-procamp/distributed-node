import React, { useState, useEffect } from 'react';

const Ping = () => {
	const [meta, setMeta] = useState({});

	useEffect(() => {
		fetch('/api')
			.then(resp => resp.json())
			.then(resp => setMeta(resp))
			.catch(() => console.error('fail'));
	}, []);

	return (
		<div style={{ display: 'flex', color: '#ece7dc' }}>
			<div style={{ color: 'grey', maxWidth: 500 }}>
				{Object.keys(meta).map(key => (
					<div>
						{key}: {meta[key]}
					</div>
				))}
			</div>
		</div>
	);
};

export default Ping;
