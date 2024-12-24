import { Button } from '@/componentss/ui/button';
import { addDataAtCursor } from '../../../../workflow/BPMN/BpmnCommonFunctions';
import { Textarea } from '@/componentss/ui/textarea';
import { Modal } from '@/componentss/ui/modal';

export const ExpressionPanel = ({
  setExpressionPanel,
  selectedOptn,
  setselectedOptn,
  selectedType,
  expresionPanelList,
  panelName,
  inputRef,
  expression,
  setSelectedType,
  setExpresionPanelList,
  sourceEnvDetail,
  setTransInputModel,
  transformationList,
  setTransInputData,
  setExpression,
  setPathPickerPanel,
  setJsonContent,
  sorceObjectDetail,
  destEnvDetail,
  secondExp,
  setFilledJsonObj,
  setSecondExp,
  defaultExpresion,
  transInputModel,
  transInputData,
  renderInputByType,
  filledJsonObj,
  submitExpression
}) => {
  const handleExpression = async (SelectedOption) => {
    let newExpression;
    if (selectedType === 'sourceEnvironment') {
      newExpression = `{source_env.${SelectedOption}}`;
    } else if (selectedType === 'destinationEnvironment') {
      newExpression = `{destination_env.${SelectedOption}}`;
    } else if (selectedType === 'transformation') {
      setTransInputModel(true);
      const selected = transformationList.filter(
        (o) => o.id === SelectedOption
      );
      setTransInputData(selected);
    }
    console.log(newExpression);
    console.log(expression);
    addDataAtCursor(newExpression, inputRef, expression, setExpression);

    setSelectedType('');
    setExpresionPanelList(defaultExpresion);
  };
  const handleSelectOptn = (option) => {
    if (option === 'sourceObject') {
      setPathPickerPanel(true);
      setSelectedType('');
      setJsonContent(JSON.stringify(sorceObjectDetail));
    } else if (option === 'sourceEnvironment') {
      setSelectedType(option);
      setExpresionPanelList(sourceEnvDetail);
    } else if (option === 'destinationEnvironment') {
      setSelectedType(option);
      setExpresionPanelList(destEnvDetail);
    } else if (option === 'transformation') {
      setSelectedType(option);
      setExpresionPanelList(transformationList);
    }
  };
  const submitCoExpression = (e) => {
    e.preventDefault();
    let expressionCoIndex = localStorage.getItem('etlCoIndex');
    let expressionCoType = localStorage.getItem('etlCoType');
    if (expression) {
      if (expressionCoType === 'childexpresion') {
        setFilledJsonObj((prev) => ({
          ...prev,
          [expressionCoIndex]: expression
        }));
        setSecondExp(false);
      }
    }
  };

  // const submitExpression = (e) => {
  //   e.preventDefault();
  //   let expressionIndex = localStorage.getItem('etlIndex');
  //   let expressionType = localStorage.getItem('etlType');
  //   if (expression) {
  //     if (expressionType === 'transformation') {
  //       const copyOfObj = Object.assign({}, destObjectDetail);
  //       copyOfObj[expressionIndex] = expression;
  //       setDestObjectDetail(copyOfObj);
  //       setExpressionPanel(false);
  //     } else if (expressionType === 'needeJson') {
  //       setPluginJsonObj((prev) => ({
  //         ...prev,
  //         [expressionIndex]: expression
  //       }));

  //       setExpressionPanel(false);
  //     }
  //   }
  // };
  const handleTextAreaChange = (event) => {
    const newText = event.target.value;
    setExpression(newText);
  };
  console.log(panelName);

  return (
    <>
      <Modal
        isOpen={ExpressionPanel}
        onClose={() => setExpressionPanel(false)}
        title={'Description'}
        onConfirm={(e) => submitExpression(e)}
        onCancel={() => setExpressionPanel(false)}
        width={'75'}
        firstButtonText={'Close'}
        firstButtonVariant="Delete"
        secondButtonText=""
        // className="overflow-hidden"
      >
        <div>
          <form id="setFormxpression">
            <p>
              <b>Expression Panel</b>
            </p>

            <table>
              <tr className="flex">
                <td>
                  <label>
                    Select Opeartion
                    <br />
                    expresionPanelList Field
                  </label>
                  <div>
                    <select
                      style={{
                        border: '1px solid #d6d2d2',
                        height: 331,
                        width: 240,
                        overflowX: 'scroll'
                      }}
                      className="p-3"
                      multiple
                      value={selectedOptn?.firstExp}
                      onChange={(event) => {
                        setselectedOptn({ firstExp: event.target.value });
                        selectedType !== ''
                          ? handleExpression(event.target.value)
                          : handleSelectOptn(event.target.value);
                      }}
                    >
                      {expresionPanelList
                        .filter((o) => o.value !== panelName)
                        .map((item, i) => (
                          <option key={i} value={item.value} className="my-1">
                            {item.label}
                          </option>
                        ))}
                    </select>
                  </div>
                </td>
                <td className="">
                  <div className="flex items-center">
                    <label>
                      Write <br />
                      expression
                    </label>
                  </div>

                  <div>
                    <Textarea
                      className="h-81 min-w-60"
                      ref={inputRef}
                      rows={16}
                      cols={25}
                      type="text"
                      value={expression}
                      onChange={handleTextAreaChange}
                      // onBlur={generateExpression}
                    />
                  </div>
                </td>
              </tr>
            </table>
          </form>
        </div>
      </Modal>
      {transInputModel && (
        <div id="set-variable-panel" className="panel notify-panel">
          <form id="setForm">
            <p>
              <b>Map Your Types for a Seamless integration</b>
            </p>
            <Button
              id="close"
              className="close-btn"
              variant="outline"
              onClick={() => setTransInputModel(false)}
            >
              &times;
            </Button>
            <div className="mt-2 flex flex-col">
              <div className="mb-4">
                {transInputData &&
                  Object.entries(JSON.parse(transInputData[0]?.needInput)).map(
                    ([key, value]) => (
                      <div key={key}>{renderInputByType(key, value)}</div>
                    )
                  )}
              </div>
            </div>

            <div className="mt-4 flex">
              <div>
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    const parcedJson = JSON.stringify(filledJsonObj);
                    const text = `{trans(${transInputData[0].id},${parcedJson})}`;
                    setExpression(text);
                    // addDataAtCursor(text, inputRef, expression, setExpression);
                    setTransInputModel(false);
                  }}
                >
                  Ok
                </Button>
              </div>
              <div className="mx-2">
                <Button
                  variant="outline"
                  onClick={() => setTransInputModel(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          </form>
        </div>
      )}
      {secondExp && (
        <div id="set-variable-panel" className={`panel expression-panel`}>
          <form id="setFormxpression12">
            <p>
              <b>Expression Panel</b>
            </p>

            <Button
              id="close"
              className="close-btn"
              type="button"
              variant="outline"
              onClick={() => setSecondExp(false)}
            >
              &times;
            </Button>

            <table>
              <tr className="flex">
                <td>
                  <label>
                    Select Opeartion
                    <br />
                    expresionPanelList Field
                  </label>
                  <div>
                    <select
                      style={{
                        border: '1px solid #d6d2d2',
                        height: 331,
                        width: 240,
                        overflowX: 'scroll'
                      }}
                      className="p-3"
                      multiple
                      value={selectedOptn?.secondExp}
                      onChange={(event) => {
                        setselectedOptn({ secondExp: event.target.value });
                        selectedType !== ''
                          ? handleExpression(event.target.value)
                          : handleSelectOptn(event.target.value);
                      }}
                    >
                      {expresionPanelList
                        .filter(
                          (o) =>
                            o.value !== 'transformation' &&
                            o.value !== panelName
                        )
                        .map((item, i) => (
                          <option key={i} value={item.value} className="my-1">
                            {item.label}
                          </option>
                        ))}
                    </select>
                  </div>
                </td>
                <td>
                  <div className="flex items-center">
                    <label>
                      Write <br />
                      expression
                    </label>
                  </div>

                  <div>
                    <Textarea
                      className="h-81 min-w-60"
                      rows={13}
                      cols={17}
                      type="text"
                      value={expression}
                      onChange={handleTextAreaChange}
                      // onBlur={generateExpression}
                    />
                  </div>
                </td>
              </tr>
            </table>
            <div className="flex">
              <div>
                <Button onClick={(e) => submitCoExpression(e)}>Ok</Button>
              </div>
              <div>
                <Button variant="outline" onClick={() => setSecondExp(false)}>
                  Close
                </Button>
              </div>
            </div>
          </form>
        </div>
      )}
    </>
  );
};
