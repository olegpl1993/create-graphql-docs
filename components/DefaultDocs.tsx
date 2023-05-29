import React from 'react';
import { Documentation } from '../types';

interface Props {
  doc: {
    type: string;
    selectedType: string;
    title: string;
  };
  setDoc: React.Dispatch<
    React.SetStateAction<{
      type: string;
      selectedType: string;
      title: string;
    }>
  >;
  setDocBox: React.Dispatch<React.SetStateAction<[] | Documentation[]>>;
}

function DefaultDocs(props: Props) {
  const { doc, setDoc, setDocBox } = props;
  return (
    <div className="render-docs" style={{ border: '1px solid black' }}>
      <div className="render-docs-header">
        <div className="render-docs-header-title">{doc.title}</div>
      </div>
      <div className="render-docs-description">
        A GraphQL schema provides a root type for each kind of operation.
      </div>
      <div className="render-docs">
        <div className="render-docs-types">Root Types</div>
        <div className="render-docs-content">
          <span className="render-docs-field">query</span>:{' '}
          <span
            className="render-docs-scalar"
            onClick={() => {
              setDoc({ type: 'Query', selectedType: 'Query', title: 'Query' });
              setDocBox((prevStack) => [
                ...prevStack,
                { type: 'Query', selectedType: 'Query', title: 'Query' },
              ]);
            }}
          >
            {doc.selectedType}
          </span>
        </div>
      </div>
    </div>
  );
}

export default DefaultDocs;
