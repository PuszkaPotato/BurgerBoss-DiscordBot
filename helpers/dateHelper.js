/**
 * BurgerBoss is a Discord Bot to help manage a business on FiveM RP server
 *  Copyright (C) 2022 - Michał Kołodziej (CanExiOne)
 * 
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of the GNU General Public License v3 as published by
 *   the Free Software Foundation.
 *
 *   This program is distributed in the hope that it will be useful,
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *   GNU General Public License for more details.
 *
 *   You should have received a copy of the GNU General Public License
 *   along with this program.  If not, see <https://www.gnu.org/licenses/>.
 * 
 * 	You can contact original owner of this software on github or by e-mail
 * 
 *  @github https://github.com/CanExiOne
 * 	@email canexione@gmail.com
 */

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