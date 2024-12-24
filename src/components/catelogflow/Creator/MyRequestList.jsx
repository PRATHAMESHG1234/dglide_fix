import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { fetchRecords } from '../../../services/table';
import List from "./CatalogSelectionList";
import { useLocation, useNavigate } from 'react-router-dom';

const MyRequestList = () => {
    const location = useLocation();
    const pathname = location.pathname;
    const [myReqstList, setMyRequestList] = useState([]);
    const [columns, setColumns] = useState([]);
    const [rows, setRows] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const payload = {
            pagination: null,
            where: null,
            sort: []
          }
        fetchRecords("requests", payload).then((data) => {
            let responceList = data?.data
            setMyRequestList(data.data)
            if (data?.data?.length > 0) {
                const keysData = Object.keys(responceList[0]);

                const headers = keysData
                    .map((key) => {
                        return {
                            headerName: key.charAt(0).toUpperCase() + key.slice(1),
                            field: key,
                            flex: 1,
                        };
                    });
                setColumns(headers);
                const modified = responceList?.map((data) => {
                    return {
                        ...data
                    };
                });
                setRows(modified);
            }
        })
    }, []);

    const goToRecordPanel = (row) => {
        if (pathname.includes("/myRequest")) {
            navigate(`/portal/myRequest/${row.uuid}`, {
            });
        }
    };

    return (
        <div>
            {
                columns.length > 0 ?
                    <List
                        // actionHandler={modalActionHandler}
                        rows={rows}
                        columns={columns}
                        density="compact"
                        // onCreateNew={() => modalActionHandler(MODAL.create)}
                        // onRowDoubleClick={handleRowDoubleClick}
                        goToRecordPanel={goToRecordPanel}
                        gridViewFlag= "myRequest"
                    ></List> : null}
        </div>
    )
}
export default MyRequestList