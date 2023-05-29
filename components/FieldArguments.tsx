import React from 'react';
import { GraphQLInputObjectType, GraphQLList, GraphQLScalarType } from 'graphql';
import { Documentation, GraphQLNestedList } from '../types';

interface Props {
  doc: {
    type: string;
    selectedType: string;
    title: string;
  };
  setDoc: React.Dispatch<
    React.SetStateAction<{
      type: string;
      selectedType: string;
      title: string;
    }>
  >;
  setDocBox: React.Dispatch<React.SetStateAction<[] | Documentation[]>>;
  current: GraphQLNestedList;
}

function FieldArguments(props: Props) {
  const { setDoc, setDocBox, current, doc } = props;
  const clazz =
    current.args.length > 1
      ? 'render-exp-field-arguments-notsingle'
      : 'render-exp-field-arguments-single';
  return (
    <>
      {current.args.map((arg) => {
        if (arg.type instanceof GraphQLInputObjectType) {
          return (
            <div className={clazz} key={arg.name} style={{ border: '1px solid black' }}>
              <span className="render-exp-field-arguments">{arg.name}</span>:{' '}
              <span
                className="render-exp-field-type link"
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
              </span>
            </div>
          );
        }
        if (arg.type.ofType instanceof GraphQLList) {
          return (
            <div className={clazz} key={arg.name}>
              <span className="render-exp-field-arguments">{arg.name}</span>: [
              <span
                className="render-exp-field-type link"
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
              </span>
              ! ] !
            </div>
          );
        }
        if (arg.type.ofType instanceof GraphQLScalarType) {
          return (
            <div className={clazz} key={arg.name}>
              <span className="render-exp-field-arguments">{arg.name}</span>:{' '}
              <span
                className="render-exp-field-type link"
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
              </span>
              !
            </div>
          );
        }
        return (
          <div className={clazz} key={arg.name}>
            <span className="render-exp-field-arguments">{arg.name}</span>:{' '}
            <span
              className="render-exp-field-type link"
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
            </span>
          </div>
        );
      })}
    </>
  );
}

export default FieldArguments;
