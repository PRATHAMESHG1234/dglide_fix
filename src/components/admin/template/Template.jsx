import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  alpha,
  FormLabel,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip
} from '@mui/material';
import { Edit2, Plus, PlusCircle, Trash2 } from 'lucide-react';
import { Button } from '@/componentss/ui/button';
import ConfirmationModal from '../../shared/ConfirmationModal';
import {
  deleteTemplate,
  fetchAllTemplates
} from '../../../services/formTemplate';
import { COLORS } from '../../../common/constants/styles';

const headers = ['name', 'form_info_id'];
const headerMapping = {
  name: 'Name',
  form_info_id: 'Form'
};

const Template = () => {
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(true);
  const [templateData, setTemplateData] = useState([]);
  const [selectedRecordAction, setSelectedRecordAction] = useState({});
  useEffect(() => {
    if (refresh) {
      const fetchTemplate = async () => {
        const res = await fetchAllTemplates();
        const result = res?.result;
        setTemplateData(result);
      };
      fetchTemplate();
    }
    setRefresh(false);
  }, [refresh]);

  useEffect(() => {
    const fetchTemplate = async () => {
      if (selectedRecordAction) {
        const templateEdit = selectedRecordAction?.type === 'edit';
        const templateDelete = selectedRecordAction?.type === 'delete';
        if (templateEdit) {
          const rowId = selectedRecordAction?.record?.uuid;

          const url = `modify?id=${rowId}`;
          navigate(url);
        }
        if (templateDelete) {
          const rowId = selectedRecordAction?.record?.uuid;
          const res = await deleteTemplate(rowId);
          const result = res?.result;
          setRefresh(true);
        }
      }
    };
    fetchTemplate();
  }, [selectedRecordAction]);

  const addTemplateHandler = () => {
    const url = '/admin/form-template/modify';
    navigate(url);
  };

  return (
    <div
      className="border p-2"
      style={{ borderRadius: '10px', backgroundColor: COLORS.WHITE }}
    >
      <div
        className="border-bottom flex items-center justify-between px-3"
        style={{ height: '60px' }}
      >
        <FormLabel sx={{ fontSize: '16px', fontWeight: 'bold' }}>
          Template
        </FormLabel>
        <div className="flex items-center" onClick={addTemplateHandler}>
          <Button tooltipTitle={'Add Action'}>
            <Plus />
          </Button>
        </div>
      </div>
      <TableContainer
        sx={{
          cursor: 'pointer',
          maxHeight: 'calc(100vh - 175px)'
        }}
      >
        <Table
          aria-label="simple table"
          stickyHeader
          padding="40px"
          sx={{
            m: 0,
            '& .MuiTableRow-root:hover': {
              backgroundColor: alpha(COLORS.TERTIARY, 0.3)
            }
          }}
        >
          <TableHead sx={{ padding: 1 }}>
            <TableRow
              sx={{
                '& .MuiTableCell-head': {
                  backgroundColor: COLORS.TERTIARY,
                  m: 1
                }
              }}
            >
              <TableCell
                sx={{
                  fontWeight: 'bold'
                }}
              >
                Sr.no
              </TableCell>
              {headers.map((key) => (
                <TableCell key={key}>{headerMapping[key] || key}</TableCell>
              ))}

              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {templateData.map((template, index) => (
              <TableRow
                key={index}
                sx={{
                  '&:last-child td , &:last-child th': { border: 0 }
                }}
              >
                <TableCell
                  sx={{
                    fontWeight: 'bold'
                  }}
                >
                  {index + 1}
                </TableCell>
                {headers.map((key) => (
                  <TableCell key={index}>{template[key]}</TableCell>
                ))}

                <TableCell>
                  <Stack spacing={1} direction="row">
                    <Tooltip title="Edit">
                      <IconButton
                        slots={{ root: IconButton }}
                        slotProps={{
                          root: {
                            variant: 'plain',
                            color: 'primary',
                            size: 'small'
                          }
                        }}
                      >
                        <Edit2
                          sx={{ color: COLORS.PRIMARY }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedRecordAction({
                              type: 'edit',
                              record: template
                            });
                          }}
                        />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        slots={{ root: IconButton }}
                        slotProps={{
                          root: {
                            variant: 'plain',
                            color: 'red',
                            size: 'small'
                          }
                        }}
                      >
                        <Trash2
                          sx={{ color: 'darkred' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedRecordAction({
                              type: 'delete',
                              record: template
                            });
                          }}
                        />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <ConfirmationModal
      // open={selectedRecordAction?.type === 'delete'}
      // heading={`Are you sure you want to delete this record?`}
      // onConfirm={deleteActionHandler}
      // onCancel={() => setSelectedRecordAction({})}
      />
    </div>
  );
};

export default Template;
