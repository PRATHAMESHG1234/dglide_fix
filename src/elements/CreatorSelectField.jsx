import { MenuItem, Typography } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Select from '@mui/material/Select';
import { colors, COLORS } from '../common/constants/styles';
import { useSelector } from 'react-redux';

const SelectField = (props) => {
  const SelectedOption = props.value;
  const { currentTheme } = useSelector((state) => state.auth);
  // const [touched, setTouched] = useState(false);

  // const handleTouch = () => {
  //   setTouched(true);
  // };
  // const handleOptionSelect = () => {
  //   setTouched(false);
  // };
  return (
    <div className="input-wrapper">
      <FormControl sx={props.fieldstyle}>
        <FormLabel sx={{ fontSize: '13px', fontWeight: 'bold', marginY: 0.3 }}>
          {props.labelname}
          {props.required && <span className="text-danger"> *</span>}
        </FormLabel>
        <Select
          fullWidth
          placeholder={props.placeholder ? props.placeholder : 'Select...'}
          defaultValue=""
          {...props}
          required={false}
          sx={{
            height: '30px',
            width: '100%',
            fontSize: '13px',
            bgcolor: currentTheme === 'Dark' ? colors.darkTab : colors.white
          }}
        >
          {props.options?.map((opn, j) => {
            return (
              <MenuItem
                key={j}
                value={opn.label || opn.value}
                sx={{
                  fontSize: '13px'
                }}
              >
                {opn.label}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
      {!SelectedOption && props.required && props.submitFlag && (
        <Typography className="error" sx={{ height: '15px' }}>
          {`${props.labelname}
          field can't be empty..!`}
        </Typography>
      )}
    </div>
  );
};
export default SelectField;
