// import "./FieldGroup.css";

import DeleteForever from "@mui/icons-material/DeleteForever";

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
import { saveAs } from "file-saver";

import { colors, COLORS } from "../../../common/constants/styles";
import { MODAL } from "../../../common/utils/modal-toggle";
import DownloadIcon from "@mui/icons-material/CloudDownload";
import { downloadDump } from "../../../services/dump";
import { IconDownload, IconTrash } from "@tabler/icons-react";
import GridTableSimple from "../../../elements/GridTableSimple";
import { useState } from "react";

const ODD_OPACITY = 0.9;

const SchemaList = ({ headers, items, onActionClick }) => {
  const [selectedRows, setSelectedRows] = useState([]);

  const onRowSelectionModelChange = (rowId) => {
    // setCurrentId(rowId.data.id);
    // previewHandler(rowId.data);
    // onChartClick(MODAL.edit,rowId.data.id);
  };

  return (
    <GridTableSimple
      totalRecords={items.length}
      headers={headers}
      handledRowClick={onRowSelectionModelChange}
      rows={items}
      usedElements={["table"]}
      rowTooltip="Double click to edit record"
    />
  );
};

export default SchemaList;
