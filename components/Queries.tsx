import React from 'react';
import { IntrospectionObjectType } from 'graphql';

interface Props {
  queries: IntrospectionObjectType;
}

function Queries(props: Props) {
  const { queries } = props;

  return (
    queries && (
      <>
        {queries.fields.map((query) => (
          <div key={query.name}>{query.name}</div>
        ))}
      </>
    )
  );
}

export default Queries;
