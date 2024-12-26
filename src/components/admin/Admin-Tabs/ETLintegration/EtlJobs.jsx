import { useEffect, useState } from 'react';

import {
  deleteEtlJobs,
  fetchAllJobs,
  fetchEtlJobByPluinId,
  fetchTypeOfIntegration,
  updateJobByJobID
} from '../../../../services/integration';
import { EtlJobCardView } from './EtlJobCardView';
import ConfirmationModal from '../../../shared/ConfirmationModal';

import { useDispatch } from 'react-redux';

import { EtlJobsModal } from './EtlJobsModal';
import { notify } from '../../../../hooks/toastUtils';

export const EtlJobs = ({ open, setOpen, jobClickHandler }) => {
  const dispatch = useDispatch();
  const [etlJobList, setEtlJobList] = useState([]);
  const [refetch, setRefetch] = useState(false);
  const [etlActionObj, setEtlActionObj] = useState({ type: 'create' });

  const [etlTypeList, setEtlTypeList] = useState([]);

  const getAllEtlJobs = async () => {
    try {
      const etlList = await fetchAllJobs();
      setEtlJobList(etlList?.result);
    } catch (error) {
      console.log('error:-', error);
    }
  };

  const getEtlJobType = async () => {
    try {
      const JobType = await fetchTypeOfIntegration('etlJob');
      setEtlTypeList(
        JobType?.result.map((type, index) => ({
          label: type,
          value: index + 1
        }))
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllEtlJobs();
  }, [refetch]);

  useEffect(() => {
    getEtlJobType();
  }, []);
  const handleClose = () => {
    setOpen(false);
    setEtlActionObj({ type: 'create', data: '' });
  };

  const updateJob = async (jobId, newObj) => {
    const response = await updateJobByJobID(jobId, newObj);
    if (response.statusCode === 200) {
      notify.success('Job Updated Successfully .');
      setRefetch((prev) => !prev);
    }
  };

  const handleSwitch = async (checked, data) => {
    const newObj = {
      ...data,
      sourcePluginId: data.sourcePluginId,
      destinationPluginId: data.destinationPluginId,
      sourcePluginEnvId: data.sourcePluginEnvId,
      destinationPluginEnvId: data.destinationPluginEnvId,
      sourceOpId: data?.sourceOpId,
      destinationOpId: data?.destinationOpId,
      isActive: checked
    };
    updateJob(data.jobId, newObj);
  };
  console.log(etlActionObj?.type);
  return (
    <>
      <div className="view_container flex p-2">
        <div
          className="flex w-full flex-row flex-wrap items-start justify-start overflow-auto"
          style={{ overflowY: 'scroll', backgroundColor: '' }}
        >
          <div className="flex flex-col gap-2">
            {etlJobList?.length > 0 &&
              etlJobList?.map((item) => (
                <EtlJobCardView
                  item={item}
                  etlTypeList={etlTypeList}
                  setRefetch={setRefetch}
                  setOpen={setOpen}
                  setEtlActionObj={setEtlActionObj}
                  handleSwitch={handleSwitch}
                  jobClickHandler={(job) => jobClickHandler(job)}
                />
              ))}
          </div>
          {open && etlActionObj?.type && (
            <EtlJobsModal
              setOpen={setOpen}
              open={open}
              etlTypeList={etlTypeList}
              onUpdate={updateJob}
              handleClose={handleClose}
              setRefetch={setRefetch}
              etlActionObj={etlActionObj}
              setEtlActionObj={setEtlActionObj}
              // modalActionHandler={modalActionHandler}
            />
          )}
          {/* {etlActionObj.type === 'delete' && (
            <ConfirmationModal
              open={etlActionObj.type === 'delete'}
              heading={`Are you sure you want to delete this job ?`}
              onConfirm={deleteJob}
              onCancel={() => setEtlActionObj({ type: '' })}
              firstButtonText="Delete"
            />
          )} */}
        </div>
      </div>
    </>
  );
};
