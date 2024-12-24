import { useState } from "react";
import DeleteForever from "@mui/icons-material/DeleteForever";
import Edit from "@mui/icons-material/Edit";
import { Stack, Tooltip } from "@mui/joy";
import IconButton from "@mui/joy/IconButton";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  alpha,
} from "@mui/material";

import { colors, COLORS } from "../../common/constants/styles";
import { MODAL } from "../../common/utils/modal-toggle";
import { buildChart, buildFieldMapById, buildList } from "./ChartJson";
import { fetchConfigDetail } from "../../services/chart";
import { useSelector } from "react-redux";
import GridTableSimple from "../../elements/GridTableSimple";

const ODD_OPACITY = 0.9;

const ChartList = ({ headers, items, onChartClick }) => {
  const [openModal, setOpenModal] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [openDataTablePreview, setOpenDataTablePreview] = useState(false);
  const [openDataListPreview, setOpenDataListPreview] = useState(false);
  const [openCardPreview, setOpenCardPreview] = useState(false);
  const [selectedItemData, setSelectedItemData] = useState(null);
  const [selectedListData, setSelectedListData] = useState();
  const [selectedFieldName, setSelectedFieldName] = useState(null);
  const [displayChartType, setDisplayChartType] = useState();

  const [currentId, setCurrentId] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [refetch, setRefetch] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  const previewHandler = async (item) => {
    const result = await fetchConfigDetail(item?.dashboardItemInfoId);
    if (result && result["type"]) {
      if (result["type"].toLowerCase() === "chart") {
        chartPreviewHandler(result);
      } else if (result["type"].toLowerCase() === "list") {
        listPreviewHandler(result);
      } else if (result["type"].toLowerCase() === "table") {
        tablePreviewHandler(result);
      } else if (result["type"].toLowerCase() === "card") {
        cardPreviewHandler(result);
      }
    }
  };
  const chartPreviewHandler = (item) => {
    setOpenModal(true);
    const chartsData = buildChart(item);
    setDisplayChartType(chartsData?.defaultChartType);
    setModalContent(chartsData);
  };
  const tablePreviewHandler = (item) => {
    setSelectedItemData(item);

    setOpenDataTablePreview(true);
  };
  const listPreviewHandler = (item) => {
    let res = buildList(item);
    setSelectedItemData(res);
    setOpenDataListPreview(true);
  };

  const cardPreviewHandler = (item) => {
    setSelectedItemData(item);
    let options = item && item["options"] ? item["options"] : [];
    let option = options && options.length > 0 ? options[0] : null;
    if (option) {
      const fieldMapById = buildFieldMapById(
        item["fields"] && item["fields"].length > 0 ? item["fields"] : []
      );
      let selectedField = fieldMapById[option["fieldInfoId"]];
      setSelectedFieldName(selectedField?.label);
      setOpenCardPreview(true);
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setModalContent(null);
  };

  const handleCloseDataTablePreview = () => {
    setOpenDataTablePreview(false);
  };

  const handleCloseDataListPreview = () => {
    setOpenDataListPreview(false);
  };

  const handleCloseCardPreview = () => {
    setOpenCardPreview(false);
  };

  const onRowSelectionModelChange = (rowId) => {
    setCurrentId(rowId.data.id);
    previewHandler(rowId.data);
    onChartClick(MODAL.edit,rowId.data.id);
  };
  const handleRowsPerPageChange = (newRowsPerPage) => {
    setRowsPerPage(newRowsPerPage);

    setRefetch(!refetch);
  };
  return (
    <>
           <GridTableSimple
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
          totalRecords={items.length}
          headers={headers}
          // refField={refField}
          handledRowClick={onRowSelectionModelChange}
          setSelectedRows={setSelectedRows}
          setRefetch={setRefetch}
          rows={items}
          handleRowsPerPageChange={handleRowsPerPageChange}
          usedElements={['table', 'pagination']}
          rowTooltip="Double click to edit record"
        />

    </>
  );
};

export default ChartList;
