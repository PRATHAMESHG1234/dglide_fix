import React, { useEffect, useState } from "react";
import { Box, Stack } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Trash } from 'lucide-react';
import { Edit } from 'lucide-react';
import { MODAL } from "../../../common/utils/modal-toggle";
import Button from "../../../elements/Button";

const GroupList = ({ groups, modalActionHandler }) => {
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    if (groups?.length > 0) {
      const keysData = Object.keys(groups[0]);
      const headers = keysData?.map((key) => {
        return { headerName: key, field: key, flex: 1 };
      });

      const modified = groups?.map((data) => {
        return {
          ...data,
          id: data.groupId,
        };
      });

      setRows(modified);
      setColumns(headers);
    }
  }, [groups]);
  const fields = [
    ...columns,
    {
      field: "actions",
      headerName: "Actions",
      width: 400,
      renderCell: (data) => {
        return (
          <>
            <Stack direction="row" spacing={1}>
              <Button
                size="sm"
                color="primary"
                variant="outlined"
                onClick={() =>
                  modalActionHandler(MODAL.edit, data?.row?.groupId)
                }
                style={{
                  borderRadius: 1,
                }}
              >
                <EditIcon />
              </Button>
              <Button
                size="sm"
                color="danger"
                variant="outlined"
                onClick={() =>
                  modalActionHandler(MODAL.delete, data?.row?.groupId)
                }
                style={{
                  borderRadius: 1,
                }}
              >
                <DeleteOutlineIcon />
              </Button>
            </Stack>
          </>
        );
      },
    },
  ];

  return (
    <div className="mt-5">
      <Box style={{ height: "auto", padding: "5px", paddingTop: "10px" }}>
        <DataGrid
          rows={rows}
          columns={fields}
          density="compact"
          disableColumnMenu
        />
      </Box>
    </div>
  );
};

export default GroupList;
