var publicHolidayArray = [
    {
        "date": "2021-01-01",
        "localName": "New Year’s Day",
        "name": "New Year’s Day",
        "countryCode": "SG",
    },
    {
        "date": "2021-02-12",
        "localName": "Chinese New Year",
        "name": "Chinese New Year",
        "countryCode": "SG",
    },
    {
        "date": "2021-02-13",
        "localName": "Chinese New Year",
        "name": "Chinese New Year",
        "countryCode": "SG",
    },
    {
        "date": "2021-04-02",
        "localName": "Good Friday",
        "name": "Good Friday",
        "countryCode": "SG",
    },
    {
        "date": "2021-05-01",
        "localName": "Labour Day",
        "name": "Labour Day",
        "countryCode": "SG",
    },
    {
        "date": "2021-08-09",
        "localName": "National Day",
        "name": "National Day",
        "countryCode": "SG",
    },
    {
        "date": "2021-12-25",
        "localName": "Christmas Day",
        "name": "Christmas Day",
        "countryCode": "SG",
    }
]

function sameDay(d1, d2) {
    return d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate();
}

exports.checkPH = function(date) {
    for (var i = 0; i < publicHolidayArray.length; i++) {
        if (sameDay(date, new Date(publicHolidayArray[i].date))) {
            return true;
        }
    }
    return false;
}