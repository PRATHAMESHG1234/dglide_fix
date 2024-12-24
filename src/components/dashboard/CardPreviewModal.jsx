import React from 'react';
import IconButton from '@mui/joy/IconButton';
import { Box, Modal, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { COLORS } from '../../common/constants/styles';

const CardPreviewModal = ({ open, onClose, selectedItemData }) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      className="small-modal"
    >
      <Box>
        <div
          className="bg-white"
          style={{
            position: 'relative',
            height: '40%',
            width: '60%',
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
              right: '10px'
            }}
          >
            <CloseIcon />
          </IconButton>
          <h2 id="modal-modal-title">Card Preview</h2>

          <p id="modal-modal-description">
            {selectedItemData && (
              <span
                // key={index}
                className="flex-1"
                style={{ minWidth: '32%' }}
              >
                <div>
                  {selectedItemData?.result?.map((resultItem, resultIndex) => (
                    <div
                      key={resultIndex}
                      className="border p-4"
                      style={{
                        m: 1,
                        bgcolor: COLORS.WHITE,
                        flexGrow: 1,
                        backgroundColor: COLORS.WHITE,
                        borderRadius: '10px'
                      }}
                    >
                      <div>
                        <label>{selectedItemData.formName}</label>

                        <Typography
                          variant="body2"
                          fontSize="30px"
                          sx={{
                            fontWeight: 'bolder'
                          }}
                        >
                          {resultItem?.totalCount}
                        </Typography>
                      </div>
                    </div>
                  ))}
                </div>
              </span>
            )}
          </p>
        </div>
      </Box>
    </Modal>
  );
};

export default CardPreviewModal;
