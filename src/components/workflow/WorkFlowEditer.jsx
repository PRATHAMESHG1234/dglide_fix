import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchWorkFlow } from '../../redux/slices/workflowSlice';
import BpmnNew from './BPMN/Bpmn';

const WorkFlowEditer = () => {
  const dispatch = useDispatch();
  const { workFlowId } = useParams();
  useEffect(() => {
    if (
      workFlowId !== 'undefined' ||
      workFlowId !== 'null' ||
      workFlowId !== undefined ||
      workFlowId !== null
    ) {
      dispatch(fetchWorkFlow({ workFlowId }));
    }
  }, [workFlowId]);

  return <BpmnNew />;
};

export default WorkFlowEditer;
