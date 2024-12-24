import React from 'react';
import IconButton from '@mui/joy/IconButton';
import {
  Box,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const TablePreviewModal = ({ open, onClose, selectedItemData }) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      className="small-modal"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Box>
        <div
          className="bg-white"
          style={{
            position: 'relative',
            height: '40%',
            width: '600px',
            marginLeft: '25%',
            marginTop: '50px',
            padding: '15px'
          }}
        >
          <IconButton
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              zIndex: 999
            }}
          >
            <CloseIcon />
          </IconButton>

          <h2 id="modal-modal-title">Table Preview</h2>

          <p id="modal-modal-description">
            {selectedItemData && (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Sr.No</TableCell>
                      {/* {selectedItemData.result.length > 0 &&
                  Object.keys(selectedItemData.result[0]).map((key) => (
                    <>
                      <TableCell key={key}>{key}</TableCell>
                    </>
                  ))} */}
                      {selectedItemData?.result &&
                        Object.keys(selectedItemData?.result[0])
                          .filter(
                            (key) =>
                              ![
                                'uuid',
                                'created_at',
                                'updated_at',
                                'created_by',
                                'updated_by'
                              ].includes(key)
                          )
                          .map((key) => (
                            <TableCell key={key}>
                              {key.charAt(0).toUpperCase() + key.slice(1)}
                            </TableCell>
                          ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedItemData?.result?.map(
                      (resultItem, resultIndex) => (
                        <TableRow key={resultIndex}>
                          <TableCell>{resultIndex + 1}</TableCell>
                          {/* {Object.keys(resultItem).map((key) => (
                      <>
                        <TableCell key={`${resultIndex}-${key}`}>
                          {resultItem[key]}
                        </TableCell>
                      </>
                    ))} */}
                          {Object.entries(resultItem)
                            .filter(
                              ([key]) =>
                                ![
                                  'uuid',
                                  'created_at',
                                  'updated_at',
                                  'created_by',
                                  'updated_by'
                                ].includes(key)
                            )
                            .map(([key, value]) => (
                              <TableCell key={key}>{value}</TableCell>
                            ))}
                        </TableRow>
                      )
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </p>
        </div>
      </Box>
    </Modal>
  );
};

export default TablePreviewModal;
