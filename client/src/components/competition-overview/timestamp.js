module.exports.isToday = (timestamp) => {
    const year = parseInt(timestamp.slice(0, 4));
    const month = parseInt(timestamp.slice(4, 6)) - 1; // months are 0-indexed in JavaScript
    const day = parseInt(timestamp.slice(6, 8));
    const hour = parseInt(timestamp.slice(8, 10));
    const minute = parseInt(timestamp.slice(10, 12));
    const second = parseInt(timestamp.slice(12, 14));
    const timestampDate = new Date(year, month, day, hour, minute, second);
    const today = new Date();
    return timestampDate.toDateString() === today.toDateString();
};

module.exports.isTomorrow = (timestamp) => {
    const year = parseInt(timestamp.slice(0, 4));
    const month = parseInt(timestamp.slice(4, 6)) - 1; // months are 0-indexed in JavaScript
    const day = parseInt(timestamp.slice(6, 8));
    const hour = parseInt(timestamp.slice(8, 10));
    const minute = parseInt(timestamp.slice(10, 12));
    const second = parseInt(timestamp.slice(12, 14));
    const timestampDate = new Date(year, month, day, hour, minute, second);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return timestampDate.toDateString() === tomorrow.toDateString();
  };
  