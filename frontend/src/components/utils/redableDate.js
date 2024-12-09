export const toRedableDate = (datetoconvert) => {
  const nDate = new Date(datetoconvert);
  return nDate.toLocaleDateString();
};

export const toRedableDateAndTime = (dateAndTimeToConvert) => {
  const newDate = new Date(dateAndTimeToConvert);
  return newDate.toLocaleString();
};
