import React, { useEffect, useState } from 'react';
import { IntrospectionObjectType, IntrospectionSchema, getIntrospectionQuery } from 'graphql';
import Queries from './components/Queries';
import Types from './components/Types';
import './RenderDocs.scss';

const requestSchema = async (url: string) => {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: getIntrospectionQuery(),
    }),
  });
  const result = await res.json();
  const schema = result.data.__schema;
  return schema;
};

interface Props {
  url: string;
}

function RenderDocs(props: Props) {
  const { url } = props;
  const [schema, setSchema] = useState<IntrospectionSchema | null>(null);
  const [openTypes, setOpenTypes] = useState<boolean>(false);
  const [openQueries, setOpenQueries] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      setSchema(await requestSchema(url));
    })();
  }, []);

  console.log(schema);

  return (
    schema && (
      <>
        <button
          onClick={() => {
            setOpenTypes(!openTypes);
          }}
        >
          Types
        </button>
        {openTypes && (
          <div>
            <Types types={schema.types} />
          </div>
        )}

        <div>{' --------------- '}</div>

        <button
          onClick={() => {
            setOpenQueries(!openQueries);
          }}
        >
          Queries
        </button>

        {openQueries && (
          <div>
            <Queries queries={schema.types[0] as IntrospectionObjectType} />
          </div>
        )}
      </>
    )
  );
}

export default RenderDocs;
