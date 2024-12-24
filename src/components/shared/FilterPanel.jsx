import { ChevronDown } from 'lucide-react';
import { ArrowUp } from 'lucide-react';
import { CheckCircle } from 'lucide-react';
import { XCircle } from 'lucide-react';
import { Search } from 'lucide-react';
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
            <Search sx={{ color: COLORS.SECONDARY }} />
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
          <XCircle sx={{ color: COLORS.SECONDARY }} />
        </form>

        <Button
          variant="plain"
          endDecorator={<ChevronDown sx={{ color: COLORS.SECONDARY }} />}
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
          endDecorator={<ChevronDown sx={{ color: COLORS.SECONDARY }} />}
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
          endDecorator={<ChevronDown sx={{ color: COLORS.SECONDARY }} />}
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
          startDecorator={<CheckCircle sx={{ color: COLORS.SECONDARY }} />}
        >
          All Task
        </Button>
        <Button
          variant="plain"
          startDecorator={<ArrowUp sx={{ color: COLORS.SECONDARY }} />}
        >
          By Name
        </Button>
      </Stack>
    </div>
  );
};

export default FilterPanel;
