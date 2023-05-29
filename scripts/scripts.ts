import { buildClientSchema, getIntrospectionQuery } from 'graphql';

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
  const schema = buildClientSchema(result.data);
  return schema;
};

export default requestSchema;
