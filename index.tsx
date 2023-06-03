import React from 'react';
import ReactDOM from 'react-dom/client';
import Docs from './Docs';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <Docs url="https://rickandmortyapi.com/graphql" />
);
