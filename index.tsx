import React from 'react';
import ReactDOM from 'react-dom/client';
import Docs from './Docs';

// https://rickandmortyapi.com/graphql
// https://countries.trevorblades.com/graphql
// https://graphqlpokemon.favware.tech/

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <Docs url="https://countries.trevorblades.com/graphql" />
);
