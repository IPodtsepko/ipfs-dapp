import React from 'react';
import ReactDOM from 'react-dom/client';

import { Storage } from './components/Storage';

import 'bootstrap/dist/css/bootstrap.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <Storage />
    </React.StrictMode>
);
