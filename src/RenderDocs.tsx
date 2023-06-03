import React, { useEffect, useState } from 'react';
import { IntrospectionObjectType, IntrospectionSchema, IntrospectionType } from 'graphql';
import requestSchema from './funcs/requestSchema';
import Queries from './components/Queries';
import Types from './components/Types';
import './nullstyle.scss';
import './RenderDocs.scss';

interface Props {
  url: string;
}

function RenderDocs(props: Props) {
  const { url } = props;
  const [openTypes, setOpenTypes] = useState<boolean>(false);
  const [openQueries, setOpenQueries] = useState<boolean>(false);
  const [schema, setSchema] = useState<IntrospectionSchema | null>(null);
  const queryType = schema?.types.find(({ name }) => name === 'Query');
  const mainTypes = schema?.types.filter(({ name }) => name !== 'Query' && !name.startsWith('__'));

  useEffect(() => {
    (async () => {
      setSchema(await requestSchema(url));
    })();
  }, []);

  return (
    schema && (
      <div className="docs">
        <button
          className="docs-link docs-base"
          onClick={() => {
            setOpenTypes(!openTypes);
          }}
        >
          Types
        </button>
        {openTypes && (
          <div className="docs-nested">
            <Types types={mainTypes as ReadonlyArray<IntrospectionType>} />
          </div>
        )}
        <button
          className="docs-link docs-base"
          onClick={() => {
            setOpenQueries(!openQueries);
          }}
        >
          Query
        </button>
        {openQueries && (
          <div className="docs-nested">
            <Queries queries={queryType as IntrospectionObjectType} />
          </div>
        )}
      </div>
    )
  );
}

export default RenderDocs;
