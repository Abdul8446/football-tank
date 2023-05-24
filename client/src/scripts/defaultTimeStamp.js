// Get the current date
let currentDate = new Date();

// Get the year, month, and day from the current date
let year = currentDate.getFullYear();
let month = currentDate.getMonth() + 1; // Note that getMonth() returns 0 for January, so we need to add 1
let day = currentDate.getDate();

// Format the year, month, and day as strings with leading zeros if necessary
year = year.toString();
month = month.toString().padStart(2, '0');
day = day.toString().padStart(2, '0');

// Combine the year, month, and day into a single string with no spaces or separators
let timestamp = year + month + day;

// Log the updated timestamp

export default timestamp
