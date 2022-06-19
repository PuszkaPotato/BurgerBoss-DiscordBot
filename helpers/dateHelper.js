/**
 * Convert date range to format that can be handled by SQL
 * 
 * @param @required startDate
 * @param endDate
 * 
 */

function ConvertDateRange(startDate, endDate = null)
{
    var startDateString = startDate;

    var startDate = startDate.split("/");

    var startDateObject = new Date(`${startDate[1]}/${startDate[0]}/${startDate[2]}`).setHours(02, 00, 00);
    
    
    if(!(endDate instanceof Date) && endDate != null)
    {
        var endDateString = endDate;

        var endDate = endDate.split("/");

        var endDateObject = new Date(`${endDate[1]}/${endDate[0]}/${endDate[2]}`).setHours(25,59,59);
    } else {
        var endDateObject = new Date().setHours(25,59,59);

        var endDateString = new Date();
        
        var endDateString = `${endDateString.getDate()}/0${endDateString.getMonth()+1}/${endDateString.getFullYear()}`;
    }

    //We need to re-create date Object, should be done with a function in future
    var dateRange = {
        'startDate' : startDateObject,
        'endDate' : endDateObject,
        'startDateString' : startDateString,
        'endDateString' : endDateString,
    }

    return dateRange;
}

module.exports = {ConvertDateRange};