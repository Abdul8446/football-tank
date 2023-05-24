function generateTimestamp(day, date, month) {
  const month_dict = {
    'JAN': '01',
    'FEB': '02',
    'MAR': '03',
    'APR': '04',
    'MAY': '05',
    'JUN': '06',
    'JUL': '07',
    'AUG': '08',
    'SEP': '09',
    'OCT': '10',
    'NOV': '11',
    'DEC': '12'
  }
  if (month_dict.hasOwnProperty(month)) {
    month = month_dict[month]; // update the value of month variable
  }
  const year = new Date().getFullYear().toString();
  day = day.toString().padStart(2, "0");

  let timeStamp = year + month + date;

  return timeStamp;
}

module.exports = generateTimestamp;
