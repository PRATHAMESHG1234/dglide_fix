/* eslint-disable react-hooks/exhaustive-deps */
import { FormLabel, Typography } from "@mui/material";
import MUITextField from "@mui/material/TextField";
import { useState, useEffect } from "react";

const DefaultTextField = (props) => {
  const [helperText, setHelperText] = useState("");
  useEffect(() => {
    if (
      props.maxLength &&
      props.maxLength < props.value?.length &&
      props.value?.length > 0
    ) {
      setHelperText(`maximum ${props.maxLength} characters allowed..!`
      );
      // props?.setErrorMsg(`maximum ${props.maxLength} characters allowed..!` );
    } else if (
      props.regex &&
      !new RegExp(props.regex).test(props.value)
    ) {
      setHelperText(`Invalid ${props.labelname} format..!`);

    } else {
      setHelperText("");
      // props?.setErrorMsg("")
    }
  }, [props?.submitFlag, props.value]);

  return (
    <div className="" style={props.fieldstyle}>
      <FormLabel sx={{ fontSize: "13px", fontWeight: "bold" }}>
        {props.labelname}
      </FormLabel>
      <MUITextField
        fullWidth
        id={props.labelname}
        placeholder={props.placeholder ? props.placeholder : "Enter..."}
        {...props}
      />
      {helperText !== "" && props.submitFlag &&  (
        <Typography className="error" >
          {helperText}
        </Typography>
      )}
    </div>
  );
};

export default DefaultTextField;
