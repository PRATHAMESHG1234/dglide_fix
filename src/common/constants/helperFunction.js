import moment from 'moment';

export function truncateStringByWords(str, numWords) {
  if (
    typeof str !== 'string' ||
    typeof numWords !== 'number' ||
    numWords <= 0
  ) {
    return '';
  }

  const words = str.split(' ');

  if (words.length <= numWords) {
    return str.length > 50 ? str.slice(0, 50) + '...' : str;
  }

  let truncatedStr = words.slice(0, numWords).join(' ');

  if (truncatedStr.length > 50) {
    return truncatedStr.slice(0, 50) + '...';
  }

  return truncatedStr + '...';
}

export function replaceUnderscore(input) {
  return input
    ?.replace(/_+/g, ' ')
    ?.replace(/\s+/g, ' ')
    ?.trim()
    ?.replace(/\b\w/g, (char) => char.toUpperCase());
}
export const getTimeDifference = (dateString, originalTimezone = 'UTC') => {
  const targetTimezone = moment.tz?.guess(); // Local timezone guessed by moment.js

  if (!moment(dateString, moment.ISO_8601, true).isValid()) {
    return null;
  }

  const givenTime = moment.tz(dateString, originalTimezone);
  const givenTimeInTarget = givenTime.clone().tz(targetTimezone);
  const now = moment.tz(targetTimezone);

  let diffInMinutes = now.diff(givenTimeInTarget, 'minutes');
  let diffInHours = now.diff(givenTimeInTarget, 'hours');
  let diffInDays = now.diff(givenTimeInTarget, 'days');
  let diffInMonths = now.diff(givenTimeInTarget, 'months');
  let diffInYears = now.diff(givenTimeInTarget, 'years');

  // Ensure there are no negative values
  diffInMinutes = Math.max(0, diffInMinutes);
  diffInHours = Math.max(0, diffInHours);
  diffInDays = Math.max(0, diffInDays);
  diffInMonths = Math.max(0, diffInMonths);
  diffInYears = Math.max(0, diffInYears);

  if (diffInMinutes < 60) {
    return `Last updated ${diffInMinutes} mins ago`;
  } else if (diffInHours < 24) {
    return `Last updated ${diffInHours} hours ago`;
  } else if (diffInDays < 31) {
    return `Last updated ${diffInDays} days ago`;
  } else if (diffInMonths < 12) {
    return `Last updated ${diffInMonths} months ago`;
  } else {
    return `Last updated ${diffInYears} years ago`;
  }
};
