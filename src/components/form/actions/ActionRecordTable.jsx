import './Action.css';

import { Trash2 } from 'lucide-react';
import { Edit, Edit2 } from 'lucide-react';
import { Stack, Tooltip } from '@mui/joy';
import IconButton from '@mui/joy/IconButton';
import {
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  alpha
} from '@mui/material';

import { colors, COLORS } from '../../../common/constants/styles';
import { MODAL } from '../../../common/utils/modal-toggle';
import { useSelector } from 'react-redux';
import Avatar from '../../../elements/Avatars';
import { CheckCircle } from 'lucide-react';
import { Edit, Edit2 } from 'lucide-react';
import { Trash2 } from 'lucide-react';

const ODD_OPACITY = 0.9;

const ActionRecordTable = ({ headers, items, onActionClick }) => {
  const { currentTheme } = useSelector((state) => state.auth);

  const color = [colors.primary.main];

  function assignColorById(id) {
    const colorIndex = id % color.length;
    const assignedColor = color[colorIndex];

    return assignedColor;
  }

  function truncateAfterTwentyChars(input) {
    if (!input) return '';
    if (input.length > 80) {
      return input.slice(0, 80) + '...';
    } else {
      return input;
    }
  }

  return (
    <TableContainer sx={{ height: '100vh' }}>
      <Table sx={{ mt: 0 }}>
        <TableHead>
          <TableRow>
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
                cursor: 'pointer'
              }}
            >
              <TableCell
                sx={{
                  fontWeight: 'bold'
                }}
              >
                {index + 1}
              </TableCell>

              <TableCell>
                <Stack
                  direction="row"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Grid container spacing={2} alignItems="center">
                    <Grid item>
                      <Avatar
                        alt="User 1"
                        sx={{ background: assignColorById(item?.id) }}
                        // src={`${process.env.REACT_APP_STORAGE_URL}/${row?.logo}`}
                      >
                        {item?.name[0]?.toUpperCase()}
                      </Avatar>
                    </Grid>
                    <Grid item xs zeroMinWidth>
                      <Typography
                        align="left"
                        component="div"
                        sx={{
                          fontSize: '0.875rem',
                          fontWeight: 500,
                          color:
                            currentTheme === 'Dark'
                              ? colors.white
                              : colors.grey[900]
                        }}
                      >
                        {item?.name} {/* {row.active === true && ( */}
                        <CheckCircle
                          sx={{
                            color: colors.success.dark,
                            width: 14,
                            height: 14
                          }}
                        />
                        {/* )} */}
                      </Typography>
                      <Typography
                        align="left"
                        sx={{
                          fontSize: '0.75rem',
                          fontWeight: 400,
                          color: colors.grey[500]
                        }}
                        noWrap
                      >
                        {truncateAfterTwentyChars(item.formDisplayName)}
                      </Typography>
                    </Grid>
                  </Grid>
                </Stack>
              </TableCell>
              <TableCell>
                <Typography sx={{ fontSize: '0.875rem' }}>
                  {item?.type}
                </Typography>
              </TableCell>

              <TableCell>
                <Tooltip placement="top" title="Edit">
                  <IconButton
                    color="primary"
                    aria-label="delete"
                    size="large"
                    onClick={(e) => {
                      e.stopPropagation();
                      onActionClick(MODAL.edit, item.id);
                    }}
                  >
                    <Edit2 sx={{ fontSize: '1.1rem' }} />
                  </IconButton>
                </Tooltip>
                <Tooltip placement="top" title="Delete">
                  <IconButton
                    color="primary"
                    sx={{
                      color: colors.orange.dark,
                      borderColor: colors.orange.main,
                      '&:hover ': { background: colors.orange.light }
                    }}
                    size="large"
                    onClick={(e) => {
                      e.stopPropagation();
                      onActionClick(MODAL.delete, item.id);
                    }}
                  >
                    <Trash2 sx={{ fontSize: '1.1rem' }} />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ActionRecordTable;
