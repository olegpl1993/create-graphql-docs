import React from 'react';
import { IntrospectionType } from 'graphql';

interface Props {
  types: ReadonlyArray<IntrospectionType>;
}

function Types(props: Props) {
  const { types } = props;

  return (
    types && (
      <>
        {types.map((type) => (
          <div key={type.name}>{type.name}</div>
        ))}
      </>
    )
  );
}

export default Types;
