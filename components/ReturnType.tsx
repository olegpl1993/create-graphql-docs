/* eslint-disable no-nested-ternary */
import React from 'react';

interface Props {
  type: any;
}

function ReturnType(props: Props) {
  const { type } = props;

  return (
    type && (
      <span>
        {type.name ? (
          <span className="docs-type">{type.name}</span>
        ) : type.ofType.name ? (
          <span className="docs-type">{type.ofType.name}</span>
        ) : type.ofType.ofType.name ? (
          <span>
            [<span className="docs-type">{type.ofType.ofType.name}</span>]
          </span>
        ) : (
          <span>
            [<span className="docs-type">{type.ofType.ofType.ofType.name}</span>]
          </span>
        )}
      </span>
    )
  );
}

export default ReturnType;
