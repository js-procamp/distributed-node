import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import socketIOClient from 'socket.io-client';

import { config } from '../config';

import MessagesList from '../MessagesList';

const H1 = styled.h1`
	position: relative;
	text-align: center;
	letter-spacing: 10px;
`;

const Status = styled.div`
	position: fixed;
	right: 20px;
	top: 20px;
	padding: 3px 10px;
	border-radius: 5px;
	font-size: 13px;
	background: ${props => (props.status === 'online' ? '#6fb472' : '#F06292')};
`;

const ChatContainer = styled.div`
	color: #fbfbef;
	font-family: "Consolas", monospace;
	display: flex;
	flex-direction: column;
	height: 100vh;
`;

const Form = styled.form`
	position: relative;
	margin: 20px 30px;

	&::before {
		content: "~msg$:";
		position: absolute;
		left: 14px;
		top: 11px;
		color: #dcd1c4;
		font-size: 16px;
	}

	&::after {
		content: "↵";
		position: absolute;
		right: 20px;
		top: 0px;
		color: #dcd1c4;
		font-size: 30px;
	}
`;

const Input = styled.input`
	outline: none;
	border: none;
	background-color: #3c4556;
	border-radius: 5px;
	color: #ece7dc;
	width: 100%;
	height: 40px;
	text-indent: 82px;
	display: block;
	font-size: 16px;
	font-family: "Consolas", monospace;
	flex: 1;
`;

function hostName(meta) {
	if (meta && meta.HOSTNAME) {
		return meta.HOSTNAME;
	}
	return 'default';
}

const Chat = () => {
	const [messages, setMessages] = useState([]);
	const [value, setValue] = useState('');
	const [io, setIo] = useState(null);
	const [userId, setUserId] = useState(null);
	const [status, setStatus] = useState('offline');
	const [activeUsers, setActiveUsers] = useState([]);
	const el = useRef(null);
	const [meta, setMeta] = useState({});

	useEffect(() => {
		fetch(`${config.host}/meta`)
			.then(resp => resp.json())
			.then(resp => setMeta(resp))
			.catch(console.error);

		const chat = socketIOClient(`${config.host}/chat`);

		setIo(chat);

		chat.on('connect', () => {
			console.info('connected');
			setStatus('online');
		});

		chat.on('userConnected', user => {
			setActiveUsers(u => u.concat(user.nick));
		});

		chat.on('userDisconnected', user => {
			setActiveUsers(u => u.filter(name => name !== user.nick));
		});

		chat.on('activeUsers', users => {
			console.info('activeUsers', users);
			setActiveUsers(() => Array.from(users));
		});

		chat.on('message', m => {
			console.info('> New message', m)
			if (m.currUserId) {
				setUserId(m.currUserId);
			}

			setMessages(d => d.concat(m));
			if (el.current) {
				el.current.scrollTop = el.current.scrollHeight;
			}
		});

		return () => {
			console.warn('DISCONNECT')
			chat.disconnect();
		}
	}, []);

	return (
		<ChatContainer>
			<Status status={status}>{hostName(meta)}</Status>
			<H1>NWSD</H1>
			<MessagesList
				el={el}
				messages={messages}
				userId={userId}
				activeUsers={activeUsers}
			/>
			<Form
				onSubmit={e => {
					e.preventDefault();
					if (value !== '') {
						io.emit('message', value);
						setValue('');
					}
				}}
			>
				<Input
					value={value}
					onChange={e => setValue(e.target.value)}
					placeholder="Enter your message"
				/>
			</Form>
		</ChatContainer>
	);
};

export default Chat;
