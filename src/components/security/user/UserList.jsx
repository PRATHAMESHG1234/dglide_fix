import React, { useEffect, useState } from "react";
import { Box, Stack } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Edit } from 'lucide-react';
import { Trash } from 'lucide-react';
import { MODAL } from "../../../common/utils/modal-toggle";
import Button from "../../../elements/Button";

const GroupList = ({ users, modalActionHandler }) => {
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    if (users?.length > 0) {
      const keysData = Object.keys(users[0]);
      const headers = keysData
        ?.filter((key) => key !== "password" && key !== "active")
        ?.map((key) => {
          return { headerName: key, field: key, flex: 1 };
        });

      const modified = users?.map((data) => {
        return {
          ...data,
          id: data.userId,
        };
      });

      setRows(modified);
      setColumns(headers);
    }
  }, [users]);
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
                  modalActionHandler(MODAL.edit, data?.row?.userId)
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
                  modalActionHandler(MODAL.delete, data?.row?.userId)
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
