function getDates() {
  const today = new Date();
  const dates = [];
      
  for (let i = -2; i <= 2; i++) {
    const date = new Date();
    date.setDate(today.getDate() + i);
    const day = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"][
      date.getDay()
    ];
    const month = [
      "JAN",
      "FEB",
      "MAR",
      "APR",
      "MAY",
      "JUN",
      "JUL",
      "AUG",
      "SEP",
      "OCT",
      "NOV",
      "DEC",
    ][date.getMonth()];
    dates.push({ day: day, date: date.getDate(), month: month });
  }

  return dates;
}

module.exports=getDates()