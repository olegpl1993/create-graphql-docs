import './nullstyle.scss';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import RenderSchema from './components/RenderSchema';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <BrowserRouter>
    <RenderSchema />
  </BrowserRouter>
);

export default RenderSchema;
