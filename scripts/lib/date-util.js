/**
 * Transform to `yyyy-MM-dd` date format.
 * @param date {Date} Date to transform.
 */
function formatDate(date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const _date = date.getDate();

  return `${year}-${month.toString().padStart(2, '0')}-${_date.toString().padStart(2, '0')}`;
}

module.exports = {
  formatDate,
};
