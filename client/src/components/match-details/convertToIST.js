module.exports.convertToIST = (timestamp) => {
  // extract the date and time components from the timestamp
  const year = timestamp.slice(0, 4);
  const month = timestamp.slice(4, 6);
  const day = timestamp.slice(6, 8);
  const hour = timestamp.slice(8, 10);
  const minute = timestamp.slice(10, 12);
  const second = timestamp.slice(12, 14);

  // create a new Date object using the extracted components and set its timezone to IST
  const dateObj = new Date(
    `${year}-${month}-${day}T${hour}:${minute}:${second}Z`
  );
  dateObj.setUTCHours(dateObj.getUTCHours() + 5);
  dateObj.setUTCMinutes(dateObj.getUTCMinutes() + 30);

  // format the date and time components as a string in 24-hour format and return it
  const IST = dateObj.toISOString().replace(/[-T:Z]/g, "");
  return IST.slice(8, 10) + ":" + IST.slice(10, 12);
};

module.exports.convertToDate=(timestamp)=> {
  // get the current date and format it as "31 Mar" if it's not the same as the given date
  const currentDate = new Date();
  const currentDay = currentDate.getUTCDate();
  const currentMonth = currentDate.getUTCMonth() + 1;
  // const dateStr = `${day} ${getMonthName(parseInt(month))}`;
  // extract the date and time components from the timestamp
  const year = timestamp.slice(0, 4);
  const month = timestamp.slice(4, 6);
  const day = timestamp.slice(6, 8);
  const hour = timestamp.slice(8, 10);
  const minute = timestamp.slice(10, 12);
  const second = timestamp.slice(12, 14);

  // create a new Date object using the extracted components and set its timezone to IST
  const dateObj = new Date(
    `${year}-${month}-${day}T${hour}:${minute}:${second}Z`
  );
  dateObj.setUTCHours(dateObj.getUTCHours() + 5);
  dateObj.setUTCMinutes(dateObj.getUTCMinutes() + 30);


  // format the date and time components as a string in 24-hour format and return it
  const IST = dateObj.toISOString().replace(/[-T:Z]/g, "");
  const curDay=IST.slice(6,8)
  const curMonth=getMonthName(IST.slice(4,6))
  // return `${IST.slice(6,8)} ${getMonthName(IST.slice(4,6))}`

  if (currentDay !== parseInt(day) || currentMonth !== parseInt(month)) {
    return `${curDay} ${curMonth}`;
  } else {
    return "Today";
  }
}

// helper function to get the name of the month from its number
function getMonthName(monthNum) {
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return monthNames[monthNum - 1];
}

module.exports.formatDate=(dateString)=> {
  const year = dateString.substring(0, 4);
  const month = parseInt(dateString.substring(4, 6), 10);
  const day = parseInt(dateString.substring(6, 8), 10);
  const monthName = new Date(year, month - 1).toLocaleString('default', { month: 'short' });
  return `${day} ${monthName} ${year}`;
}




