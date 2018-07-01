import { render } from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import App from './components/App';
import React from 'react';

render((
  <BrowserRouter>
    <App />
  </BrowserRouter>
), document.getElementById('root'));