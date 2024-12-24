import React, { useState } from "react";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";

const SearchableDropdown = ({
  field,
  formObj,
  onFormValueChanged,
  formId,
  currentForm,
}) => {
  const [searchText, setSearchText] = useState("");
  const [filteredOptions, setFilteredOptions] = useState(
    field.referenceDropdownData
  );

  const handleSearchChange = (e) => {
    const searchTerm = e.target.value;
    setSearchText(searchTerm);

    // Filter options based on the search term
    const filteredOptions = field.referenceDropdownData.filter((option) =>
      option.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredOptions(filteredOptions);
  };

  return (
    <div>
      <InputLabel>{field.label}</InputLabel>
      <TextField
        label="Search"
        value={searchText}
        onChange={handleSearchChange}
        style={{ width: "20vw", minWidth: "200px", maxWidth: "320px" }}
      />
      <Select
        label={field.label}
        name={field.name}
        value={formObj[field.name] || ""}
        onChange={(e) => onFormValueChanged(e, field)}
        disabled={
          formId === "reference" && currentForm?.name === field.lookup?.formName
        }
        style={{ width: "20vw", minWidth: "200px", maxWidth: "320px" }}
      >
        {filteredOptions.map((option, index) => (
          <MenuItem key={index} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
    </div>
  );
};

export default SearchableDropdown;
