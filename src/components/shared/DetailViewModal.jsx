import { Box, Divider, Typography } from '@mui/joy';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Button } from '@/componentss/ui/button';
import { Trash2 } from 'lucide-react';
import { Edit, Edit2 } from 'lucide-react';
import { Avatar, Stack, Tooltip } from '@mui/material';
import IconButton from '@mui/joy/IconButton';
import { X } from 'lucide-react';
import Dropdown from '@mui/joy/Dropdown';
import ListDivider from '@mui/joy/ListDivider';
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import Menu from '@mui/joy/Menu';
import MenuButton from '@mui/joy/MenuButton';
import MenuItem from '@mui/joy/MenuItem';
import { MoreHorizontal } from 'lucide-react';
import { MODAL } from '../../common/utils/modal-toggle';
import { COLORS } from '../../common/constants/styles';

const DetailViewModal = ({
  state,
  onCancel,
  type,
  goToFields,
  onActionClick,
  goToPanel
}) => {
  return (
    <Dialog
      open={state.show}
      onClose={onCancel}
      style={{
        '& .MuiDialog-container': {
          '& .MuiPaper-root': {
            width: '100%',
            maxWidth: '400px'
          }
        }
      }}
    >
      <DialogTitle>
        <Stack spacing={1.5} direction="row" justifyContent="space-between">
          <Typography
            level="title-md"
            style={{
              color: COLORS.ORANGE
            }}
          >
            #{type === 'module' ? 'Module' : 'Form'}
          </Typography>
          <Stack spacing={1.5} direction="row">
            <Tooltip title="Edit">
              <IconButton
                slots={{ root: IconButton }}
                onClick={() =>
                  onActionClick(
                    MODAL.edit,
                    type === 'module'
                      ? state.selected.moduleInfoId
                      : state.selected.formInfoId
                  )
                }
                slotProps={{
                  root: {
                    variant: 'plain',
                    color: 'primary',
                    size: 'small'
                  }
                }}
              >
                <Edit2 style={{ color: 'primary' }} />
              </IconButton>
            </Tooltip>
            <Stack spacing={1.5} direction="row" style={{ zIndex: 1 }}>
              <Dropdown>
                <Tooltip title="more">
                  <MenuButton
                    slots={{ root: IconButton }}
                    slotProps={{
                      root: {
                        variant: 'plain',
                        color: 'neutral',
                        size: 'small'
                      }
                    }}
                  >
                    <MoreHorizontal />
                  </MenuButton>
                </Tooltip>
                <Menu placement="bottom-end" style={{ zIndex: '11111' }}>
                  <MenuItem
                    onClick={() => onActionClick(MODAL.edit, state.selected.id)}
                  >
                    <ListItemDecorator>
                      <Edit2 />
                    </ListItemDecorator>
                    Edit
                  </MenuItem>

                  <ListDivider />
                  <MenuItem variant="soft" color="danger">
                    <ListItemDecorator style={{ color: 'inherit' }}>
                      <Trash2 />
                    </ListItemDecorator>
                    Delete
                  </MenuItem>
                </Menu>
              </Dropdown>
            </Stack>

            <Divider orientation="vertical" variant="middle" flexItem />
            <Tooltip title="Close">
              <IconButton
                slots={{ root: IconButton }}
                slotProps={{
                  root: {
                    variant: 'plain',
                    size: 'small'
                  }
                }}
              >
                <X style={{ color: COLORS.SECONDARY }} onClick={onCancel} />
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>
      </DialogTitle>
      <Divider />
      <Box
        className="m-3"
        style={{ borderRadius: '5px', background: COLORS.TERTIARY }}
      >
        <Box
          className="m-3"
          style={{ borderRadius: '5px', background: COLORS.WHITE }}
        >
          <DialogContent spacing={5}>
            <Stack spacing={3}>
              <Stack spacing={1.5} direction="row" width={'100%'}>
                <Typography
                  style={{
                    fontSize: '18px',
                    color: COLORS.SECONDARY
                  }}
                  fontWeight="bold"
                >
                  {state.selected.displayName}
                </Typography>
              </Stack>
              <Stack spacing={1.5} direction="row">
                <Typography
                  level="title-sm"
                  style={{
                    color: COLORS.SECONDARY,
                    width: '50%'
                  }}
                >
                  {type === 'module' ? 'Module' : 'Form'} Logo
                </Typography>

                <Avatar
                  src={
                    state.selected.logo
                      ? state.selected.logo
                      : '/static/images/avatar/1.jpg'
                  }
                  style={{
                    width: '25px !important',
                    height: '25px !important',
                    background: 'cover'
                  }}
                />
              </Stack>
              <Stack spacing={1.5} direction="row">
                <Typography
                  level="title-sm"
                  style={{
                    color: COLORS.SECONDARY,
                    width: '50%'
                  }}
                >
                  {type === 'module' ? 'Created Date' : 'Position'}
                </Typography>
                <Typography
                  level="title-sm"
                  style={{
                    color: COLORS.SECONDARY
                  }}
                >
                  {type === 'module'
                    ? '20/05/2023'
                    : `No. is ${state.selected.position}`}
                </Typography>
              </Stack>
              <Stack spacing={1.5} direction="row">
                <Typography
                  level="title-sm"
                  style={{
                    color: COLORS.SECONDARY,
                    width: '50%'
                  }}
                >
                  No. of {type === 'module' ? 'Forms' : 'Records'}
                </Typography>

                <Box
                  className="w-25 rounded-pill flex items-center justify-center"
                  style={{
                    background: '#EEE9FF',
                    color: COLORS.PRIMARY,
                    fontWeight: 'bold'
                  }}
                >
                  {type === 'module'
                    ? state.selected.totalForms
                    : state.selected.totalRecords}
                </Box>
              </Stack>
              <Stack spacing={1.5}>
                <Typography
                  level="title-sm"
                  style={{
                    color: COLORS.SECONDARY,
                    width: '50%'
                  }}
                >
                  Description
                </Typography>
                <Divider />

                <Typography
                  style={{
                    color: COLORS.SECONDARY,
                    fontSize: '14px'
                  }}
                >
                  {state.selected.description}
                </Typography>
              </Stack>
            </Stack>
          </DialogContent>
        </Box>
        <DialogActions>
          <Stack gap={4} style={{ width: '100%' }}>
            <Button
              type="button"
              variant={'outlined'}
              fullWidth
              style={{ width: '100%' }}
              onClick={goToFields}
            >
              Fields
            </Button>
          </Stack>
          <Stack gap={4} style={{ width: '100%' }}>
            <Button
              type="button"
              fullWidth
              style={{ backgroundColor: COLORS.PRIMARY, width: '100%' }}
              onClick={() => goToPanel(state.selected)}
            >
              {type === 'module' ? 'Forms' : 'Records'}
            </Button>
          </Stack>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default DetailViewModal;
