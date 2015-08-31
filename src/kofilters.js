

ko.filters.dateFormat = function (dateString, format = "MMM Do YYYY") {
  return moment(dateString).format(format)
}
