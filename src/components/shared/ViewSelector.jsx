import { useDispatch, useSelector } from 'react-redux';
import './ViewSelecter.css';
import { Plus, PlusCircle } from 'lucide-react';
import { List } from 'lucide-react';
import { Grid } from 'lucide-react';
import { Button as Buttons, Stack, Tooltip } from '@mui/material';

import { COLORS, colors } from '../../common/constants/styles';
import { Button } from '@/componentss/ui/button';
import { setCurrentView } from '../../redux/slices/currentSlice';
import { useLocation, useNavigate } from 'react-router-dom';
import { color } from 'framer-motion';
import AnimateButton from '../../pages/Login/AnimateButton';

const ViewSelector = ({ onCreateNew, type }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const pathname = location.pathname;
  const dispatch = useDispatch();
  const { currentView } = useSelector((state) => state.current);
  const { currentUser, currentTheme } = useSelector((state) => state.auth);

  return (
    <div className="flex items-start justify-between px-1">
      <Stack spacing={2} direction="row">
        <Button
          variant="plain"
          startDecorator={
            <List
              sx={{
                color:
                  currentView === 'List'
                    ? colors.primary.main
                    : colors.grey[900],

                fontWeight: 'bold'
              }}
            />
          }
          onClick={() => dispatch(setCurrentView({ view: 'List' }))}
          sx={{
            color:
              currentView === 'List'
                ? colors.primary.main
                : currentTheme === 'Dark'
                  ? colors.secondary.main
                  : colors.grey[900],
            borderRadius: 8,
            backgroundColor:
              currentView === 'List' && currentTheme === 'Light'
                ? `${colors.primary.light}`
                : currentView === 'List' && currentTheme === 'Dark'
                  ? colors.darkLevel2
                  : currentTheme === 'Dark'
                    ? colors.darkLevel2
                    : colors.white,
            '&:hover': {
              backgroundColor:
                currentTheme === 'Dark' ? colors.darkTab : colors.primary.light,
              // color:  colors.primary.main,
              border:
                currentView === 'List' ? `solid 1px ${colors.primary.main}` : ''
            },
            border:
              currentView === 'List' ? `solid 1px ${colors.primary.main}` : '',
            boxShadow: 5
          }}
        >
          List View
        </Button>
        <Button
          variant="plain"
          startDecorator={
            <Grid
              sx={{
                color:
                  currentView === 'Grid'
                    ? colors.primary.main
                    : colors.grey[900]
              }}
            />
          }
          onClick={() => dispatch(setCurrentView({ view: 'Grid' }))}
          sx={{
            color:
              currentView === 'Grid'
                ? colors.primary.main
                : currentTheme === 'Dark'
                  ? colors.secondary.main
                  : colors.grey[900],
            borderRadius: 8,
            backgroundColor:
              currentView === 'Grid' && currentTheme === 'Light'
                ? `${colors.primary.light}`
                : currentView === 'Grid' && currentTheme === 'Dark'
                  ? colors.darkLevel2
                  : currentTheme === 'Dark'
                    ? colors.darkLevel2
                    : colors.white,
            '&:hover': {
              backgroundColor:
                currentTheme === 'Dark' ? colors.darkTab : colors.primary.light,
              // color: colors.primary.main,
              border:
                currentView === 'Grid' ? `solid 1px ${colors.primary.main}` : ''
            },
            border:
              currentView === 'Grid' ? `solid 1px ${colors.primary.main}` : '',
            boxShadow: 5
          }}
        >
          Grid View
        </Button>
      </Stack>
      <div className="flex">
        {pathname === '/portal' ? (
          <div
            className="flex items-center"
            onClick={() => navigate('/portal/myRequest')}
          >
            <Button
              tooltipTitle={`Add ${type}`}
              sx={{
                backgroundColor: COLORS.PRIMARY,
                boxShadow:
                  '0px 3px 3px 0px #FFFFFF26 inset,0px -3px 3px 0px #00000026 inset,0px 8px 15px 0px #1177FF40'
              }}
            >
              My Request List
            </Button>
          </div>
        ) : null}
        {currentUser?.roles?.some((role) => role.name === 'Super Admin') &&
        pathname !== '/portal' &&
        currentView === 'Grid' ? (
          <div className="flex items-center" onClick={onCreateNew}>
            <Tooltip title={`Add ${type}`}>
              <AnimateButton>
                <Buttons
                  size="medium"
                  sx={{
                    backgroundColor: colors.primary.main,
                    color: colors.white,
                    fontSize: '0.875rem',
                    '&:hover': {
                      backgroundColor: colors.primary.main,
                      color: colors.white
                    },

                    textTransform: 'none'
                  }}
                >
                  <Plus />
                </Buttons>
              </AnimateButton>
            </Tooltip>
          </div>
        ) : (
          currentUser?.roles?.some((role) => role.name !== 'Super Admin') &&
          !pathname.includes('/portal') &&
          (currentView === 'Grid' || currentView === 'List') && (
            <div className="flex items-center" onClick={onCreateNew}>
              <Buttons
                sx={{
                  backgroundColor: colors.primary.main,
                  color: colors.white,
                  fontSize: '0.875rem',
                  '&:hover': {
                    backgroundColor: colors.primary.main,
                    color: colors.white
                  },

                  textTransform: 'none'
                }}
              >
                <Plus />
              </Buttons>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default ViewSelector;
