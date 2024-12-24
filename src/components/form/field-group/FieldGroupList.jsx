import './FieldGroup.css';

import { Trash2 } from 'lucide-react';
import { Edit, Edit2 } from 'lucide-react';
import { Stack, Tooltip } from '@mui/joy';
import IconButton from '@mui/joy/IconButton';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  alpha
} from '@mui/material';

import { COLORS } from '../../../common/constants/styles';
import { MODAL } from '../../../common/utils/modal-toggle';

const ODD_OPACITY = 0.9;

const FieldGroupList = ({ headers, items, onActionClick }) => {
  return (
    <TableContainer
      sx={{
        cursor: 'pointer',
        maxHeight: 'calc(100vh - 350px)'
      }}
    >
      <Table
        aria-label="simple table"
        stickyHeader
        padding="40px"
        sx={{
          m: 0,
          '& .MuiTableRow-root:hover': {
            backgroundColor: alpha(COLORS.TERTIARY, ODD_OPACITY + 8)
          }
        }}
      >
        <TableHead sx={{ padding: 1 }}>
          <TableRow
            sx={{
              '& .MuiTableCell-head': {
                backgroundColor: COLORS.TERTIARY,
                m: 1,
                fontWeight: 550
              }
            }}
          >
            {headers?.map((header) => {
              return <TableCell key={header}>{header}</TableCell>;
            })}
          </TableRow>
        </TableHead>
        <TableBody sx={{ bgcolor: COLORS.WHITE }}>
          {items?.map((item, index) => (
            <TableRow
              key={item.id}
              sx={{
                '&:last-child td , &:last-child th': { border: 0 }
              }}
            >
              <TableCell
                sx={{
                  fontWeight: 'bold'
                }}
              >
                {item.fieldGroupIndex}
              </TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.description}</TableCell>

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
                          onActionClick(MODAL.edit, item.id);
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
                          color: 'danger',
                          size: 'small'
                        }
                      }}
                    >
                      <Trash2
                        sx={{ color: 'danger' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          onActionClick(MODAL.delete, item.id);
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
  );
};

export default FieldGroupList;
