import React from 'react';
import { GraphQLList, GraphQLNonNull } from 'graphql';
import { Documentation, GraphQLNestedList } from '../types';

interface Props {
  setDoc: React.Dispatch<
    React.SetStateAction<{
      type: string;
      selectedType: string;
      title: string;
    }>
  >;
  setDocBox: React.Dispatch<React.SetStateAction<[] | Documentation[]>>;
  item: GraphQLNestedList;
}

function GraphQLListType(props: Props) {
  const { setDoc, setDocBox, item } = props;
  if (item.type instanceof GraphQLList) {
    return (
      <>
        [
        <span
          className="render-exp-field-type link"
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
        </span>
        ]
      </>
    );
  }
  if (item.type instanceof GraphQLNonNull) {
    return (
      <>
        [
        <span
          className="render-exp-field-type link"
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
        </span>
        ]!
      </>
    );
  }
  return (
    <span
      className="render-exp-field-type link"
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
    </span>
  );
}

export default GraphQLListType;
