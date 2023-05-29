import React, { useEffect, useState } from 'react';
import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLInputObjectType,
  GraphQLScalarType,
  GraphQLList,
  GraphQLNonNull,
} from 'graphql';
import { GraphQLNestedList, GraphQLObject, Documentation } from './types';
import './RenderDocs.css';
import requestSchema from './scripts/scripts';
import DefaultDocs from './components/DefaultDocs';
import GraphQLListType from './components/GraphQLListType';
import FieldArguments from './components/FieldArguments';

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
            <span
              className="render-exp-field-type link"
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
            </span>
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
            <span
              className="render-exp-field-type link"
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
            </span>
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
            <span
              className="render-exp-field-type link"
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
            </span>
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
          <span
            className="render-exp-field-type link"
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
          </span>
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
            <div className="render-exp-field">
              <FieldArguments setDoc={setDoc} setDocBox={setDocBox} current={current} doc={doc} />
            </div>
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
              <span
                className="render-exp-field-name link"
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
              </span>
              {item.args && item.args.length > 0 && (
                <FieldArguments setDoc={setDoc} setDocBox={setDocBox} current={item} doc={doc} />
              )}
              : <GraphQLListType setDoc={setDoc} setDocBox={setDocBox} item={item} />
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
    return doc.type === 'Docs' ? (
      <DefaultDocs doc={doc} setDoc={setDoc} setDocBox={setDocBox} />
    ) : (
      <Fields />
    );
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
