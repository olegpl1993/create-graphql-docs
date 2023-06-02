import React, { useState } from 'react';
import { IntrospectionType } from 'graphql';

interface Props {
  types: ReadonlyArray<IntrospectionType>;
}

function Types(props: Props) {
  const { types } = props;
  const [openType, setOpenType] = useState<boolean[]>(Array(types.length).fill(false));

  const updateValue = (index: number) => {
    setOpenType(() => {
      const updatedState = [...openType];
      updatedState[index] = !openType[index];
      return updatedState;
    });
  };

  return (
    types && (
      <>
        {types.map((type, index) => (
          <div key={type.name}>
            <button
              className={type.description ? 'docs-type docs-link' : 'docs-type'}
              onClick={() => {
                updateValue(index);
              }}
            >
              {type.name} {type.description && !openType[index] ? '>' : undefined}
            </button>
            {openType[index] && <div className="docs-nested">{type.description}</div>}
          </div>
        ))}
      </>
    )
  );
}

export default Types;
