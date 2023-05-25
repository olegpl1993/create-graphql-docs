import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import RenderDocs from './RenderDocs';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <BrowserRouter>
    <RenderDocs url="https://rickandmortyapi.com/graphql" />
  </BrowserRouter>
);
