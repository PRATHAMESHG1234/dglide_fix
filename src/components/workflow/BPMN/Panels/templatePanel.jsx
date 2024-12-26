import {
  Chip,
  Divider,
  Grid,
  IconButton,
  Typography,
  Button as Buttons
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { colors } from '../../../../common/constants/styles';
import CloseIcon from '@mui/icons-material/Close';
import { fetchAllTemplateByFormInfoId } from '../../../../services/formTemplate';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import { Add } from '@mui/icons-material';
import { useLocalStorage } from '../custom/useLocalStorage';

export const TempaltePanel = ({
  closeTemplatePanel,
  formList,
  getTableColumn,
  newColumnList,
  setNewColumnList,
  submitTemplatePanal,
  setTemplateData,
  templateData,
  setSelectedformId,
  selectedformId,
  handleRowSelect,
  addExpression
}) => {
  const { get, set } = useLocalStorage();
  const [templates, setTemplates] = useState([]);
  const [templatePayload, setTemplatePayload] = useState({});

  const removeSelectedField = (Id) => {
    const filteredData = newColumnList.filter(
      (item) => item.fieldInfoId !== Id
    );
    setNewColumnList(filteredData);
  };

  const handleAddNewField = () => {
    getTableColumn(selectedformId, null);
  };
  const fetchTemplate = async (selectedformId) => {
    const res = await fetchAllTemplateByFormInfoId(selectedformId);
    const formTemp = await res?.result;
    setTemplates(formTemp);
  };
  useEffect(() => {
    fetchTemplate(selectedformId);
  }, [selectedformId]);

  const handleSelectForm = async (event) => {
    if (event.target.value) {
      setSelectedformId(event.target.value);
      const copyTemplate = Object.assign({}, templateData);
      copyTemplate.formId = event.target.value;
      setTemplateData(copyTemplate);
      fetchTemplate(event.target.value);
      getTableColumn(event.target.value);
    }
  };
  const handleSelectTemplate = async (event) => {
    const elemId = get(`currentElementId`) || '';
    const selectedOption = templates.filter(
      (o) => o.template_id === event.target.value
    );
    if (selectedOption) {
      const copyTemplate = Object.assign({}, templateData);
      copyTemplate.formName = selectedOption[0]?.form_info_id;
      copyTemplate.templateId = selectedOption[0]?.template_id;
      setTemplateData(copyTemplate);
      setTemplatePayload(JSON.parse(selectedOption[0]?.payload));
      set(`template_${elemId}`, JSON.stringify(copyTemplate));
    }
  };
  useEffect(() => {
    const updatedList = newColumnList.map((field) => {
      let updatedField = { ...field };
      Object.entries(templatePayload).map(([key, value]) => {
        if (field?.name === key) {
          updatedField = {
            ...field,
            value: value
          };
        }
      });
      return updatedField;
    });
    setNewColumnList(updatedList);
  }, [templatePayload]);

  return (
    <div id="set-variable-panel" className="panel">
      <form id="setForm">
        <p>
          <b>Template</b>
        </p>

        <IconButton
          aria-label="close"
          onClick={closeTemplatePanel}
          sx={{
            position: 'absolute',
            right: 10,
            top: 10,
            color: colors.grey[500],
            // backgroundColor: colors.grey[500],

            cursor: 'pointer'
          }}
        >
          <CloseIcon sx={{ fontSize: '15px' }} />
        </IconButton>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignContent: 'center',
            marginBottom: 20
          }}
        >
          <select
            onChange={(event) => handleSelectForm(event)}
            value={templateData?.formId}
          >
            <option value="" disabled>
              Select Form
            </option>
            {formList &&
              formList?.map((option) => (
                <option key={option.name} value={option.formInfoId}>
                  {option.name}
                </option>
              ))}
          </select>
          &nbsp;
          <select
            onChange={(event) => handleSelectTemplate(event)}
            value={templateData?.templateId}
          >
            <option value="" disabled>
              Select Template
            </option>
            {templates &&
              templates?.map((option) => (
                <option key={option.template_id} value={option.template_id}>
                  {option.name}
                </option>
              ))}
          </select>
        </div>
        <div className="m-2">
          <table>
            <thead>
              <tr>
                <th>Fields</th>
                <th>Value</th>
              </tr>
            </thead>

            <tbody className="operation-table-body">
              {newColumnList?.map((item, index) => (
                <tr key={item?.fieldInfoId}>
                  <td>
                    <input
                      type="text"
                      value={item?.name}
                      readOnly
                      // onBlur={generateOpeExpression}
                      onSelect={(e) => handleRowSelect(index, e)}
                    />
                  </td>

                  <td>
                    <input
                      type="text"
                      readOnly
                      className="table-row"
                      value={item?.value}
                    />
                  </td>

                  <td key={index} className="px-3">
                    <IconButton
                      className="mx-1"
                      sx={{
                        padding: '0px',
                        backgroundColor: colors.primary[200],
                        '&:hover': {
                          backgroundColor: colors.primary.dark
                        }
                      }}
                      onClick={() =>
                        addExpression(index, 'template', item?.value)
                      }
                    >
                      <AddIcon
                        sx={{
                          fontSize: '25px',
                          color: colors.primary.main,
                          '&:hover': {
                            color: colors.white
                          }
                        }}
                      />
                    </IconButton>

                    <IconButton
                      className="mx-1"
                      sx={{
                        padding: '0px',
                        backgroundColor: colors.secondary[200],
                        '&:hover': {
                          backgroundColor: colors.secondary.dark
                        }
                      }}
                      onClick={() => removeSelectedField(item?.fieldInfoId)}
                    >
                      <RemoveIcon
                        sx={{
                          fontSize: '25px',
                          color: colors.secondary.main,
                          '&:hover': {
                            color: colors.white
                          }
                        }}
                      />
                    </IconButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Divider className="my-2">
          <Chip
            variant="outlined"
            label={
              <div
                className="flex items-center justify-center"
                onClick={handleAddNewField}
              >
                <IconButton
                  sx={{
                    marginY: '20px',
                    marginRight: '2px',
                    padding: '0px',
                    backgroundColor: 'lightgrey'
                  }}
                >
                  <Add sx={{ fontSize: '13px' }} />
                </IconButton>
                <Typography
                  sx={{
                    fontSize: '10px',
                    cursor: 'pointer'
                    // marginTop: '20px'
                  }}
                  color="textSecondary"
                  fontWeight="500"
                >
                  Add Field
                </Typography>
              </div>
            }
            size="small"
          />
        </Divider>
        <Grid container spacing={2}>
          <Grid item>
            <Buttons variant="outlined" onClick={submitTemplatePanal}>
              Ok
            </Buttons>
          </Grid>
          <Grid item>
            <Buttons
              variant="outlined"
              color="error"
              onClick={closeTemplatePanel}
            >
              Close
            </Buttons>
          </Grid>
        </Grid>
      </form>
    </div>
  );
};
