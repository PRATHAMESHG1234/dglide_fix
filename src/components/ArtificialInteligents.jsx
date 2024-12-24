import {
  FormControl,
  FormLabel,
  MenuItem,
  Select,
  TextField
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { COLORS } from '../common/constants/styles';

import { fetchRecords } from '../redux/slices/tableSlice';
import { useDispatch } from 'react-redux';
import TextArea from '../elements/CreatorTextArea';
import { DataGrid } from '@mui/x-data-grid';
import { useSelector } from 'react-redux';
import { fetchAiRquest } from '../redux/slices/artificialAiSlice';
import { Button } from '@/componentss/ui/button';

export const ArtificialInteligents = () => {
  const dispatch = useDispatch();
  const [allUsecases, setAllUseCases] = useState([]);
  const { tableData } = useSelector((state) => state.table);
  const [inputKeysList, setInputKeysList] = useState([]);
  const [inputFieldList, setInputFieldList] = useState([]);
  const [outputFormatKeysArr, setOutputFormatKeysArr] = useState([]);
  const [formName, setFormName] = useState({});
  useEffect(() => {
    if (tableData) {
      setAllUseCases(tableData?.data);
    }
  }, [tableData]);

  const [selectedUseCase, setSelectedUseCase] = useState();
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [payloadData, setPayloadData] = useState();

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    let updatedValue = value;

    if (name === 'limit') {
      updatedValue = Number(value);
    }
    setFormName({
      ...formName,
      [name]: updatedValue
    });
  };

  function createPayloadMap(obj) {
    const inputFormat = obj.input_format;
    const inputKeys = inputFormat.split(', ').map((item) => item.split('(')[0]);
    let formData = Object.assign({}, formName);
    if (inputKeys.includes('config_name')) {
      formData.config_name = obj.config_name;
    }
    setFormName(formData);

    return formData;
  }

  function createHeaderMap(obj) {
    const inputFormat = obj.header;
    const entries = inputFormat.split(', ');

    const headerMap = {};
    headerMap['Content-Type'] = 'application/json';
    entries.forEach((entry) => {
      const parts = entry.split('(hardcoded-');

      if (parts.length === 2) {
        const [key, value] = parts;
        const trimmedKey = key.trim();
        const trimmedValue = value.trim().replace(')', '');
        headerMap[trimmedKey] = trimmedValue;
      } else {
        console.error(`Invalid entry format: ${entry}`);
      }
    });
    return headerMap;
  }

  function createArrayOfObjects(input) {
    const elements = input.split(', ');
    const resultArray = [];
    elements.forEach((element) => {
      const [key, valueWithBracket] = element.split('(');
      const value = valueWithBracket.slice(0, -1); // Remove the closing bracket ')'
      const obj = {};
      obj[key] = value;
      resultArray.push(obj);
    });
    return resultArray;
  }

  const fetchUrlData = async (SelectedCase) => {
    setSelectedUseCase(SelectedCase);
    const inputFormat = SelectedCase.input_format;
    const result = createArrayOfObjects(inputFormat);
    setInputKeysList(result); // for field list dynamic
    let inputKeys = inputFormat.split(', ').map((item) => item.split('(')[0]);

    const formData = Object.assign({}, formName);
    const fieldList = [];
    for (let i = 0; i < inputKeys.length; i++) {
      const keys = inputKeys[i];

      formData[keys] = SelectedCase[keys] || '';

      if (
        typeof SelectedCase[keys] !== 'undefined' &&
        SelectedCase[keys] != null
      ) {
        fieldList.push(keys);
      }
      setInputFieldList(fieldList);
    }
    setFormName(formData);
  };

  useEffect(() => {
    const pagination = {
      pageSize: 20,
      page: 0
    };
    const where = null;
    const sort = null;
    dispatch(
      fetchRecords({
        formName: 'ml_configs',
        data: {
          pagination,
          where,
          sort
        }
      })
    );
  }, []);

  const handleSelectCatagory = (e) => {
    const clearedFormName = Object.keys(formName).reduce((acc, key) => {
      acc[key] = '';
      return acc;
    }, {});
    setFormName(clearedFormName);
    setRows([]);
    setPayloadData('');
    const SelectedCase = e.target.value;
    fetchUrlData(SelectedCase);
  };

  const handleSubmitInput = async () => {
    const payloadData = createPayloadMap(selectedUseCase);
    const headerData = createHeaderMap(selectedUseCase);

    const result = await dispatch(
      fetchAiRquest({
        url: selectedUseCase.api_endpoint,
        header: headerData,
        payload: JSON.stringify(payloadData)
      })
    );
    let resultOfApi = result?.payload;
    let outPutFormat = createArrayOfObjects(selectedUseCase.output_format);
    const outputFormatObj = Object.assign({}, ...outPutFormat);
    for (let key in outputFormatObj) {
      outputFormatObj[key] = resultOfApi[key] ? resultOfApi[key] : '';
    }

    setOutputFormatKeysArr(outputFormatObj);
    setPayloadData(result?.payload);
    const data = result?.payload?.articles;
    let outPutType = selectedUseCase.output_type.split('(');
    if (outPutType.includes('array') && data.length > 0) {
      const keysData = Object.keys(data[0]);

      const desiredColumnOrder = [keysData[1], keysData[0], keysData[2]];
      const headers = desiredColumnOrder.map((key) => {
        return {
          headerName: key
            .replace(/_/g, ' ')
            .replace(/\b\w/g, (c) => c.toUpperCase()),
          field: key,
          flex: 1
        };
      });
      const modified = data?.map((o) => {
        return {
          ...o,
          id: o.article_id
        };
      });
      setRows(modified);
      setColumns(headers);
    }
  };
  console.log(inputKeysList);
  return (
    <div>
      <div className="wrapper-ai">
        <div className="catgory-ai">
          <FormControl fullWidth>
            <FormLabel
              sx={{
                fontSize: '15px',
                paddingBottom: '5px'
              }}
            >
              Select Task
            </FormLabel>
            <Select
              style={{ height: '40px', width: '500px' }}
              onChange={(e) => handleSelectCatagory(e)}
              labelId="demo-simple-select-label"
              placeholder="Select Task"
              // value={e.target.value}
            >
              {allUsecases &&
                allUsecases.map((o, index) => [
                  <MenuItem key={index} value={o}>
                    {o.config_name}
                  </MenuItem>
                ])}
            </Select>
          </FormControl>
        </div>
        <div className="input-ai my-2 flex flex-col">
          {inputKeysList &&
            inputKeysList.map((obj, index) => {
              const key = Object.keys(obj)[0];
              const fieldLabel = !inputFieldList.includes(key) && key;
              const datatype = fieldLabel && obj[fieldLabel];
              switch (datatype) {
                case 'string':
                  return (
                    <>
                      <FormLabel
                        sx={{
                          fontSize: '15px',
                          paddingBottom: '5px'
                        }}
                      >
                        {fieldLabel}
                      </FormLabel>
                      <TextArea
                        minRows={4}
                        maxRows={4}
                        name={key}
                        key={index}
                        value={formName[key]}
                        onChange={(e) => handleChangeInput(e)}
                        variant="outlined"
                        multiline
                        placeholder="Input"
                        fieldstyle={{
                          minWidth: '200px',
                          width: '500px'
                        }}
                      />
                    </>
                  );
                case 'int':
                  return (
                    <>
                      <FormLabel
                        sx={{
                          marginTop: '10px',
                          fontSize: '15px',
                          paddingBottom: '5px'
                        }}
                      >
                        {key}
                      </FormLabel>
                      <TextField
                        sx={{
                          width: '500px',
                          '& .MuiInputBase-root': {
                            fontSize: '15px',
                            height: '40px'
                          }
                        }}
                        name={key}
                        placeholder="Input number"
                        onChange={(e) => handleChangeInput(e)}
                        type="number"
                        variant="outlined"
                        value={formName[key]}
                      />
                    </>
                  );
                default:
                  return null;
              }
            })}
          <Button onClick={handleSubmitInput}>Submit</Button>
          {/* </div> */}
        </div>
        <div className="input-ai mt-2" style={{ width: '70%' }}>
          {rows && rows.length > 0 ? (
            <DataGrid
              rows={rows}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 5 }
                }
              }}
              pageSizeOptions={[5, 10]}
              sx={{
                // width: '100%',
                '& .MuiDataGrid-columnHeader': {
                  fontSize: '14px',
                  backgroundColor: '#e3f0ffb4',
                  color: COLORS.SECONDARY
                },
                '& .MuiDataGrid-cell': {
                  color: COLORS.SECONDARY
                },
                '& .MuiDataGrid-sortIcon': {
                  opacity: 1,
                  color: COLORS.SECONDARY
                },
                '& .MuiDataGrid-menuIconButton': {
                  opacity: 1,
                  color: COLORS.SECONDARY
                },

                borderRadius: 3,
                border: 'none'
              }}
            />
          ) : (
            <>
              {payloadData &&
                outputFormatKeysArr &&
                Object.entries(outputFormatKeysArr).map(([key, value]) => (
                  <>
                    <div className="flex flex-col">
                      <FormLabel
                        sx={{
                          fontSize: '15px',
                          paddingBottom: '5px'
                        }}
                      >
                        {key}
                      </FormLabel>
                      <TextField
                        readonly
                        sx={{
                          width: '50%',
                          '& .MuiInputBase-root': {
                            fontSize: '15px',
                            height: '40px'
                          }
                        }}
                        variant="outlined"
                        value={value}
                      />
                    </div>
                  </>
                ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
