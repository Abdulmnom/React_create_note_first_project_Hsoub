import './index.css';
import { createRoot } from 'react-dom/client';

import App from './App';
import React from 'react';

const container = document.getElementById('root');
const root = createRoot(container); // قم بإنشاء root باستخدام createRoot
root.render(<App />); // قم بعرض التطبيق