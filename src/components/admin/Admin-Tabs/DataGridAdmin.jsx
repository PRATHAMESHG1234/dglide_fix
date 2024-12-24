import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import DataTable from "../DataTable";
import SubCard from "../../../elements/SubCard";

export const DataGridAdmin = () => {
  const { formname } = useParams();
  return (
    <>
      {formname && (
        <SubCard
          sx={{
            width: "100%",
            border: "none",
            borderRadius: "8px",
            "& .MuiCardContent-root": {
              p: 0,
            },
          }}
        >
          <DataTable FormName={formname} />
        </SubCard>
      )}
    </>
  );
};
