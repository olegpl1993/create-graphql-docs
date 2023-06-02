import React from 'react';
import { IntrospectionObjectType } from 'graphql';
import ReturnType from './ReturnType';

interface Props {
  queries: IntrospectionObjectType;
}

function Queries(props: Props) {
  const { queries } = props;
  console.log(queries);

  return (
    queries && (
      <div className="docs-queries">
        {queries.fields.map((query) => (
          <div key={query.name}>
            <div>
              <span className="docs-query">{query.name}</span>
              <span>(</span>
              <span>
                {query.args &&
                  query.args.map((arg) => (
                    <div key={arg.name}>
                      <span className="docs-args">{arg.name}</span>:
                      <ReturnType type={arg.type} />
                    </div>
                  ))}
              </span>
              <span>
                ):
                <ReturnType type={query.type} />
              </span>
            </div>
            <div>{query.description}</div>
          </div>
        ))}
      </div>
    )
  );
}

export default Queries;
