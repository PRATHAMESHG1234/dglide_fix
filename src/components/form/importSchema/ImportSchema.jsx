import React, { useEffect, useState } from "react";

import { Box, FormControl, FormLabel, MenuItem, Stack } from "@mui/material";

import { uploadFormLogo } from "../../../services/form";
import Dialog from "../../shared/Dialog";
import { ImportSchema } from "../../../services/module";

const ImportSchemaModal = ({ state, onConfirm, onCancel }) => {
  const [moduleSelected, setModuleSelected] = useState("");

  const [logo, setLogo] = useState("");

  useEffect(() => {
    setModuleSelected(state?.selected?.moduleInfoId);
  }, [state]);

  const onSubmitHandler = (e) => {
    e.preventDefault();
    onConfirm(moduleSelected);
  };

  const hiddenFileInput = React.useRef(null);
  const onImportFile = (e) => {
    e.preventDefault();
    hiddenFileInput.current.click();
  };

  const uploadLogoHandler = async (file) => {
    setModuleSelected(file);
  };

  return (
    <Dialog
      Header={{
        open: state.show,
        close: onCancel,
        maxWidth: "sm",
        dialogTitle: "Import schema",
      }}
      Footer={{
        clear: onCancel,
        confirm: onSubmitHandler,
        cancelBtnLabel: "Cancel",
        saveBtnLabel: "Save",
      }}
    >
      <Box spacing={5} className="m-3 modal_container">
        <Stack spacing={3}>
          <FormControl>
            <FormLabel className="mb-2 modal_form_label">
              Import Schema
            </FormLabel>
            <input
              className="p-1"
              accept=".json"
              ref={hiddenFileInput}
              type="file"
              name="logo"
              onChange={(e) => uploadLogoHandler(e.target.files[0])}
            />
          </FormControl>
        </Stack>
      </Box>
    </Dialog>
  );
};

export default ImportSchemaModal;
