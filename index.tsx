import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import RenderSchema from './RenderDocs';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <BrowserRouter>
    <RenderSchema url="https://rickandmortyapi.com/graphql" />
  </BrowserRouter>
);

export default RenderSchema;
