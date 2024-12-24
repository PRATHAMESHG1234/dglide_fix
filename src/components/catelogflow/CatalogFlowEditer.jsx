import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchCatalogFlow } from "../../redux/slices/catalogFlowSlice";
import { Creator } from "./Creator/Creator";

const CatalogFlowEditer = () => {
  const { catalogFlowInfoId } = useParams();
  return <Creator catalogFlowInfoId={catalogFlowInfoId}/>;
};

export default CatalogFlowEditer;
