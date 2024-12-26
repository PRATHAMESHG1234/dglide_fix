import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import SearchIcon from '@mui/icons-material/Search';
import { Stack } from '@mui/material';

import { Button } from '@/componentss/ui/button';
import { COLORS } from '../../common/constants/styles';

const FilterPanel = () => {
  return (
    <div
      className="border-bottom flex flex-wrap items-center justify-between"
      style={{ minHeight: '60px', boxSizing: 'border-box' }}
    >
      <Stack spacing={2} direction="row">
        <form
          className="flex items-center justify-between px-2"
          style={{
            boxShadow: '0px 0px 4px rgba(0, 0, 0, 0.25)',
            borderRadius: '5px',
            backgroundColor: COLORS.WHITE,
            width: '250px',
            height: '34px',
            marginLeft: '12px'
          }}
        >
          <div className="flex items-center">
            <SearchIcon sx={{ color: COLORS.SECONDARY }} />
            <h6
              style={{
                color: 'grey',
                margin: 0,
                padding: 0,
                fontSize: '15px',
                paddingLeft: '2px'
              }}
            >
              Search
            </h6>
          </div>
          <HighlightOffIcon sx={{ color: COLORS.SECONDARY }} />
        </form>

        <Button
          variant="plain"
          endDecorator={<ArrowDropDownIcon sx={{ color: COLORS.SECONDARY }} />}
          sx={{
            backgroundColor: COLORS.WHITE,
            color: 'black',
            boxShadow: '0px 0px 4px 0px #00000040'
          }}
        >
          Assigned By
        </Button>
        <Button
          variant="plain"
          endDecorator={<ArrowDropDownIcon sx={{ color: COLORS.SECONDARY }} />}
          sx={{
            backgroundColor: COLORS.WHITE,
            color: 'black',
            boxShadow: '0px 0px 4px 0px #00000040'
          }}
        >
          Status
        </Button>
        <Button
          variant="plain"
          endDecorator={<ArrowDropDownIcon sx={{ color: COLORS.SECONDARY }} />}
          sx={{
            backgroundColor: COLORS.WHITE,
            color: 'black',
            boxShadow: '0px 0px 4px 0px #00000040'
          }}
        >
          Date
        </Button>
      </Stack>
      <Stack spacing={2} direction="row">
        <Button
          variant="plain"
          startDecorator={<CheckCircleIcon sx={{ color: COLORS.SECONDARY }} />}
        >
          All Task
        </Button>
        <Button
          variant="plain"
          startDecorator={<ArrowUpwardIcon sx={{ color: COLORS.SECONDARY }} />}
        >
          By Name
        </Button>
      </Stack>
    </div>
  );
};

export default FilterPanel;
