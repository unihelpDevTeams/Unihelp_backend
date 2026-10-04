export const getBirthdayDateParts = (date = new Date(), timeZone = 'Africa/Lagos') => {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return {
    year: Number(values.year),
    month: Number(values.month),
    day: Number(values.day),
  };
};

export const isBirthdayOnDate = (dateOfBirth, dateParts) => {
  if (!(dateOfBirth instanceof Date) || Number.isNaN(dateOfBirth.getTime())) return false;
  const month = dateOfBirth.getUTCMonth() + 1;
  const day = dateOfBirth.getUTCDate();
  if (month === dateParts.month && day === dateParts.day) return true;

  const isLeapYear = dateParts.year % 4 === 0 && (dateParts.year % 100 !== 0 || dateParts.year % 400 === 0);
  return month === 2 && day === 29 && dateParts.month === 2 && dateParts.day === 28 && !isLeapYear;
};
