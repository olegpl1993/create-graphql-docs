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
import { GraphQLNestedList, GraphQLObject, Documentation } from './types';
import './RenderDocs.css';

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

interface Props {
  url: string;
}

function RenderDocs(props: Props) {
  const { url } = props;
  const [schema, setSchema] = useState<GraphQLSchema | null>(null);
  useEffect(() => {
    (async () => {
      setSchema(await requestSchema(url));
    })();
  }, []);

  const [docBox, setDocBox] = useState<Documentation[] | []>([]);
  const [doc, setDoc] = useState({
    type: 'Docs',
    selectedType: 'Query',
    title: 'Docs',
  });

  function DefaultDocs() {
    return (
      <div className="docs">
        <div className="render-docs-header">
          <div className="render-docs-header-title">{doc.title}</div>
        </div>
        <div className="render-docs-description">
          A GraphQL schema provides a root type for each kind of operation.
        </div>
        <div className="render-docs">
          <div className="render-docs-types">Root Types</div>
          <div className="render-docs-content">
            <span className="render-docs-field">query</span>:{' '}
            <span
              className="render-docs-scalar"
              onClick={() => {
                setDoc({ type: 'Query', selectedType: 'Query', title: 'Query' });
                setDocBox((prevStack) => [
                  ...prevStack,
                  { type: 'Query', selectedType: 'Query', title: 'Query' },
                ]);
              }}
            >
              {doc.selectedType}
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
            className="render-exp-field-type"
            onClick={() => {
              setDoc({
                type: item.type.ofType.name,
                selectedType: item.type.ofType.name,
                title: item.type.ofType.name,
              });
              setDocBox((prevStack) => [
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
            className="render-exp-field-type"
            onClick={() => {
              setDoc({
                type: item.type.ofType.ofType.name,
                selectedType: item.type.ofType.ofType.name,
                title: item.type.ofType.ofType.name,
              });
              setDocBox((prevStack) => [
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
        className="render-exp-field-type"
        onClick={() => {
          setDoc({
            type: item.type.name,
            selectedType: item.type.name,
            title: item.type.name,
          });
          setDocBox((prevStack) => [
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
    const clazz =
      current.args.length > 1
        ? 'render-exp-field-arguments-notsingle'
        : 'render-exp-field-arguments-single';
    return (
      <>
        {current.args.map((arg) => {
          if (arg.type instanceof GraphQLInputObjectType) {
            return (
              <div className={clazz} key={arg.name}>
                <span className="render-exp-field-arguments">{arg.name}</span>:{' '}
                <Link
                  to="/graphiql"
                  className="render-exp-field-type"
                  onClick={() => {
                    setDoc({
                      type: arg.type.name,
                      selectedType: arg.type.name,
                      title: arg.type.name,
                    });
                    setDocBox((prevStack) => [
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
                <span className="render-exp-field-arguments">{arg.name}</span>: [
                <Link
                  to="/graphiql"
                  className="render-exp-field-type"
                  onClick={() => {
                    setDoc((prev) => ({
                      ...prev,
                      type: arg.type.ofType.ofType.ofType.name,
                      title: arg.type.ofType.ofType.ofType.name,
                    }));
                    setDocBox((prevStack) => [
                      ...prevStack,
                      {
                        type: arg.type.ofType.ofType.ofType.name,
                        selectedType: doc.selectedType,
                        title: arg.type.ofType.ofType.ofType.name,
                      },
                    ]);
                  }}
                >
                  <span className="render-exp-field-type">
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
                <span className="render-exp-field-arguments">{arg.name}</span>:{' '}
                <Link
                  to="/graphiql"
                  className="render-exp-field-type"
                  onClick={() => {
                    setDoc((prev) => ({
                      ...prev,
                      type: arg.type.ofType.name,
                      title: arg.type.ofType.name,
                    }));
                    setDocBox((prevStack) => [
                      ...prevStack,
                      {
                        type: arg.type.ofType.name,
                        selectedType: doc.selectedType,
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
              <span className="render-exp-field-arguments">{arg.name}</span>:{' '}
              <Link
                to="/graphiql"
                className="render-exp-field-type"
                onClick={() => {
                  setDoc((prev) => ({
                    ...prev,
                    type: arg.type.name,
                    title: arg.type.name,
                  }));
                  setDocBox((prevStack) => [
                    ...prevStack,
                    {
                      type: arg.type.name,
                      selectedType: doc.selectedType,
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
          <div className="render-exp-field-description">
            <p>{current.description}</p>
          </div>
          <div className="render-docs">
            <div className="render-docs-types">Type</div>
          </div>
          <div className="render-exp-field">
            [
            <Link
              to="/graphiql"
              className="render-exp-field-type"
              onClick={() => {
                setDoc({
                  selectedType: current.type.ofType.name,
                  type: current.type.ofType.name,
                  title: current.type.ofType.name,
                });
                setDocBox((prevStack) => [
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
          <div className="render-exp-field-description">
            <p>{current.description}</p>
          </div>
          <div className="render-docs">
            <div className="render-docs-types">Type</div>
          </div>
          <div className="render-exp-field">
            [
            <Link
              to="/graphiql"
              className="render-exp-field-type"
              onClick={() => {
                setDoc({
                  type: current.type.ofType.ofType.name,
                  selectedType: current.type.ofType.ofType.name,
                  title: current.type.ofType.ofType.name,
                });
                setDocBox((prevStack) => [
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
          <div className="render-exp-field-description">
            <p>{current.description}</p>
          </div>
          <div className="render-docs">
            <div className="render-docs-types">Type</div>
          </div>
          <div className="render-exp-field">
            <Link
              to="/graphiql"
              className="render-exp-field-type"
              onClick={() => {
                setDoc((prev) => ({
                  ...prev,
                  type: current.type.name,
                  title: current.type.name,
                }));
                setDocBox((prevStack) => [
                  ...prevStack,
                  {
                    type: current.type.name,
                    selectedType: doc.selectedType,
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
        <div className="render-exp-field-description">
          <p>{current.description}</p>
        </div>
        <div className="render-docs">
          <div className="render-docs-types">Type</div>
        </div>
        <div className="render-exp-field">
          <Link
            to="/graphiql"
            className="render-exp-field-type"
            onClick={() => {
              setDoc({
                type: current.type.name,
                selectedType: current.type.name,
                title: current.type.name,
              });
              setDocBox((prevStack) => [
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
    const current = array.find((item) => item.name === doc.type);
    return (
      <>
        <div className="render-docs-header">
          <div className="render-docs-header-title">{doc.title}</div>
        </div>
        {current && isTypeCurrentField(current)}
        {current && current.args && current.args.length > 0 && (
          <div>
            <div className="render-docs">
              <div className="render-docs-types">Arguments:</div>
            </div>
            <div className="render-exp-field">{fieldArguments(current)}</div>
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
        <div className="render-docs-header">
          <div className="render-docs-header-title">{doc.title}</div>
        </div>
        <div className="render-docs">
          <div className="render-docs-types">Fields:</div>
        </div>
        <ul className="render-exp-list">
          {array.map((item) => (
            <li className="render-exp-list-item" key={item.name}>
              <Link
                to="/graphiql"
                className="render-exp-field-name"
                onClick={() => {
                  setDoc((prev) => ({ ...prev, type: item.name, title: item.name }));
                  setDocBox((prevStack) => [
                    ...prevStack,
                    {
                      type: item.name,
                      selectedType: doc.selectedType,
                      title: item.name,
                    },
                  ]);
                }}
              >
                {item.name}
              </Link>
              {item.args && item.args.length > 0 && <>({fieldArguments(item)})</>}:{' '}
              {graphQLListType(item)}
              {item.description && (
                <div className="render-exp-field-description">
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
    const description = schema && schema.getType(doc.type);
    const formattedText =
      description && description.description
        ? description.description.replace(
            /`([^`]*)`/g,
            (_, code) =>
              `<code class="render-exp-field-description-dangerously">${code.replace(
                /`/g,
                '&#96;'
              )}</code>`
          )
        : '';
    return (
      <>
        <div className="render-docs-header">
          <div className="render-docs-header-title">{doc.title}</div>
        </div>
        <div className="render-docs-description">
          <p>
            {React.createElement('span', { dangerouslySetInnerHTML: { __html: formattedText } })}
          </p>
        </div>
      </>
    );
  }

  function Fields() {
    const typeByName = schema && schema.getType(doc.type);
    if (typeByName instanceof GraphQLObjectType || typeByName instanceof GraphQLInputObjectType) {
      return objectType(typeByName);
    }
    if (typeByName instanceof GraphQLScalarType) {
      return <ScalarObjectType />;
    }
    return <CurrentField selected={doc.selectedType} />;
  }

  const reversePage = () => {
    if (docBox.length === 1) {
      if (doc.selectedType === 'Query') {
        setDoc({
          type: 'Docs',
          selectedType: 'Query',
          title: 'Docs',
        });
        setDocBox([]);
      } else {
        setDoc(docBox[0]);
        setDocBox([]);
      }
    } else if (docBox.length === 2) {
      setDoc(docBox[0]);
      setDocBox(docBox.slice(0, -1));
    } else {
      setDoc(docBox[docBox.length - 2]);
      setDocBox(docBox.slice(0, -1));
    }
  };

  function DocsRoot() {
    return doc.type === 'Docs' ? <DefaultDocs /> : <Fields />;
  }

  return (
    schema && (
      <>
        {doc.type === 'Docs' ? null : (
          <div className="render-exp-back">
            <span
              className="render-exp-back-link"
              onClick={() => {
                reversePage();
              }}
            >
              {docBox.length === 1 ? 'Docs' : docBox[docBox.length - 2].type}
            </span>
          </div>
        )}
        <div className="render-exp">
          <DocsRoot />
        </div>
      </>
    )
  );
}

export default RenderDocs;
