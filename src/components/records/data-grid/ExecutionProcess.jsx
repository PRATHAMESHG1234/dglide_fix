import React, { useEffect, useState } from 'react';
import Dialog from '../../shared/Dialog';
import { useSelector } from 'react-redux';
import {
  fetchRecordbyFormName,
  fetchRecordById
} from '../../../services/table';
import BpmnModeler from 'bpmn-js/lib/Modeler';
import customRendererModule from './customRenderer';
import './ActionList.css';
import {
  Box,
  DialogContent,
  Divider,
  IconButton,
  Tooltip,
  alpha
} from '@mui/material';
import DialogModal from '@mui/material/Dialog';
import { colors, COLORS } from '../../../common/constants/styles';
import { X } from 'lucide-react';

export const ExecutionProcess = ({ onCancel, actionModal }) => {
  const { tableRecord } = useSelector((state) => state.table);
  const [modeler, setModeler] = useState();
  const [executionJson, setExecutionJson] = useState();
  const [elemntMsg, setElemntMsg] = useState([]);
  const [executionPanel, setExecutionPanel] = useState(false);
  // const [multipleMassage, setMultipleMassage] = useState(false);
  const { currentTheme } = useSelector((state) => state.auth);
  const HIGH_PRIORITY = 1500;

  useEffect(() => {
    getRecordbyFormNameByFilter();
  }, []);

  const fetchRecordDataById = async (id) => {
    const response = await fetchRecordById('system_user', id);
    if (response) {
      return response.user_name;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      let approvalArray = [];
      await getRecordbyFormNameByFilter();
      if (tableRecord) {
        localStorage.setItem('executionData', tableRecord?.execution_progress);
        setExecutionJson(JSON.parse(tableRecord?.execution_progress));
      }
    };
    fetchData();
  }, [tableRecord]);

  async function initDiagram(xml) {
    const container = document.getElementById('container');
    if (!modeler) {
      const bpmnModeler = new BpmnModeler({
        container,
        additionalModules: [customRendererModule],
        keyboard: {
          bindTo: document
        }
      });
      await bpmnModeler
        .importXML(xml)
        .then(() => {
          setModeler(bpmnModeler);
          const canvas = bpmnModeler.get('canvas');
          canvas.zoom('fit-viewport');

          let element;
          const definitions = bpmnModeler.getDefinitions();
          bpmnModeler.on('element.click', HIGH_PRIORITY, async (event) => {
            event.originalEvent.preventDefault();
            event.originalEvent.stopPropagation();

            ({ element } = event);
            const elem = element;
            // setElement(elem);
            // setElementId(elem.id);
            let {
              $attrs: { variables, type, elementData }
            } = elem.businessObject;
            let executionObj = JSON.parse(tableRecord?.execution_progress);
            // console.log("executionObj", executionObj);
            // console.log("elem", elem);
            let approvalArray = [];
            for (const [key, value] of Object.entries(executionObj)) {
              if (
                key.split('-')[0] === 'APP' &&
                elem.businessObject.id === key
              ) {
                setExecutionPanel(true);

                const approvals = await Promise.all(
                  value?.approvals.map(async (o) => {
                    const userId = o.user;
                    const userData = await fetchRecordDataById(userId);
                    return { user: userData, message: o.status };
                  })
                );
                approvalArray = approvalArray.concat(approvals);
              } else if (elem.businessObject.id === key) {
                setExecutionPanel(true);
                let resultObj = {
                  user: value.result,
                  message: value.message
                };
                approvalArray.push(resultObj);
              }
              setElemntMsg(approvalArray);
            }
          });
        })
        .catch((err) => console.log(err));
    }
  }

  const getRecordbyFormNameByFilter = async () => {
    const result = await fetchRecordbyFormName('system_workflow', {
      sort: null,
      where: [
        {
          fieldInfoId: 0,
          fieldName: 'catalog_id',
          operator: '=',
          value: tableRecord?.catalog_id
        }
      ]
    });
    if (result?.result.length > 0) {
      let xmlString = result?.result[0].bpmn_str;
      xmlString = xmlString.split('\n').join('');
      xmlString = xmlString.split('\t').join('');

      initDiagram(xmlString);
    }
  };
  // console.log("elemntMsg", elemntMsg);
  return (
    <>
      <div className="modal-container">
        <Dialog
          footerNone="footerNone"
          Header={{
            open: actionModal,
            close: onCancel,
            maxWidth: 'sm',

            dialogTitle: 'Execution Process'
          }}
          Footer={{
            clear: onCancel,
            cancelBtnLabel: 'Cancel',
            saveBtnLabel: 'Submit'
          }}
        >
          <div
            id="container"
            className="executionProcess"
            style={{ width: '100%', height: '600px' }}
          ></div>
        </Dialog>
      </div>
      <DialogModal
        open={executionPanel}
        fullWidth
        style={{ width: '100%', padding: '40px 0' }}
        PaperProps={{ sx: { borderRadius: '15px' } }}
      >
        <span
          style={{
            backgroundColor:
              currentTheme === 'Light'
                ? colors.secondary.light
                : colors.darkBackground
          }}
        >
          {/* <DialogTitle
          id="customized-dialog-title"
          style={{
            color: colors.secondary.main,
            fontWeight: '500',
            fontSize: '16px',
            cursor: 'default'
          }}
        >
          {Header.dialogTitle}
        </DialogTitle> */}
          <Box
            style={{
              position: 'absolute',
              right: 50,
              top: 8
            }}
          ></Box>
          <Tooltip title="Close" placement="bottom">
            <IconButton
              aria-label="close"
              onClick={() => setExecutionPanel(false)}
              style={{
                position: 'absolute',
                right: 8,
                top: 8,
                color:
                  currentTheme === 'Light'
                    ? alpha(COLORS.SECONDARY, 0.7)
                    : COLORS.WHITESMOKE
              }}
            >
              <X />
            </IconButton>
          </Tooltip>
        </span>

        <Divider color={COLORS.GRAYSCALE} />
        <DialogContent
          style={{
            backgroundColor:
              currentTheme === 'Light' ? COLORS.WHITE : colors.darkLevel2
          }}
        >
          {elemntMsg.map((o) => (
            <>
              <div className="">
                <span id="resultMessageModal">{o?.user} </span>
                {' - '}
                <span id="resultMessageModal">{o?.message}</span>
              </div>
            </>
          ))}
        </DialogContent>
      </DialogModal>
    </>
  );
};
