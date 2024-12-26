// import React, { useEffect, useState } from "react";
// import { useTheme } from "@mui/material/styles";
// import {
//   Chip,
//   Grid,
//   IconButton,
//   Stack,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Tooltip,
//   Typography,
// } from "@mui/material";

// import { Trash2 } from 'lucide-react';
// import { Edit,Edit2 } from 'lucide-react';
// import { CheckCircle } from 'lucide-react';
// import { ArrowUpRight } from 'lucide-react';
// import { CreditCard } from 'lucide-react';
// // import Avatar from "../../elements/Avatars";
// import { COLORS, colors } from "../../../common/constants/styles";
// import { MODAL } from "../../../common/utils/modal-toggle";
// import { useNavigate } from "react-router-dom";
// import { useSelector } from "react-redux";
// import { buildChart, buildFieldMapById, buildList } from "../ChartJson";
// import { fetchConfigDetail } from "../../../services/chart";
// // import { buildChart, buildFieldMapById, buildList } from './ChartJson';

// const ListTable = ({ headers, rows, onChartClick, type }) => {
//   const [openModal, setOpenModal] = useState(false);
//   const [modalContent, setModalContent] = useState(null);
//   const [openDataTablePreview, setOpenDataTablePreview] = useState(false);
//   const [openDataListPreview, setOpenDataListPreview] = useState(false);
//   const [openCardPreview, setOpenCardPreview] = useState(false);
//   const [selectedItemData, setSelectedItemData] = useState(null);
//   const [selectedListData, setSelectedListData] = useState();
//   const [selectedFieldName, setSelectedFieldName] = useState(null);
//   const [displayChartType, setDisplayChartType] = useState();
//   const theme = useTheme();
//   const { currentTheme } = useSelector((state) => state.auth);
//   const [sortedRows, setSortedRows] = useState([]);

//   useEffect(() => {
//     if (rows) {
//       const sorted = [...rows].sort((a, b) => a.name.localeCompare(b.name));
//       setSortedRows(sorted);
//     }
//   }, [rows]);

//   const color = ["#2196F3", "#673AB7", "#00C853", "#FFC107", "#F44336"];

//   const previewHandler = async (item) => {
//     const result = await fetchConfigDetail(item?.dashboardItemInfoId);
//     if (result && result["type"]) {
//       if (result["type"].toLowerCase() === "chart") {
//         chartPreviewHandler(result);
//       } else if (result["type"].toLowerCase() === "list") {
//         listPreviewHandler(result);
//       } else if (result["type"].toLowerCase() === "table") {
//         tablePreviewHandler(result);
//       } else if (result["type"].toLowerCase() === "card") {
//         cardPreviewHandler(result);
//       }
//     }
//   };
//   const chartPreviewHandler = (item) => {
//     setOpenModal(true);
//     const chartsData = buildChart(item);
//     setDisplayChartType(chartsData?.defaultChartType);
//     setModalContent(chartsData);
//   };
//   const tablePreviewHandler = (item) => {
//     setSelectedItemData(item);

//     setOpenDataTablePreview(true);
//   };
//   const listPreviewHandler = (item) => {
//     let res = buildList(item);
//     setSelectedItemData(res);
//     setOpenDataListPreview(true);
//   };

//   const cardPreviewHandler = (item) => {
//     setSelectedItemData(item);
//     let options = item && item["options"] ? item["options"] : [];
//     let option = options && options.length > 0 ? options[0] : null;
//     if (option) {
//       const fieldMapById = buildFieldMapById(
//         item["fields"] && item["fields"].length > 0 ? item["fields"] : []
//       );
//       let selectedField = fieldMapById[option["fieldInfoId"]];
//       setSelectedFieldName(selectedField?.label);
//       setOpenCardPreview(true);
//     }
//   };

//   const handleCloseModal = () => {
//     setOpenModal(false);
//     setModalContent(null);
//   };

//   const handleCloseDataTablePreview = () => {
//     setOpenDataTablePreview(false);
//   };

//   const handleCloseDataListPreview = () => {
//     setOpenDataListPreview(false);
//   };

//   const handleCloseCardPreview = () => {
//     setOpenCardPreview(false);
//   };
//   return (
//     <TableContainer>
//       <Table>
//         <TableHead>
//           <TableRow>
//             <TableCell>Sr No</TableCell>

//             <TableCell>Name</TableCell>
//             <TableCell align="center" style={{ pr: 3 }}>
//               Type
//             </TableCell>
//             <TableCell align="center" style={{ pr: 3 }}>
//               Form
//             </TableCell>
//             <TableCell align="center" style={{ pr: 3 }}>
//               Actions
//             </TableCell>
//           </TableRow>
//         </TableHead>
//         <TableBody>
//           {sortedRows &&
//             sortedRows.map((row, index) => (
//               <TableRow
//                 hover
//                 key={index}
//                 // onClick={() => onRowClick(row)}
//                 style={{
//                   cursor: "pointer",
//                 }}
//               >
//                 <TableCell
//                   style={{
//                     fontWeight: "bold",
//                   }}
//                 >
//                   {index + 1}
//                 </TableCell>

//                 <TableCell>{row?.name ? row?.name : "Ticket"}</TableCell>
//                 <TableCell>
//                   {row?.options[0]?.defaultChartType}&nbsp;{row?.type}
//                 </TableCell>
//                 <TableCell>{row.formDisplayName}</TableCell>
//                 <TableCell>
//                   <Stack spacing={1} direction="row">
//                     <Tooltip title="Edit">
//                       <IconButton
//                         slots={{ root: IconButton }}
//                         slotProps={{
//                           root: {
//                             variant: "plain",
//                             color: "primary",
//                             size: "small",
//                           },
//                         }}
//                       >
//                         <Edit2 //                           style={{
//                             color: COLORS.PRIMARY,
//                           }}
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             previewHandler(row);
//                             // onChartClick(MODAL.edit, item.id);
//                           }}
//                         />
//                       </IconButton>
//                     </Tooltip>
//                     <Tooltip title="Delete">
//                       <IconButton
//                         slots={{ root: IconButton }}
//                         slotProps={{
//                           root: {
//                             variant: "plain",
//                             color: "danger",
//                             size: "small",
//                           },
//                         }}
//                       >
//                         <Trash2 //                           style={{ color: "danger" }}
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             onChartClick(MODAL.delete, row.id);
//                           }}
//                         />
//                       </IconButton>
//                     </Tooltip>
//                   </Stack>
//                 </TableCell>
//               </TableRow>
//             ))}
//         </TableBody>
//       </Table>
//     </TableContainer>
//   );
// };

// export default ListTable;
