import React, { useState } from "react";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import {
  TextField,
  Box,
  Select,
  FormControl,
  MenuItem,
  InputLabel,
} from "@mui/material";

const TextEditorProperty = () => {
  const [age, setAge] = useState("");

  const handleChange = (event) => {
    setAge(event.target.value);
  };
  return (
    <Box>
      <span>
        <InputLabel
          sx={{ fontSize: "12px", fontWeight: "bold" }}
          className="my-1"
        >
          Category
        </InputLabel>
        <FormControl fullWidth sx={{ marginBottom: 2 }} size="small">
          <Select id="demo-simple-select" value={age} onChange={handleChange}>
            <MenuItem value={10}>Ten</MenuItem>
            <MenuItem value={20}>Select</MenuItem>
            <MenuItem value={30}>Thirty</MenuItem>
          </Select>
        </FormControl>
      </span>
      <span>
        <InputLabel
          sx={{ fontSize: "12px", fontWeight: "bold" }}
          className="my-1"
        >
          Folder
        </InputLabel>
        <FormControl fullWidth sx={{ marginBottom: 2 }} size="small">
          <Select id="demo-simple-select" value={age} onChange={handleChange}>
            <MenuItem value={10}>Ten</MenuItem>
            <MenuItem value={20}>Select</MenuItem>
            <MenuItem value={30}>Thirty</MenuItem>
          </Select>
        </FormControl>
      </span>
      <span>
        <InputLabel
          sx={{ fontSize: "12px", fontWeight: "bold" }}
          className="my-1"
        >
          Type
        </InputLabel>
        <FormControl fullWidth sx={{ marginBottom: 2 }} size="small">
          <Select id="demo-simple-select" value={age} onChange={handleChange}>
            <MenuItem value={10}>Ten</MenuItem>
            <MenuItem value={20}>Select</MenuItem>
            <MenuItem value={30}>Thirty</MenuItem>
          </Select>
        </FormControl>
      </span>
      <span>
        <InputLabel
          sx={{ fontSize: "12px", fontWeight: "bold" }}
          className="m-0 p-0"
        >
          Date
        </InputLabel>
        <FormControl fullWidth sx={{ marginBottom: 2 }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={["DatePicker"]}>
              <DatePicker
                slotProps={{
                  textField: { size: "small" },
                }}
              />
            </DemoContainer>
          </LocalizationProvider>
        </FormControl>
      </span>
      <span>
        <InputLabel
          sx={{ fontSize: "12px", fontWeight: "bold" }}
          className="my-1"
        >
          Tags
        </InputLabel>
        <FormControl fullWidth sx={{ marginBottom: 2 }} size="small">
          <TextField size="small" />
        </FormControl>
      </span>
      <span>
        <InputLabel
          sx={{ fontSize: "12px", fontWeight: "bold" }}
          className="my-1"
        >
          Keywords
        </InputLabel>
        <FormControl fullWidth sx={{ marginBottom: 2 }} size="small">
          <TextField size="small" />
        </FormControl>
      </span>
    </Box>
  );
};

export default TextEditorProperty;
