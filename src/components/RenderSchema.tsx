import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLInputObjectType,
  GraphQLScalarType,
  GraphQLList,
  GraphQLNonNull,
  getIntrospectionQuery,
  buildClientSchema,
} from 'graphql';
import { GraphQLNestedList, GraphQLObject, DocumentationRickAndMorty } from '../types';
import './RenderSchema.scss';

const url = 'https://rickandmortyapi.com/graphql';

const requestSchema = async () => {
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

function RenderSchema() {
  const [schema, setSchema] = useState<GraphQLSchema | null>(null);
  useEffect(() => {
    (async () => {
      setSchema(await requestSchema());
    })();
  }, []);

  const [backStack, setBackStack] = useState<DocumentationRickAndMorty[] | []>([]);
  const [documentation, setDocumentation] = useState({
    type: 'Docs',
    selectedType: 'Query',
    title: 'Docs',
  });

  function DefaultDocs() {
    return (
      <div className="documentation">
        <div className="documentation-root-header">
          <div className="documentation-root-header-title">{documentation.title}</div>
        </div>
        <div className="documentation-root-description">
          A GraphQL schema provides a root type for each kind of operation.
        </div>
        <div className="documentation-root">
          <div className="documentation-root-types">Root Types</div>
          <div className="documentation-root-content">
            <span className="documentation-root-field">query</span>
            :
            {' '}
            <span
              className="documentation-root-scalar"
              onClick={() => {
                setDocumentation({ type: 'Query', selectedType: 'Query', title: 'Query' });
                setBackStack((prevStack) => [
                  ...prevStack,
                  { type: 'Query', selectedType: 'Query', title: 'Query' },
                ]);
              }}
            >
              {documentation.selectedType}
            </span>
          </div>
        </div>
      </div>
    );
  }

  function graphQLListType(item: GraphQLNestedList) {
    if (item.type instanceof GraphQLList) {
      return (
        <>
          [
          <Link
            to="/graphiql"
            className="documentation-explorer-field-type"
            onClick={() => {
              setDocumentation({
                type: item.type.ofType.name,
                selectedType: item.type.ofType.name,
                title: item.type.ofType.name,
              });
              setBackStack((prevStack) => [
                ...prevStack,
                {
                  type: item.type.ofType.name,
                  selectedType: item.type.ofType.name,
                  title: item.type.ofType.name,
                },
              ]);
            }}
          >
            {item.type.ofType.name}
          </Link>
          ]
        </>
      );
    }
    if (item.type instanceof GraphQLNonNull) {
      return (
        <>
          [
          <Link
            to="/graphiql"
            className="documentation-explorer-field-type"
            onClick={() => {
              setDocumentation({
                type: item.type.ofType.ofType.name,
                selectedType: item.type.ofType.ofType.name,
                title: item.type.ofType.ofType.name,
              });
              setBackStack((prevStack) => [
                ...prevStack,
                {
                  type: item.type.ofType.ofType.name,
                  selectedType: item.type.ofType.ofType.name,
                  title: item.type.ofType.ofType.name,
                },
              ]);
            }}
          >
            {item.type.ofType.ofType.name}
          </Link>
          ]!
        </>
      );
    }
    return (
      <Link
        to="/graphiql"
        className="documentation-explorer-field-type"
        onClick={() => {
          setDocumentation({
            type: item.type.name,
            selectedType: item.type.name,
            title: item.type.name,
          });
          setBackStack((prevStack) => [
            ...prevStack,
            {
              type: item.type.name,
              selectedType: item.type.name,
              title: item.type.name,
            },
          ]);
        }}
      >
        {item.type.name}
      </Link>
    );
  }

  function fieldArguments(current: GraphQLNestedList) {
    const clazz = current.args.length > 1
      ? 'documentation-explorer-field-arguments-notsingle'
      : 'documentation-explorer-field-arguments-single';
    return (
      <>
        {current.args.map((arg) => {
          if (arg.type instanceof GraphQLInputObjectType) {
            return (
              <div className={clazz} key={arg.name}>
                <span className="documentation-explorer-field-arguments">{arg.name}</span>
                :
                {' '}
                <Link
                  to="/graphiql"
                  className="documentation-explorer-field-type"
                  onClick={() => {
                    setDocumentation({
                      type: arg.type.name,
                      selectedType: arg.type.name,
                      title: arg.type.name,
                    });
                    setBackStack((prevStack) => [
                      ...prevStack,
                      {
                        type: arg.type.name,
                        selectedType: arg.type.name,
                        title: arg.type.name,
                      },
                    ]);
                  }}
                >
                  <span>{arg.type.name}</span>
                </Link>
              </div>
            );
          }
          if (arg.type.ofType instanceof GraphQLList) {
            return (
              <div className={clazz} key={arg.name}>
                <span className="documentation-explorer-field-arguments">{arg.name}</span>
                : [
                <Link
                  to="/graphiql"
                  className="documentation-explorer-field-type"
                  onClick={() => {
                    setDocumentation((prev) => ({
                      ...prev,
                      type: arg.type.ofType.ofType.ofType.name,
                      title: arg.type.ofType.ofType.ofType.name,
                    }));
                    setBackStack((prevStack) => [
                      ...prevStack,
                      {
                        type: arg.type.ofType.ofType.ofType.name,
                        selectedType: documentation.selectedType,
                        title: arg.type.ofType.ofType.ofType.name,
                      },
                    ]);
                  }}
                >
                  <span className="documentation-explorer-field-type">
                    {arg.type.ofType.ofType.ofType.name}
                  </span>
                </Link>
                ! ] !
              </div>
            );
          }
          if (arg.type.ofType instanceof GraphQLScalarType) {
            return (
              <div className={clazz} key={arg.name}>
                <span className="documentation-explorer-field-arguments">{arg.name}</span>
                :
                {' '}
                <Link
                  to="/graphiql"
                  className="documentation-explorer-field-type"
                  onClick={() => {
                    setDocumentation((prev) => ({
                      ...prev,
                      type: arg.type.ofType.name,
                      title: arg.type.ofType.name,
                    }));
                    setBackStack((prevStack) => [
                      ...prevStack,
                      {
                        type: arg.type.ofType.name,
                        selectedType: documentation.selectedType,
                        title: arg.type.ofType.name,
                      },
                    ]);
                  }}
                >
                  <span>{arg.type.ofType.name}</span>
                </Link>
                !
              </div>
            );
          }
          return (
            <div className={clazz} key={arg.name}>
              <span className="documentation-explorer-field-arguments">{arg.name}</span>
              :
              {' '}
              <Link
                to="/graphiql"
                className="documentation-explorer-field-type"
                onClick={() => {
                  setDocumentation((prev) => ({
                    ...prev,
                    type: arg.type.name,
                    title: arg.type.name,
                  }));
                  setBackStack((prevStack) => [
                    ...prevStack,
                    {
                      type: arg.type.name,
                      selectedType: documentation.selectedType,
                      title: arg.type.name,
                    },
                  ]);
                }}
              >
                <span>{arg.type.name}</span>
              </Link>
            </div>
          );
        })}
      </>
    );
  }

  function isTypeCurrentField(current: GraphQLNestedList) {
    if (current.type instanceof GraphQLList) {
      return (
        <>
          <div className="documentation-explorer-field-description">
            <p>{current.description}</p>
          </div>
          <div className="documentation-root">
            <div className="documentation-root-types">Type</div>
          </div>
          <div className="documentation-explorer-field">
            [
            <Link
              to="/graphiql"
              className="documentation-explorer-field-type"
              onClick={() => {
                setDocumentation({
                  selectedType: current.type.ofType.name,
                  type: current.type.ofType.name,
                  title: current.type.ofType.name,
                });
                setBackStack((prevStack) => [
                  ...prevStack,
                  {
                    selectedType: current.type.ofType.name,
                    type: current.type.ofType.name,
                    title: current.type.ofType.name,
                  },
                ]);
              }}
            >
              {current.type.ofType.name}
            </Link>
            ]
          </div>
        </>
      );
    }
    if (current.type instanceof GraphQLNonNull) {
      return (
        <div>
          <div className="documentation-explorer-field-description">
            <p>{current.description}</p>
          </div>
          <div className="documentation-root">
            <div className="documentation-root-types">Type</div>
          </div>
          <div className="documentation-explorer-field">
            [
            <Link
              to="/graphiql"
              className="documentation-explorer-field-type"
              onClick={() => {
                setDocumentation({
                  type: current.type.ofType.ofType.name,
                  selectedType: current.type.ofType.ofType.name,
                  title: current.type.ofType.ofType.name,
                });
                setBackStack((prevStack) => [
                  ...prevStack,
                  {
                    type: current.type.ofType.ofType.name,
                    selectedType: current.type.ofType.ofType.name,
                    title: current.type.ofType.ofType.name,
                  },
                ]);
              }}
            >
              {current.type.ofType.ofType.name}
            </Link>
            ]!
          </div>
        </div>
      );
    }
    if (current.type instanceof GraphQLScalarType) {
      return (
        <div>
          <div className="documentation-explorer-field-description">
            <p>{current.description}</p>
          </div>
          <div className="documentation-root">
            <div className="documentation-root-types">Type</div>
          </div>
          <div className="documentation-explorer-field">
            <Link
              to="/graphiql"
              className="documentation-explorer-field-type"
              onClick={() => {
                setDocumentation((prev) => ({
                  ...prev,
                  type: current.type.name,
                  title: current.type.name,
                }));
                setBackStack((prevStack) => [
                  ...prevStack,
                  {
                    type: current.type.name,
                    selectedType: documentation.selectedType,
                    title: current.type.name,
                  },
                ]);
              }}
            >
              {current.type.name}
            </Link>
          </div>
        </div>
      );
    }
    return (
      <div>
        <div className="documentation-explorer-field-description">
          <p>{current.description}</p>
        </div>
        <div className="documentation-root">
          <div className="documentation-root-types">Type</div>
        </div>
        <div className="documentation-explorer-field">
          <Link
            to="/graphiql"
            className="documentation-explorer-field-type"
            onClick={() => {
              setDocumentation({
                type: current.type.name,
                selectedType: current.type.name,
                title: current.type.name,
              });
              setBackStack((prevStack) => [
                ...prevStack,
                {
                  type: current.type.name,
                  selectedType: current.type.name,
                  title: current.type.name,
                },
              ]);
            }}
          >
            {current.type.name}
          </Link>
        </div>
      </div>
    );
  }

  function CurrentField({ selected }: { selected: string }) {
    const field = schema && (schema.getType(selected) as GraphQLObject);
    const fields = field ? field.getFields() : {};
    const array: GraphQLNestedList[] = Object.values(fields);
    const current = array.find((item) => item.name === documentation.type);
    return (
      <>
        <div className="documentation-root-header">
          <div className="documentation-root-header-title">{documentation.title}</div>
        </div>
        {current && isTypeCurrentField(current)}
        {current && current.args && current.args.length > 0 && (
          <div>
            <div className="documentation-root">
              <div className="documentation-root-types">Arguments:</div>
            </div>
            <div className="documentation-explorer-field">{fieldArguments(current)}</div>
          </div>
        )}
      </>
    );
  }

  const objectType = (value: GraphQLObjectType | GraphQLInputObjectType) => {
    const fields = value.getFields();
    const array = Object.values(fields);
    return (
      <>
        <div className="documentation-root-header">
          <div className="documentation-root-header-title">{documentation.title}</div>
        </div>
        <div className="documentation-root">
          <div className="documentation-root-types">Fields:</div>
        </div>
        <ul className="documentation-explorer-list">
          {array.map((item) => (
            <li className="documentation-explorer-list-item" key={item.name}>
              <Link
                to="/graphiql"
                className="documentation-explorer-field-name"
                onClick={() => {
                  setDocumentation((prev) => ({ ...prev, type: item.name, title: item.name }));
                  setBackStack((prevStack) => [
                    ...prevStack,
                    {
                      type: item.name,
                      selectedType: documentation.selectedType,
                      title: item.name,
                    },
                  ]);
                }}
              >
                {item.name}
              </Link>
              {item.args && item.args.length > 0 && (
              <>
                (
                {fieldArguments(item)}
                )
              </>
              )}
              :
              {' '}
              {graphQLListType(item)}
              {item.description && (
                <div className="documentation-explorer-field-description">
                  <p>{item.description}</p>
                </div>
              )}
            </li>
          ))}
        </ul>
      </>
    );
  };

  function ScalarObjectType() {
    const description = schema && schema.getType(documentation.type);
    const formattedText = description && description.description ? description.description.replace(
      /`([^`]*)`/g,
      (_, code) => `<code class="documentation-explorer-field-description-dangerously">${code.replace(
        /`/g,
        '&#96;'
      )}</code>`
    ) : '';
    return (
      <>
        <div className="documentation-root-header">
          <div className="documentation-root-header-title">{documentation.title}</div>
        </div>
        <div className="documentation-root-description">
          <p>{React.createElement('span', { dangerouslySetInnerHTML: { __html: formattedText } })}</p>
        </div>
      </>
    );
  }

  function Fields() {
    const typeByName = schema && schema.getType(documentation.type);
    if (typeByName instanceof GraphQLObjectType || typeByName instanceof GraphQLInputObjectType) {
      return objectType(typeByName);
    }
    if (typeByName instanceof GraphQLScalarType) {
      return <ScalarObjectType />;
    }
    return <CurrentField selected={documentation.selectedType} />;
  }

  const reversePage = () => {
    if (backStack.length === 1) {
      if (documentation.selectedType === 'Query') {
        setDocumentation({
          type: 'Docs',
          selectedType: 'Query',
          title: 'Docs',
        });
        setBackStack([]);
      } else {
        setDocumentation(backStack[0]);
        setBackStack([]);
      }
    } else if (backStack.length === 2) {
      setDocumentation(backStack[0]);
      setBackStack(backStack.slice(0, -1));
    } else {
      setDocumentation(backStack[backStack.length - 2]);
      setBackStack(backStack.slice(0, -1));
    }
  };

  function DocsRoot() {
    return documentation.type === 'Docs' ? <DefaultDocs /> : <Fields />;
  }

  return (
    schema && (
      <>
        {documentation.type === 'Docs' ? null : (
          <div className="documentation-explorer-back">
            <span
              className="documentation-explorer-back-link"
              onClick={() => {
                reversePage();
              }}
            >
              {backStack.length === 1 ? 'Docs' : backStack[backStack.length - 2].type}
            </span>
          </div>
        )}
        <div className="documentation-explorer">
          <DocsRoot />
        </div>
      </>
    )
  );
}

export default RenderSchema;
