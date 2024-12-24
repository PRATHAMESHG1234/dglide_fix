/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { useEffect, useReducer, useState } from 'react';
import { MODAL, initialState, reducer } from '../../common/utils/modal-toggle';
import { EditCatalogFlow } from './EditCatlogFlow';
import ConfirmationModal from '../shared/ConfirmationModal';
import CatalogflowList from './CatalogflowList';
import {
  createCatalogFlow,
  deleteCatalogFlow,
  fetchCatalogFlows,
  updateCatalogFlow
} from '../../redux/slices/catalogFlowSlice';
import { useLocation } from 'react-router-dom';
import { getOptions } from '../../services/workFlow';

const CatalogFlow = () => {
  const location = useLocation();
  const pathname = location.pathname;
  const dispatch = useDispatch();
  const { catalogFlows } = useSelector((state) => state.catalogFlow);
  const [selectedId, setSelectedId] = useState();
  const [state, emit] = useReducer(reducer, initialState);
  const { currentView } = useSelector((state) => state.current);
  const [statusList, setStatusList] = useState([]);

  useEffect(() => {
    dispatch(fetchCatalogFlows());
    getWorkFlowStatus();
  }, []);

  const getWorkFlowStatus = async () => {
    const StatusData = await getOptions('system_workflow', 'status');
    setStatusList(StatusData?.result);
  };

  const deleteWorkflowRecord = () => {
    dispatch(deleteCatalogFlow({ id: selectedId }));
    modalActionHandler(MODAL.cancel);
    setSelectedId();
  };

  const submitCatalogflowRecord = (value) => {
    const ststusValue = statusList.filter((o) => o.label === 'Enabled');
    if (state.type === MODAL.create) {
      const data = {
        catalog_id: value.catalogFlowInfoId,
        category: value.category,
        sub_category: value.subCategory,
        catalog: value.catalog,
        status: ststusValue ? ststusValue[0]?.value : '1',
        visibility: value.visibility,
        logo: value.logo,
        type: value.categoryType,
        chatbot: value.exportToChatbot
      };
      dispatch(createCatalogFlow({ catalogFlow: data }));
    } else if (state.type === MODAL.edit) {
      const data = {
        uuid: state.selected ? state.selected?.uuid : null,
        catalog_id: value.catalogFlowInfoId,
        category: value.category,
        sub_category: value.subCategory,
        catalog: value.catalog,
        json_str: value.jsonStr,
        recursive_json: value.recursiveJson,
        status: value.status,
        visibility: value.visibility,
        logo: value.logo ? value.logo : '',
        type: value.categoryType,
        chatbot: value.exportToChatbot
      };
      dispatch(updateCatalogFlow(data));
    }
    modalActionHandler(MODAL.cancel);
  };

  const modalActionHandler = (type, id = 0) => {
    switch (type) {
      case MODAL.create:
        emit({ type: MODAL.create });
        break;

      case MODAL.edit:
        const data = catalogFlows?.find((c) => c.uuid === id);
        emit({ type: MODAL.edit, data: data });
        setSelectedId(id);
        break;

      case MODAL.delete:
        emit({ type: MODAL.delete, data: id });
        setSelectedId(id);
        break;

      case MODAL.cancel:
        emit({ type: MODAL.cancel });
        break;

      default:
        console.log('modalActionHandler');
    }
  };
  return (
    <>
      {/* {currentView !== 'List' ? (
        <div className="flex">
          <div
            className=" flex-1 "
            style={{ height: '40px', borderBottom: '1px solid lightgrey' }}
          >
            {pathname === '/portal' ? (
              <FormLabel sx={{ fontSize: '18px', fontWeight: 'bold' }}>
                Request
              </FormLabel>
            ) : (
              <FormLabel sx={{ fontSize: '18px', fontWeight: 'bold' }}>
                Catalog Flow
              </FormLabel>
            )}
          </div>
        </div>
      ) : null} */}

      <CatalogflowList
        MyCatalogflow={catalogFlows}
        pathname={pathname}
        modalActionHandler={modalActionHandler}
      />
      {state.show &&
        (state.type === MODAL.create || state.type === MODAL.edit) && (
          <EditCatalogFlow
            state={state}
            onConfirm={submitCatalogflowRecord}
            onCancel={() => modalActionHandler(MODAL.cancel)}
          />
        )}
      {state.show && state.type === MODAL.delete && (
        <ConfirmationModal
          open={state.show}
          heading={`Are you sure you want to delete this Workflow ?`}
          onConfirm={deleteWorkflowRecord}
          onCancel={() => modalActionHandler(MODAL.cancel)}
          firstButtonText="Cancel"
          secondButtonText="Confirm"
        />
      )}
    </>
  );
};
export default CatalogFlow;
