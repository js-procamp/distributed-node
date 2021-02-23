import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import App from './app';

let root = document.querySelector('#root');

if(!root) {
    root = document.createElement('div');
    root.setAttribute('id', 'root');
    document.body.appendChild(root);
}

ReactDOM.render(
    <BrowserRouter>
        <App />
    </BrowserRouter>,
    root
)