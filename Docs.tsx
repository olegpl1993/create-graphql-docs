import React from 'react';
import RenderDocs from './src/RenderDocs';

interface Props {
  url: string;
}

function Docs(props: Props) {
  const { url } = props;

  return (
    <RenderDocs url={url} />
  );
}

export default Docs;
