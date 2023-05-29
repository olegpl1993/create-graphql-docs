import React from 'react';
import ReactDOM from 'react-dom/client';
import RenderDocs from './RenderDocs';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <RenderDocs url="https://rickandmortyapi.com/graphql" />
);
