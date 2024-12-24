// import { useEffect, useState } from "react";

// import { Trash2 } from 'lucide-react';
// import { Edit } from 'lucide-react';
// import { Eye } from 'lucide-react';
// import { MoreVertical } from 'lucide-react';
// import { Divider, Stack, Tooltip, Typography } from "@mui/joy";
// import { CheckCircle } from 'lucide-react';
// import Box from "@mui/joy/Box";
// import Card from "@mui/joy/Card";
// import CardActions from "@mui/joy/CardActions";
// import CardContent from "@mui/joy/CardContent";
// import Dropdown from "@mui/joy/Dropdown";
// import IconButton from "@mui/joy/IconButton";
// import ListItemDecorator from "@mui/joy/ListItemDecorator";
// import Menu from "@mui/joy/Menu";
// import MenuButton from "@mui/joy/MenuButton";
// import MenuItem from "@mui/joy/MenuItem";

// import { colors, COLORS } from "../../common/constants/styles";
// import { Avatar, Button, Chip, Grid, Pagination } from "@mui/material";
// import { useLocation, useNavigate } from "react-router-dom";
// import { useSelector } from "react-redux";
// import { ChevronDown } from 'lucide-react';
// import { Store } from 'lucide-react';

// import {
//   IconUserCircle,
//   IconUserScan,
//   IconUserSquare,
// } from "@tabler/icons-react";

// const ExportGridView = ({
//   type,
//   items,
//   goToPanel,
//   flag,
//   setSelectedCard,
//   selectedCard,
//   modalActionHandler,
//   goToFields,
//   onCreateNew,
// }) => {
//   // const navigate = useNavigate();
//   const location = useLocation();
//   const pathname = location.pathname;
//   const { currentTheme } = useSelector((state) => state.auth);
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [search, setSearch] = useState("");
//   const [filteredItems, setFilteredItems] = useState(items);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [rowsPerPage, setRowsPerPage] = useState(10);

//   const handleRowsPerPageChange = (rows) => {
//     setRowsPerPage(rows);
//     setCurrentPage(1); // Reset to the first page
//     handleClose();
//   };
//   const handleClick = (event) => {
//     setAnchorEl(event.currentTarget);
//   };
//   const handleClose = () => {
//     setAnchorEl(null);
//   };
//   const paginatedItems = filteredItems.slice(
//     (currentPage - 1) * rowsPerPage,
//     currentPage * rowsPerPage
//   );
//   const handleChangePage = (event, newPage) => {
//     setCurrentPage(newPage);
//   };
//   const color = ["#2196F3", "#673AB7", "#00C853", "#FFC107", "#F44336"];

//   function assignColorById(id) {
//     const colorIndex = id % color.length;
//     const assignedColor = color[colorIndex];

//     return assignedColor;
//   }
//   const handleCardSelect = (itemId) => {
//     setSelectedCard((prevSelectedCards) => {
//       if (prevSelectedCards.includes(itemId)) {
//         return prevSelectedCards.filter((id) => id !== itemId);
//       } else {
//         return [...prevSelectedCards, itemId];
//       }
//     });
//   };
//   console.log(items);

