import React, { useState } from 'react';
import { IntrospectionType } from 'graphql';

interface Props {
  types: ReadonlyArray<IntrospectionType>;
}

function Types(props: Props) {
  const { types } = props;
  const [openType, setOpenType] = useState<boolean>(false);

  return (
    types && (
      <>
        {types.map((type) => (
          <div key={type.name}>
            <button
              onClick={() => {
                setOpenType(!openType);
              }}
            >
              {type.name}
            </button>
            {openType && <div className="docs-nested">{type.description}</div>}
          </div>
        ))}
      </>
    )
  );
}

export default Types;
