// import React, { useEffect, useState } from 'react';
// import { useSelector } from 'react-redux';
// import { useDispatch } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import GridTable from '../../elements/GridTable';
// import {
//   fetchFieldObjectByFormId,
//   fetchFieldsByFormId
// } from '../../services/field';
// import {
//   createFieldPreference,
//   fetchFieldPreference
// } from '../../services/fieldPreference';
// import { fetchFormByName } from '../../services/form';
// import { notify } from '../../hooks/toastUtils';

// const WorkflowNewTable = ({
//   setSelectedRows,
//   setCurrentPage,
//   setRefetch,
//   currentPage,
//   totalRecords,
//   rowsPerPage,
//   refetch,
//   tableData,
//   setRowsPerPage
// }) => {
//   const [fieldLabels, setFieldLabels] = useState({});
//   const [fieldsData, setFieldsData] = useState([]);
//   const [formdetail, setFormdetail] = useState();
//   const [preferences, setPrefrences] = useState([]);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const { currentForm } = useSelector((state) => state.current);

//   const FormName = 'system_workflow';
//   const FetchWorkFlowID = () => {
//     fetchFormByName(FormName).then((res) => {
//       setFormdetail(res?.result);
//     });
//   };

//   useEffect(() => {
//     FetchWorkFlowID();
//     if (formdetail) {
//       fetchFieldsByFormId(formdetail?.formInfoId).then((res) => {
//         setFieldsData(res?.result);
//       });
//       fetchFieldObjectByFormId(formdetail?.formInfoId).then((fieldObj) =>
//         setFieldLabels(fieldObj)
//       );
//       fetchFieldPreference(formdetail?.formInfoId).then((res) => {
//         setPrefrences(res?.result);
//       });
//     }
//   }, [formdetail?.formInfoId, refetch]);

//   const handledRowClick = (selected) => {
//     localStorage.setItem('xmlDataBPMN', selected?.data.bpmn_str);
//     navigate(`/workflow/${selected?.data.uuid}`);
//   };
//   const columnPreferenceHandler = async (formId, data) => {
//     const fieldPreference = createFieldPreference(formId, {
//       fieldNames: data
//     });

//     await fieldPreference;
//     fieldPreference.then((data) => {
//       if (data.statusCode === 200) {
//         notify.success('Column Preference successful');
//         setRefetch((prev) => !prev);
//       } else {
//         notify.error('Column Preference failed');
//       }
//     });
//     dispatch(fetchFieldPreference({ formInfoId: currentForm.formInfoId }));
//     setRefetch(true);
//   };
//   const handleRowsPerPageChange = (rows) => {
//     setRowsPerPage(rows);
//     setCurrentPage(1);
//     setRefetch((prev) => !prev);
//     // handleClose();
//   };
//   return (
//     <>
//       <GridTable
//         currentPage={currentPage}
//         setCurrentPage={setCurrentPage}
//         rowsPerPage={rowsPerPage}
//         setRowsPerPage={setRowsPerPage}
//         totalRecords={totalRecords}
//         fields={fieldsData}
//         preferences={preferences}
//         handledRowClick={handledRowClick}
//         setSelectedRows={setSelectedRows}
//         currentForm={currentForm ? currentForm : formdetail}
//         setRefetch={setRefetch}
//         fieldLabels={fieldLabels}
//         tableData={tableData}
//         handleRowsPerPageChange={handleRowsPerPageChange}
//         columnPreferenceHandler={columnPreferenceHandler}
//         usedElements={['table', 'pagination', 'columnPreference']}
//       />
//     </>
//   );
// };
// export default WorkflowNewTable;
