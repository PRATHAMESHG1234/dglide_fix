import { colors } from '../../common/constants/styles';

// has number
const hasNumber = (number) => new RegExp(/[0-9]/).test(number);

// has mix of small and capitals
const hasMixed = (number) =>
  new RegExp(/[a-z]/).test(number) && new RegExp(/[A-Z]/).test(number);

// has special chars
const hasSpecial = (number) => new RegExp(/[!#@$%^&*)(+=._-]/).test(number);

// set color based on password strength
export const strengthColor = (count) => {
  if (count < 2) return { label: 'Poor', color: colors.error.main };
  if (count < 3) return { label: 'Weak', color: colors.warning.dark };
  if (count < 4) return { label: 'Normal', color: colors.orange.main };
  if (count < 5) return { label: 'Good', color: colors.success.main };
  if (count < 6) return { label: 'Strong', color: colors.success.dark };
  return { label: 'Poor', color: colors.error.main };
};

// password strength indicator
export const strengthIndicatorNumFunc = (number) => {
  let strengths = 0;
  if (number.length > 5) strengths += 1;
  if (number.length > 7) strengths += 1;
  if (hasNumber(number)) strengths += 1;
  if (hasSpecial(number)) strengths += 1;
  if (hasMixed(number)) strengths += 1;
  return strengths;
};
