import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { COLORS } from '../../../../common/constants/styles';

import {
  deleteObject,
  fetchAllObjectById,
  fetchTypeOfIntegration
} from '../../../../services/integration';
import { ObjectGrid } from './ObjectGrid';
import { ObjectModal } from './ObjectModal';
import { Pencil } from 'lucide-react';
import { notify } from '../../../../hooks/toastUtils';
const operationType = [
  {
    label: 'Extract',
    value: 1
  },
  {
    label: 'Load',
    value: 2
  }
];
export const ObjectLanding = ({
  open,
  setOpen,
  allObjectList,
  setRefetch,
  pluginEdit,
  setObjectEdit,
  objectEdit
}) => {
  const dispatch = useDispatch();
  const [objectTypeList, setObjectTypeList] = useState([]);

  // const getPluginType = async () => {
  //   try {
  //     const TypeList = await fetchTypeOfIntegration('object');
  //     console.log(TypeList);
  //     setObjectTypeList(
  //       TypeList.result.map((type, index) => ({
  //         label: type,
  //         value: index + 1
  //       }))
  //     );
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // useEffect(() => {
  //   getPluginType();
  // }, []);

  const onDelete = async (data) => {
    try {
      const response = await deleteObject(data.objectId);
      setTimeout(() => {
        notify.success('Operation Deleted Successfully .');
      }, 600);
      setRefetch((prev) => !prev);
    } catch (error) {
      console.log(error);
    }
  };
  const headers = [
    { headerName: 'Sr no', field: 'srNo', sortable: true, width: 5 },
    { headerName: 'Name', field: 'name', sortable: true, filter: true },
    { headerName: 'Type', field: 'type_display', sortable: true, filter: true },
    {
      headerName: 'Description',
      field: 'description',
      sortable: true,
      filter: true
    },
    {
      headerName: 'Actions',
      field: 'action',
      sortable: true,
      filter: true,
      cellRenderer: (params) => (
        <div spacing={1} direction="row">
          <div
            className="mt-2 text-primary"
            style={{ width: '6px', height: '6px' }}
            onClick={(e) => {
              setObjectEdit({
                type: 'edit',
                data: params?.data
              });
              setOpen(true);
            }}
          >
            <Pencil className="h-4 w-4" />
          </div>

          {/* <IconButton
            aria-label="delete"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(params?.data);
            }}
            style={{ color: 'red' }}
          >
            <IconTrash />
          </IconButton> */}
        </div>
      )
    }
  ];
  return (
    <>
      {allObjectList.length > 0 && (
        <ObjectGrid
          items={allObjectList?.map((object, index) => {
            return {
              ...object,
              srNo: index + 1,
              id: object.objectId,
              type_display: operationType.find(
                (type) => type.value === object.type
              )?.label
            };
          })}
          headers={headers}
        />
      )}
      {open && objectEdit.type && (
        <ObjectModal
          // allPluginList={allPluginList}
          open={open}
          setOpen={setOpen}
          selectedPluginId={pluginEdit?.data?.pluginId}
          objectEdit={objectEdit}
          setObjectEdit={setObjectEdit}
          operationType={operationType}
          setRefetch={setRefetch}
        />
      )}
    </>
  );
};
