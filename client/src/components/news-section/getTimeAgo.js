module.exports.getTimeAgo=(timestampStr)=> {
    // Convert input timestamp string to Date object
    const timestamp = new Date(timestampStr);
    // Get current time
    const currentTime = new Date();
    // Calculate time difference in milliseconds
    const timeDifference = currentTime - timestamp;
  
    // Define time units in milliseconds
    const MINUTE = 60 * 1000;
    const HOUR = 60 * MINUTE;
    const DAY = 24 * HOUR;
  
    // Extract time components from time difference
    const days = Math.floor(timeDifference / DAY);
    const hours = Math.floor((timeDifference % DAY) / HOUR);
    const minutes = Math.floor((timeDifference % HOUR) / MINUTE);
  
    // Construct human-readable string
    if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (minutes > 0) {
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  }
  