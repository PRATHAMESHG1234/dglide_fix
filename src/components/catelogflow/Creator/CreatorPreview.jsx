import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import SplitPane, { Pane } from 'split-pane-react';

import { ArrowLeft } from 'lucide-react';
import {
  Box,
  CircularProgress,
  IconButton,
  Tooltip,
  Typography
} from '@mui/material';
import 'split-pane-react/esm/themes/default.css';

import { COLORS } from '../../../common/constants/styles';
import { Button } from '@/componentss/ui/button';
import { updateCatelogRequest } from '../../../redux/slices/catalogFlowSlice';
import { resetTableStore } from '../../../redux/slices/tableSlice';
import {
  fetchCatalogFlow,
  fetchFieldLookupValues
} from '../../../services/catalogFlow';
// import AddEditPreview from './AddEditPreview';
import { Paperclip } from 'lucide-react';
import { catalogType } from '../../../common/utils/fields';
import Questionnaire from './Questionnaire';
import { generateChild } from '../../../common/utils/helpers';

const CreatorPreview = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;
  // let previewData = location?.state?.data;
  let { catalogFlowInfoId } = useParams();
  const dispatch = useDispatch();
  // const searchParam = new URLSearchParams(window.location.search);
  // console.log(searchParam);
  const { isLoading } = useSelector((state) => state.field);
  const [catagoryType, setCatagoryType] = useState('');
  const { currentUser } = useSelector((state) => state.auth);
  const [fieldList, setFieldList] = useState([]);
  const [sizes, setSizes] = useState([100, '6%', 'auto']);
  const [attachmentpanel, setAttachmentPanel] = useState(false);
  const [previewData, setPreviewData] = useState({});
  const [recursivList, setRecursivList] = useState([]);
  const [allAttachment, setAllAttachment] = useState([]);
  const [behalfUserData, setBehalfUserData] = useState('');

  useEffect(() => {
    if (catalogFlowInfoId) {
      fetchCatalogFlow(catalogFlowInfoId).then((data) => {
        setPreviewData(data?.result);
        // const catalogTypeObj = catalogType.filter(
        //   (o) => o.value === data?.result?.categoryType
        // );
        setCatagoryType(data?.result?.type_display);

        let previewFieldList = JSON.parse(data?.result?.json_str).fields;

        dispatch(resetTableStore());
        fetchFieldLookupValues(previewFieldList, null).then((result) => {
          setFieldList(result);
          let copyOfField = JSON.parse(JSON.stringify(result));
          const recursiveData = generateChild(copyOfField);
          setRecursivList(recursiveData);
        });
      });
    }
  }, [catalogFlowInfoId]);

  // useEffect(() => {
  //   const id = searchParam.get('id');
  //   console.log(id);
  //   dispatch(setSelectedRecordId({ recordId: id }));
  // }, [searchParam]);

  const submitHandler = (values) => {
    const previewObj = {
      catalog_id: previewData?.uuid,
      catalog: previewData?.catalog,
      customer: behalfUserData ? behalfUserData : currentUser?.userUUID,
      details: values ? JSON.stringify(values) : null,
      files: [...allAttachment],
      status: '1'
    };
    dispatch(updateCatelogRequest(previewObj));
    navigate(-1);
  };
  return (
    <>
      <div className="mb-3 flex justify-between">
        <div className="flex items-center px-1">
          <ArrowLeft onClick={() => navigate(-1)}
            style={{ marginRight: '7px', color: 'grey' }}
          />
          <Typography
            sx={{
              fontSize: '18px',
              color: COLORS.PRIMARY
            }}
            fontWeight="bold"
          >
            {/* {previewData?.catalog.charAt(0).toUpperCase() +
              previewData?.catalog.slice(1)} */}
          </Typography>
        </div>
        {pathname.includes('/portal') && catagoryType === 'Request' ? (
          <div className="flex items-center gap-2">
            <Tooltip title="Attachments">
              <IconButton
                onClick={() => setAttachmentPanel(!attachmentpanel)}
                sx={{
                  height: '30px',
                  width: '30px',
                  color: COLORS.PRIMARY,
                  border: '1px solid #1976d1'
                }}
              >
                <Paperclip sx={{ transform: 'rotate(135deg)', color: 'inherit' }}
                />
              </IconButton>
            </Tooltip>
            <Button
              tooltipTitle="Submit Request"
              form="normal"
              type="submit"
              sx={{
                backgroundColor: COLORS.PRIMARY
              }}
            >
              Submit
            </Button>
          </div>
        ) : null}
      </div>
      <div
        style={{
          height: 'calc(100vh - 160px)',
          backgroundColor: COLORS.WHITE,
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <div
          style={{
            margin: '0 15px',
            height: 'calc(100vh - 190px)',
            backgroundColor: COLORS.TERTIARY,
            borderRadius: '5px',
            flexGrow: 1
          }}
        >
          {isLoading ? (
            <CircularProgress color="secondary" />
          ) : (
            <SplitPane split="vertical" sizes={sizes} onChange={setSizes}>
              <Pane
                minSize={250}
                maxSize="50%"
                style={{
                  overflowY: 'scroll',
                  borderRight: '1px solid lightgrey'
                }}
                className="pb-2"
              >
                <div
                  className="row justify-center"
                  style={{ maxWidth: '800px' }}
                >
                  <Box
                    sx={{
                      minHeight: 'calc(100vh - 263px)'
                    }}
                  >
                    {/* <AddEditPreview
                      formId="normal"
                      setBehalfUserData={setBehalfUserData}
                      recursivData={recursivList || []}
                      fieldData={fieldList || []}
                      recordId={previewData ? previewData?.recordId : null}
                      attachmentpanelFlag={attachmentpanel}
                      catagoryType={catagoryType}
                      onSubmit={submitHandler}
                      setAllAttachment={setAllAttachment}
                      /> */}
                    <div>
                      <Questionnaire
                        formId="normal"
                        fieldList={fieldList}
                        questions={recursivList}
                        onSubmit={submitHandler}
                        recordId={previewData ? previewData?.uuid : null}
                        attachmentpanelFlag={attachmentpanel}
                        setBehalfUserData={setBehalfUserData}
                        catagoryType={catagoryType}
                        setAllAttachment={setAllAttachment}
                      />
                    </div>
                  </Box>
                </div>
              </Pane>
              <div
                style={{
                  height: 'calc(100vh - 190px)'
                }}
              ></div>
            </SplitPane>
          )}
        </div>
      </div>
    </>
  );
};

export default CreatorPreview;
