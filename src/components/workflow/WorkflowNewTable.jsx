// import React, { useEffect, useState } from 'react';
// import { useSelector } from 'react-redux';
// import { useDispatch } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import GridTable from '../../elements/GridTable';
// import { fetchFieldsByFormId } from '../../services/field';
// import { fetchFieldPreference } from '../../services/fieldPreference';
// import { fetchFormByName } from '../../services/form';
// import { fetchWorkFlows } from '../../redux/slices/workflowSlice';

// const WorkflowNewTable = ({ workFlows,setSelectedRows }) => {
//   const [tableData, setTableData] = useState({});
//   const [currentPage, setCurrentPage] = useState(1);
//   const [rowsPerPage, setRowsPerPage] = useState(20);
//   const [totalRecords, setTotalRecords] = useState(0);
//   const [refetch, setRefetch] = useState(false);
//   const [fieldLabels, setFieldLabels] = useState({});
//   const [where, setWhere] = useState([]);
//   const [fieldsData, setFieldsData] = useState([]);
//   const [formdetail, setFormdetail] = useState();
//   const [preferences, setPrefrences] = useState([]);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { currentTheme } = useSelector((state) => state.auth);
//   const { currentUser } = useSelector((state) => state.auth);


//   const { currentForm } = useSelector((state) => state.current);


//   useEffect(() => {
//     if (workFlows) {
//       const obj = {
//         totalRecords: workFlows.length,
//         data: workFlows
//       };
//       setTableData(obj);
//       setTotalRecords(workFlows.length);
//     }
//   }, [workFlows]);

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

//       fetchFieldPreference(formdetail?.formInfoId).then((res) => {
//         setPrefrences(res?.result);
//       });
//     }
//   }, [formdetail?.formInfoId]);

//   const handledRowClick = (selected) => {
//     localStorage.setItem('xmlDataBPMN', selected?.data.bpmn_str);
//     navigate(`/workflow/${selected?.data.uuid}`);
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
//         setWhere={setWhere}
//       />
//     </>
//   );
// };
// export default WorkflowNewTable;
