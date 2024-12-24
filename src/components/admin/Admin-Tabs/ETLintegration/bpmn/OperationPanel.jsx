import { Button } from '@/componentss/ui/button';
import { Dropdown } from '@/componentss/ui/dropdown';
import { Label } from '@/componentss/ui/label';
import { Input } from '@/componentss/ui/input';

export const OperationPanel = ({
  jobPanel,
  setJobPanel,
  sourceObject,
  sourceObjData,
  setsourceObjData,
  setSrcOperationObj,
  setSorceObjectDetail,
  srcOperationObj,
  renderNeededJsonByType,
  destinationObject,
  setDestinatnObjData,
  destinatnObjData,
  setDesOperationObj,
  desOperationObj,
  setDestObjectDetail,
  handleSubmitObjectPanel
}) => {
  return (
    <>
      {jobPanel?.sourceObject && (
        <div id="set-variable-panel" className="panel notify-panel">
          <form id="setForm">
            <p>
              <b>Map Your Types for a Seamless integration</b>
            </p>
            <Button
              id="close"
              variant="outline"
              className="close-btn"
              onClick={() =>
                setJobPanel({
                  sourceObject: false
                })
              }
            >
              &times;
            </Button>
            <div className="mt-2 flex flex-col">
              <div className="mb-4">
                <Dropdown
                  label="Select Source Operation"
                  options={sourceObject}
                  type="text"
                  value={sourceObjData?.sourceId}
                  onChange={(event) => {
                    const getSelectedOperation = sourceObject.filter(
                      (item) => item.value === event.target.value
                    );
                    setSrcOperationObj(getSelectedOperation[0]);
                    setSorceObjectDetail(
                      getSelectedOperation[0]?.singleObjectStructure
                    );
                    setsourceObjData((prev) => ({
                      sourceId: event.target.value
                    }));
                  }}
                />
              </div>
            </div>
            <hr className="my-2"></hr>
            <div className="">
              {srcOperationObj?.neededJson &&
                Object.entries(srcOperationObj?.neededJson).map(
                  ([key, type]) => (
                    <div key={key}>{renderNeededJsonByType(key, type)}</div>
                  )
                )}
            </div>
            <div className="mt-4 flex">
              <div>
                <Button onClick={(e) => handleSubmitObjectPanel(e, 'sourceId')}>
                  Ok
                </Button>
              </div>
              <div className="mx-2">
                <Button
                  variant="outline"
                  onClick={() =>
                    setJobPanel({
                      sourceObject: false
                    })
                  }
                >
                  Close
                </Button>
              </div>
            </div>
          </form>
        </div>
      )}
      {jobPanel?.destinationObject && (
        <div id="set-variable-panel" className="panel notify-panel">
          <form id="setForm">
            <p>
              <b>Map Your Types for a Seamless integration</b>
            </p>
            <Button
              id="close"
              variant="outline"
              className="close-btn"
              onClick={() =>
                setJobPanel({
                  transformation: false
                })
              }
            >
              &times;
            </Button>
            <div className="mt-2 flex flex-col">
              <div className="mb-4">
                <Dropdown
                  className="mb-3"
                  label="Select  Destination Object"
                  options={destinationObject}
                  type="text"
                  value={destinatnObjData?.destinationId}
                  onChange={(event) => {
                    setDestinatnObjData((prev) => ({
                      destinationId: event.target.value
                    }));
                    const getSelectedOperation = destinationObject.filter(
                      (item) => item.value === event.target.value
                    );
                    setDesOperationObj(getSelectedOperation[0]);
                    const clearedValue = Object.keys(
                      getSelectedOperation[0]?.singleObjectStructure
                    ).reduce((acc, key) => {
                      acc[key] = null; // or use '' for empty strings
                      return acc;
                    }, {});

                    setDestObjectDetail(clearedValue);
                  }}
                />
              </div>
            </div>
            <hr className="my-2"></hr>
            <div className="">
              {desOperationObj?.neededJson &&
                Object.entries(desOperationObj?.neededJson).map(
                  ([key, type]) => (
                    <div key={key}>{renderNeededJsonByType(key, type)}</div>
                  )
                )}
            </div>
            <div className="mt-4 flex">
              <div>
                <Button
                  onClick={(e) => handleSubmitObjectPanel(e, 'destinationId')}
                >
                  Ok
                </Button>
              </div>
              <div className="mx-2">
                <Button
                  variant="outline"
                  onClick={() =>
                    setJobPanel({
                      SourcePlugin: false
                    })
                  }
                >
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
