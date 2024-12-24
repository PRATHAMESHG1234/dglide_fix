import React, { useState, useRef, useEffect } from 'react';
import { JsonPathPicker } from 'react-json-path-picker';
import { Textarea } from '@/componentss/ui/textarea';

export const JsonPath = ({
  jsonPathPickerPanel,
  jsonContent,
  elementId,
  onCancel,
  setPathText,
  pathText,
  submitJsonPathExpression
}) => {
  const [json, setJson] = useState({});
  const textRef = useRef('');

  useEffect(() => {
    if (jsonContent) {
      setJson(jsonContent);
    }
  }, [jsonContent]);

  const onChoosePath = (chosenPath) => {
    const strippedPath = chosenPath.replace(/"/g, '');
    const prefixedPath = `{${elementId}${strippedPath}}`;
    setPathText(prefixedPath);
  };
  console.log(jsonContent);
  return (
    <div className="flex flex-col gap-2">
      <div>
        <div
          style={{
            width: '70%',
            float: 'left',
            boxSizing: 'border-box',
            height: '50vh',
            overflow: 'scroll',
            border: '1px dashed #b4c4e0'
          }}
          className="mt-2"
        >
          <JsonPathPicker json={json} onChoose={onChoosePath} path={pathText} />
        </div>
        <div
          style={{
            width: '29%',
            float: 'left',
            height: '49vh',
            // boxSizing: "border-box",
            paddingLeft: '12px'
            // borderRight: "1px solid #888",
          }}
        >
          <span
            style={{ width: '90%', marginBottom: '10px' }}
            // onClick={mapPath}
          >
            Json path
          </span>
          <Textarea
            // style={{
            //   width: '90%',
            //   minHeight: '140px',
            //   boxSizing: 'border-box',
            //   borderRadius: '10px',
            //   // border: "1px solid #108ee9",
            //   padding: '10px'
            // }}
            rows={21}
            cols={25}
            onChange={(e) => setPathText(e.target.value)}
            value={pathText}
          />
        </div>
      </div>
    </div>
  );
};
