import './nav-bar.css';
import { useSelector } from 'react-redux';
import { FormLabel, Typography } from '@mui/material';
import DynamicTabs from './DynamicTabs';
import { COLORS } from '../../../common/constants/styles';

const PrimaryForms = ({ goToRecordPanel }) => {
  const { forms } = useSelector((state) => state.form);
  const { currentForm } = useSelector((state) => state.current);
  const { currentTheme } = useSelector((state) => state.auth);

  return (
    <DynamicTabs>
      {forms
        ?.filter((item) => item && item.showOnMenu)
        ?.map((item) => (
          <label
            className="topbar-primary-forms-list"
            key={item.formInfoId}
            onClick={() => goToRecordPanel(item)}
            style={{
              fontSize: '14px',
              fontWeight: '600',
              marginLeft: '18px',
              display: 'flex',
              alignItems: 'center',
              height: '35px',
              cursor: 'pointer',
              color:
                currentForm?.name === item.name
                  ? COLORS.PRIMARY
                  : currentTheme === 'Light'
                    ? COLORS.SECONDARY
                    : COLORS.WHITESMOKE,
              borderBottom:
                currentForm?.name === item.name
                  ? `2px solid ${COLORS.PRIMARY}`
                  : '2px solid transparent'
            }}
          >
            {item.displayName}
          </label>
        ))}
    </DynamicTabs>
  );
};

export default PrimaryForms;