//   return (
//     <>
//       <Grid container className="flex  flex-col   mt-3">
//         <Grid className={`flex flex-row flex-wrap`}>
//           {items.map((filteredItem, index) => (
//             <Card
//               key={filteredItem.catalogFlowInfoId}
//               variant="outlined"
//               color=""
//               sx={{
//                 gap: "0",
//                 width: 280,
//                 height: 120,
//                 backgroundColor:
//                   currentTheme === "Dark" ? colors.darkTab : colors.white,
//                 boxShadow: "0 10px 50px 0 rgba(0, 0, 0, 0.04)",
//                 margin: "8px",
//                 cursor: "pointer",
//               }}
//               onClick={() => handleCardSelect(filteredItem.uuid)}
//             >
//               {selectedCard.includes(filteredItem.uuid) && (
//                 <CheckCircleIcon
//                   sx={{
//                     position: "absolute",
//                     top: 8,
//                     right: 8,
//                     color: colors.primary.main,
//                   }}
//                 />
//               )}
//               <Box
//                 direction="row"
//                 display="flex"
//                 justifyContent="space-between"
//                 alignItems="center"
//               >
//                 <Stack
//                   direction="row"
//                   justifyContent="center"
//                   display="flex"
//                   alignItems="center"
//                 >
//                   <Avatar
//                     variant="rounded"
//                     src={`${process.env.REACT_APP_STORAGE_URL}/${filteredItem.logo}`}
//                     sx={{
//                       backgroundColor: colors.warning.light,
//                       color: colors.warning.dark,
//                     }}
//                   >
//                     <StorefrontTwoToneIcon fontSize="inherit" />
//                   </Avatar>
//                   <div className="flex  flex-col  mx-2">
//                     <Typography
//                       level="title-lg"
//                       sx={{
//                         // color: COLORS.SECONDARY,
//                         fontSize: "1rem",
//                         color:
//                           currentTheme === "Dark"
//                             ? colors.white
//                             : colors.grey[900],
//                         fontWeight: 600,
//                       }}
//                     >
//                       {filteredItem.id}
//                     </Typography>
//                     <span
//                       onClick={() => goToPanel(filteredItem)}
//                       level="title-lg"
//                       style={{
//                         // color: COLORS.GRAY,
//                         overflow: "hidden",
//                         display: "-webkit-box",
//                         WebkitBoxOrient: "vertical",
//                         WebkitLineClamp: 2,
//                         textOverflow: "ellipsis",
//                         height: "1.9em",
//                         // fontSize: '14px',
//                         lineHeight: "1.7em",
//                         fontSize: "0.75rem",
//                         fontWeight: 400,
//                         color:
//                           currentTheme === "Dark"
//                             ? colors.grey[100]
//                             : colors.grey[900],
//                       }}
//                     >
//                       {flag === "catalogFlow"
//                         ? filteredItem.catalog
//                         : filteredItem.name}
//                     </span>
//                     <span
//                       onClick={() => goToPanel(filteredItem)}
//                       level="title-lg"
//                       style={{
//                         // color: COLORS.GRAY,
//                         overflow: "hidden",
//                         display: "-webkit-box",
//                         WebkitBoxOrient: "vertical",
//                         WebkitLineClamp: 2,
//                         textOverflow: "ellipsis",
//                         height: "1.9em",
//                         // fontSize: '14px',
//                         lineHeight: "1.7em",
//                         fontSize: "0.75rem",
//                         fontWeight: 400,
//                         color:
//                           currentTheme === "Dark"
//                             ? colors.grey[100]
//                             : colors.grey[900],
//                       }}
//                     >
//                       {flag === "catalogFlow"
//                         ? filteredItem.sub_category
//                         : null}
//                     </span>
//                   </div>
//                 </Stack>
//               </Box>

//               <span
//                 className={`status-btn ${
//                   filteredItem.status === "New"
//                     ? `status-new`
//                     : filteredItem.status === "Assigned"
//                     ? `status-Assigned`
//                     : filteredItem.status === "In Progress"
//                     ? `status-InProgress`
//                     : filteredItem.status === "Completed"
//                     ? `status-Completed`
//                     : null
//                 } `}
//                 style={{
//                   color:
//                     currentTheme === "Dark"
//                       ? colors.grey[100]
//                       : colors.grey[900],
//                   fontSize: "0.75rem",
//                 }}
//               >
//                 {filteredItem.status}
//               </span>
//             </Card>
//           ))}
//         </Grid>
//       </Grid>
//       <Grid item xs={12}>
//         <Grid container justifyContent="space-between" spacing={3}>
//           <Grid item>
//             <Pagination
//               count={Math.ceil(filteredItems.length / rowsPerPage)}
//               page={currentPage}
//               onChange={handleChangePage}
//               color="primary"
//             />
//           </Grid>
//           <Grid item>
//             <Button
//               variant="text"
//               size="large"
//               sx={{ color: colors.grey[900] }}
//               color="inherit"
//               endIcon={<ExpandMoreRoundedIcon />}
//               onClick={handleClick}
//             >
//               {rowsPerPage} Rows
//             </Button>
//             {anchorEl && (
//               <Menu
//                 id="menu-user-card-style1"
//                 anchorEl={anchorEl}
//                 keepMounted
//                 open={Boolean(anchorEl)}
//                 onClose={handleClose}
//                 variant="selectedMenu"
//                 anchorOrigin={{
//                   vertical: "top",
//                   horizontal: "right",
//                 }}
//                 transformOrigin={{
//                   vertical: "bottom",
//                   horizontal: "right",
//                 }}
//               >
//                 <MenuItem onClick={() => handleRowsPerPageChange(10)}>
//                   10 Rows
//                 </MenuItem>
//                 <MenuItem onClick={() => handleRowsPerPageChange(20)}>
//                   20 Rows
//                 </MenuItem>
//                 <MenuItem onClick={() => handleRowsPerPageChange(30)}>
//                   30 Rows
//                 </MenuItem>
//               </Menu>
//             )}
//           </Grid>
//         </Grid>
//       </Grid>
//     </>
//   );
// };
// export default ExportGridView;
