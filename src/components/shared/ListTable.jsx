import React, { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import {
  Chip,
  Grid,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography
} from '@mui/material';

import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import MoveUpIcon from '@mui/icons-material/MoveUp';
import AddCardIcon from '@mui/icons-material/AddCard';
import Avatar from '../../elements/Avatars';
import { colors } from '../../common/constants/styles';
import { MODAL } from '../../common/utils/modal-toggle';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ListTable = ({ headers, rows, onActionClick, onRowClick, type }) => {
  const theme = useTheme();
  const { currentTheme } = useSelector((state) => state.auth);
  const [sortedRows, setSortedRows] = useState([]);

  useEffect(() => {
    if (rows) {
      const sorted = [...rows].sort((a, b) =>
        a.displayName.localeCompare(b.displayName)
      );
      setSortedRows(sorted);
    }
  }, [rows]);

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

  const navigate = useNavigate();

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>

            <TableCell>Status</TableCell>
            <TableCell align="center" style={{ pr: 3 }}>
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedRows &&
            sortedRows.map((row, index) => (
              <TableRow
                hover
                key={index}
                onClick={() => onRowClick(row)}
                style={{
                  cursor: 'pointer'
                }}
              >
                <TableCell>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item>
                      <Avatar
                        alt="User 1"
                        style={{
                          background: assignColorById(row?.moduleInfoId)
                        }}
                        src={`${process.env.REACT_APP_STORAGE_URL}/${row?.logo}`}
                      >
                        {row?.displayName[0]?.toUpperCase()}
                      </Avatar>
                    </Grid>
                    <Grid item xs zeroMinWidth>
                      <Typography
                        align="left"
                        component="div"
                        style={{
                          fontSize: '0.875rem',
                          fontWeight: 500,
                          color:
                            currentTheme === 'Dark'
                              ? colors.white
                              : colors.grey[900]
                        }}
                      >
                        {row.displayName}{' '}
                        {row.active === true && (
                          <CheckCircleIcon
                            style={{
                              color: colors.success.dark,
                              width: 14,
                              height: 14
                            }}
                          />
                        )}
                      </Typography>
                      <Typography
                        align="left"
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 400,
                          color: colors.grey[500]
                        }}
                        noWrap
                      >
                        {truncateAfterTwentyChars(row?.description)}
                      </Typography>
                    </Grid>
                  </Grid>
                </TableCell>

                <TableCell>
                  {row.active === true && (
                    <Chip
                      label="Active"
                      size="small"
                      style={{
                        background:
                          currentTheme === 'Dark'
                            ? colors.darkLevel1
                            : colors.success.light + 60,
                        color: colors.success.dark
                      }}
                    />
                  )}
                  {row.active === false && (
                    <Chip
                      label="Rejected"
                      size="small"
                      style={{
                        background: colors.orange.light + 80,
                        color: colors.orange.dark
                      }}
                    />
                  )}
                  {row.active === undefined && (
                    <Chip
                      label="Pending"
                      size="small"
                      style={{
                        background: colors.warning.light,
                        color: colors.warning.dark
                      }}
                    />
                  )}
                </TableCell>
                <TableCell align="center" style={{ pr: 3 }}>
                  <Stack
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                  >
                    {type !== 'Module' && (
                      <>
                        <Tooltip placement="top" title="Move">
                          <IconButton
                            color="primary"
                            style={{
                              color: colors.warning.dark,
                              borderColor: colors.warning.main,
                              '&:hover ': { background: colors.warning.light }
                            }}
                            size="large"
                            onClick={(e) => {
                              e.stopPropagation();
                              onActionClick(MODAL.moveTo, row.id);
                            }}
                          >
                            <MoveUpIcon style={{ fontSize: '1.1rem' }} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip placement="top" title="Add Action">
                          <IconButton
                            color="primary"
                            style={{
                              color: colors.success.dark,
                              borderColor: colors.success.main,
                              '&:hover ': { background: colors.success.light }
                            }}
                            size="large"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate('/app/actions');
                            }}
                          >
                            <AddCardIcon style={{ fontSize: '1.1rem' }} />
                          </IconButton>
                        </Tooltip>
                      </>
                    )}
                    <Tooltip placement="top" title="Edit">
                      <IconButton
                        color="primary"
                        aria-label="delete"
                        size="large"
                        onClick={(e) => {
                          e.stopPropagation();
                          onActionClick(MODAL.edit, row.id);
                        }}
                      >
                        <EditIcon style={{ fontSize: '1.1rem' }} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip placement="top" title="Delete">
                      <IconButton
                        color="primary"
                        style={{
                          color: colors.orange.dark,
                          borderColor: colors.orange.main,
                          '&:hover ': { background: colors.orange.light }
                        }}
                        size="large"
                        onClick={(e) => {
                          e.stopPropagation();
                          onActionClick(MODAL.delete, row.id);
                        }}
                      >
                        <DeleteForeverIcon style={{ fontSize: '1.1rem' }} />
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

export default ListTable;
