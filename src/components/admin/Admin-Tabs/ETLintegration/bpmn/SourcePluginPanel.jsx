import { Button } from '@/componentss/ui/button';
import { Dropdown } from '@/componentss/ui/dropdown';
import { Label } from '@/componentss/ui/label';
import { Input } from '@/componentss/ui/input';
import { getArryFromObj } from '../../../../workflow/BPMN/Helper/helper';

export const SourcePluginPanel = ({
  jobPanel,
  setJobPanel,
  allPluginList,
  soucePanelData,
  setSoucePanelData,
  sourceEnvList,
  setSourceEnvDetail,
  srcSelectedPlugin,
  renderNeededJsonByType,
  handleSubmitPanel,
  destinationPanelData,
  destinationEnvList,
  setDestEnvDetail,
  destSelectedPlugin,
  setDestinationPanelData,
  setDestSelectedPlugin,
  getEnvironment,
  setSrcSelectedPlugin,
  setPluginJsonObj
}) => {
  const handleSelectPlugin = (value, field) => {
    let SelectedPlugin = allPluginList.filter((item) => item.value === value);
    if (field === 'destinationPlugin') {
      setDestSelectedPlugin(SelectedPlugin[0]);
      getEnvironment(value, null, 'destination');

      setDestinationPanelData((prev) => ({
        ...prev,
        destination: value,
        logo: SelectedPlugin[0]?.logoUrl,
        neededJson: SelectedPlugin[0]?.neededJson
      }));
    } else {
      setSrcSelectedPlugin(SelectedPlugin[0]);
      getEnvironment(value, null, 'source');
      setSoucePanelData((prev) => ({
        ...prev,
        source: value,
        logo: SelectedPlugin[0]?.logoUrl,
        neededJson: SelectedPlugin[0]?.neededJson
      }));
    }
    setPluginJsonObj({});
  };
  return (
    <>
      {jobPanel?.SourcePlugin && (
        <div id="set-variable-panel" className="panel notify-panel">
          <form id="setForm">
            <p>
              <b>Source Plugin Panel</b>
            </p>
            <Button
              id="close"
              variant="outline"
              className="close-btn"
              type="button"
              onClick={() =>
                setJobPanel({
                  SourcePlugin: false
                })
              }
            >
              &times;
            </Button>
            <div className="flex items-center justify-between">
              <div className="max-w-50">
                <Dropdown
                  className="max-w-50"
                  label="Select Source Plugin"
                  options={allPluginList}
                  type="text"
                  value={soucePanelData?.source}
                  onChange={(event) =>
                    handleSelectPlugin(event.target.value, 'sourcePlginId')
                  }
                />
              </div>
              <div className="w-100">
                <Dropdown
                  label="Select Environment"
                  options={sourceEnvList}
                  type="text"
                  value={soucePanelData?.sourceEnv}
                  onChange={(event) => {
                    const sourceEnv = sourceEnvList.filter(
                      (o) => o.value === event.target.value
                    );
                    if (sourceEnv[0]?.filledJson) {
                      const result = getArryFromObj(sourceEnv[0]?.filledJson);
                      setSourceEnvDetail(result);
                    }
                    setSoucePanelData((prev) => ({
                      ...prev,
                      sourceEnv: event.target.value
                    }));
                  }}
                />
              </div>
            </div>
            <hr className="my-2"></hr>
            <div className="">
              {srcSelectedPlugin?.neededJson &&
                Object.entries(srcSelectedPlugin?.neededJson).map(
                  ([key, type]) => (
                    <div key={key}>{renderNeededJsonByType(key, type)}</div>
                  )
                )}
            </div>
            <div className="mt-4 flex">
              <div item>
                <Button onClick={(e) => handleSubmitPanel(e, 'source')}>
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
      {jobPanel?.destinationPlugin && (
        <div id="set-variable-panel" className="panel notify-panel">
          <form id="setForm">
            <p>
              <b>Select destination Plugin</b>
            </p>
            <Button
              id="close"
              variant="outline"
              className="close-btn"
              type="button"
              onClick={() =>
                setJobPanel({
                  destinationPlugin: false
                })
              }
            >
              &times;
            </Button>
            <div className="flex items-center justify-between">
              <Dropdown
                label="Select Destination Plugin"
                options={allPluginList}
                type="text"
                value={destinationPanelData?.destination}
                onChange={(event) =>
                  handleSelectPlugin(event.target.value, 'destinationPlugin')
                }
              />

              <Dropdown
                label="Select Environment"
                options={destinationEnvList}
                type="text"
                value={destinationPanelData?.destinationEnv}
                onChange={(event) => {
                  const destEnv = destinationEnvList.filter(
                    (o) => o.value === event.target.value
                  );
                  if (destEnv) {
                    const result = getArryFromObj(destEnv[0]?.filledJson);
                    setDestEnvDetail(result);
                  }
                  setDestinationPanelData((prev) => ({
                    ...prev,
                    destinationEnv: event.target.value
                  }));
                }}
              />
            </div>

            <hr className="my-2"></hr>
            <div className="">
              {destSelectedPlugin?.neededJson &&
                Object.entries(destSelectedPlugin?.neededJson).map(
                  ([key, type]) => (
                    <div key={key}>{renderNeededJsonByType(key, type)}</div>
                  )
                )}
            </div>

            <div className="mt-4 flex">
              <div item>
                <Button onClick={(e) => handleSubmitPanel(e, 'destination')}>
                  Ok
                </Button>
              </div>
              <div className="mx-2">
                <Button
                  variant="outline"
                  onClick={() =>
                    setJobPanel({
                      destinationPlugin: false
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
