export const addDataAtCursor = (
  newExpression,
  inputRef,
  expression,
  setExpression
) => {
  const input = inputRef.current;
  const cursorPosition = input.selectionStart;
  const currentValue = expression;
  if (cursorPosition !== 0) {
    const updatedExpression =
      currentValue?.slice(0, cursorPosition) +
      newExpression +
      currentValue?.slice(cursorPosition);

    setExpression(updatedExpression);

    // Update the cursor position to be after the inserted text
    setTimeout(() => {
      input.setSelectionRange(
        cursorPosition + newExpression.length,
        cursorPosition + newExpression.length
      );
    }, 0);
  } else {
    setExpression(newExpression);
  }
};

//    const getParentElem = (Arr, childElem, parentArr) => {
//   for (const sequenceFlow of Arr) {
//     if (sequenceFlow.id === childElem) {
//       if (Array.isArray(sequenceFlow.incoming)) {
//         for (const item of sequenceFlow.incoming) {
//           if (item.sourceRef?.name !== 'Start') {
//             parentArr.push(item);
//             if (item.sourceRef?.id) {
//               getParentElem(Arr, item.sourceRef.id, parentArr);
//             }
//           }
//         }
//       }
//     }
//   }
//   return parentArr;
// };

// export const getVariableTaskId = (definitions, task) => {
//   let parentArr = [];
//   for (const process of definitions.rootElements) {
//     let sequenceFlows = process.flowElements?.filter(
//       (element) =>
//         element.$type === 'bpmn:Task' ||
//         element.$type === 'bpmn:ExclusiveGateway'
//     );
//     const parentElemt = getParentElem(
//       sequenceFlows,
//       task?.businessObject?.id,
//       parentArr
//     );

//     return parentElemt;
//   }
// };

// export const getPerentData = (definitions, elem,setRestApiVariableObj,setParentDataArr,setError) => {
//   const previousTaskId = getVariableTaskId(definitions, elem);

//   if (previousTaskId) {
//     const tempArray = [];

//     previousTaskId.forEach((elem) => {
//       const { sourceRef } = elem;

//       const parentData = sourceRef?.$attrs?.variables;
//       if (!parentData) return;

//       const variableData = JSON.parse(parentData);

//       const addOutputs = (outputArr, type) => {
//         if (type === 'RestApi') {
//           setRestApiVariableObj((prev) => ({
//             ...prev,
//             [sourceRef.id]: variableData?.json
//           }));
//           tempArray.push({
//             id: sourceRef.id,
//             name: `${sourceRef.id}`,
//             value: '',
//             label: `${sourceRef.id}`
//           });
//         } else {
//           outputArr?.forEach((o) => {
//             tempArray.push({
//               id: sourceRef.id,
//               name: `${sourceRef.id}.out.${
//                 type === 'value' ? o.name : 'string'
//               }`,
//               value: '',
//               label: `${sourceRef.id}.out.${
//                 type === 'value' ? o.name : 'string'
//               }`
//             });
//           });
//         }
//       };
//       switch (sourceRef.name) {
//         case 'Operation':
//           if (variableData?.operation === 'Select') {
//             addOutputs(variableData?.value, 'value');
//           }
//           break;
//         case 'Set value':
//           addOutputs(variableData?.columns, 'value');
//           break;
//         case 'RestApi':
//           addOutputs(sourceRef.id, 'RestApi');
//           break;
//         case 'Insert':
//         case 'Length':
//         case 'Matches':
//         case 'Replace':
//         case 'Issubstring':
//         case 'Substring':
//         case 'Uppercase':
//         case 'Lowercase':
//         case 'Trim':
//         case 'Concat':
//           tempArray.push({
//             id: sourceRef.id,
//             name: `${sourceRef.id}.out.string`,
//             value: '',
//             label: `${sourceRef.id}.out.string`
//           });
//         case 'DateAdd':
//         case 'DateDiff':
//         case 'DateFetch':
//           tempArray.push({
//             id: sourceRef.id,
//             name: `${sourceRef.id}.out.datetime`,
//             value: '',
//             label: `${sourceRef.id}.out.datetime`
//           });
//           break;
//         default:
//           return;
//       }
//     });

//     if (typeof setParentDataArr === 'function') {
//       setParentDataArr([...tempArray]);
//     } else {
//       console.error('setParentDataArr is not a function');
//     }

//   } else {
//     setError(true);
//   }
// };
