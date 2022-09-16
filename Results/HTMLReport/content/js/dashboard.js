/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6907894736842105, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "MyClasses_GetGroupClassDetails"], "isController": false}, {"data": [1.0, 500, 1500, "MyClasses_UpdateOneonOneClass"], "isController": false}, {"data": [1.0, 500, 1500, "MyStudent_DeleteSchedule"], "isController": false}, {"data": [0.875, 500, 1500, "Reports_PartiallyPaidInvoices"], "isController": false}, {"data": [0.75, 500, 1500, "MyClasses_NewGroupClass"], "isController": false}, {"data": [1.0, 500, 1500, "MyStudent_GetStudentDetails"], "isController": false}, {"data": [1.0, 500, 1500, "MyStudent_DeleteEnrollment"], "isController": false}, {"data": [1.0, 500, 1500, "MyClasses_GetOneonOneClassDetails"], "isController": false}, {"data": [0.875, 500, 1500, "GetAuthorizationToken"], "isController": false}, {"data": [0.5, 500, 1500, "Reports_CancelledInvoices"], "isController": false}, {"data": [0.5, 500, 1500, "MyCalender_dayschedules"], "isController": false}, {"data": [1.0, 500, 1500, "MyClasses_DeleteGroupClass"], "isController": false}, {"data": [0.375, 500, 1500, "MyCalender_weekschedules"], "isController": false}, {"data": [0.25, 500, 1500, "MyStudent_CreateNewStudent"], "isController": false}, {"data": [1.0, 500, 1500, "MyStudent_CreateNewEnrollment"], "isController": false}, {"data": [0.25, 500, 1500, "MyStudent_UpdateStudent"], "isController": false}, {"data": [1.0, 500, 1500, "MyClasses_DeleteOneonOneClass"], "isController": false}, {"data": [0.25, 500, 1500, "MyClasses_GetactiveSchedules"], "isController": false}, {"data": [1.0, 500, 1500, "MyStudent_CreateNewSchedule"], "isController": false}, {"data": [0.625, 500, 1500, "Reports_OpenInvoices"], "isController": false}, {"data": [0.875, 500, 1500, "Reports_PaidInvoices"], "isController": false}, {"data": [0.0, 500, 1500, "MyStudent_GetinactiveStudentDetails"], "isController": false}, {"data": [1.0, 500, 1500, "MyClasses_UpdateGroupClass"], "isController": false}, {"data": [0.125, 500, 1500, "MyCalender_monthschedules"], "isController": false}, {"data": [0.875, 500, 1500, "Reports_OverdueInvoices"], "isController": false}, {"data": [0.5, 500, 1500, "MyClasses_GetinactiveSchedules"], "isController": false}, {"data": [1.0, 500, 1500, "MyClasses_NewOneonOneClass"], "isController": false}, {"data": [1.0, 500, 1500, "MyStudent_DeleteStudent"], "isController": false}, {"data": [0.0, 500, 1500, "MyStudent_GetactiveStudentDetails"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 76, 0, 0.0, 871.7631578947369, 261, 7327, 466.0, 1856.9999999999995, 2397.549999999996, 7327.0, 1.9840233905915523, 116.41412246123323, 2.6484407631963665], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["MyClasses_GetGroupClassDetails", 2, 0, 0.0, 268.0, 261, 275, 268.0, 275.0, 275.0, 275.0, 0.1447282726680657, 0.2705174940299587, 0.18331305629929806], "isController": false}, {"data": ["MyClasses_UpdateOneonOneClass", 2, 0, 0.0, 412.5, 406, 419, 412.5, 419.0, 419.0, 419.0, 0.15709685020815334, 0.31580455679051134, 0.27936851975492893], "isController": false}, {"data": ["MyStudent_DeleteSchedule", 2, 0, 0.0, 397.5, 388, 407, 397.5, 407.0, 407.0, 407.0, 0.1432870038687491, 0.3092424595214214, 0.18372640242155036], "isController": false}, {"data": ["Reports_PartiallyPaidInvoices", 4, 0, 0.0, 401.25, 280, 693, 316.0, 693.0, 693.0, 693.0, 0.3117206982543641, 4.704197148729738, 0.4182658587905237], "isController": false}, {"data": ["MyClasses_NewGroupClass", 2, 0, 0.0, 659.0, 357, 961, 659.0, 961.0, 961.0, 961.0, 0.13611924045463827, 0.25921144422514125, 0.2172058973660927], "isController": false}, {"data": ["MyStudent_GetStudentDetails", 2, 0, 0.0, 263.5, 261, 266, 263.5, 266.0, 266.0, 266.0, 0.14484356894553882, 0.2565173948073581, 0.18176170517091542], "isController": false}, {"data": ["MyStudent_DeleteEnrollment", 2, 0, 0.0, 262.5, 261, 264, 262.5, 264.0, 264.0, 264.0, 0.1445400014454, 0.08624408289369083, 0.18561533388740334], "isController": false}, {"data": ["MyClasses_GetOneonOneClassDetails", 2, 0, 0.0, 291.5, 270, 313, 291.5, 313.0, 313.0, 313.0, 0.1554122309425752, 0.3139357418991375, 0.19699714430025644], "isController": false}, {"data": ["GetAuthorizationToken", 4, 0, 0.0, 629.5, 289, 1440, 394.5, 1440.0, 1440.0, 1440.0, 1.563721657544957, 3.1499676260750586, 0.5478370553166537], "isController": false}, {"data": ["Reports_CancelledInvoices", 4, 0, 0.0, 853.0, 429, 1516, 733.5, 1516.0, 1516.0, 1516.0, 0.3004581987530985, 8.2939226460978, 0.4016867911064373], "isController": false}, {"data": ["MyCalender_dayschedules", 4, 0, 0.0, 787.25, 519, 1456, 587.0, 1456.0, 1456.0, 1456.0, 0.18959143046734286, 6.615518947293583, 0.24731128246753248], "isController": false}, {"data": ["MyClasses_DeleteGroupClass", 2, 0, 0.0, 377.0, 358, 396, 377.0, 396.0, 396.0, 396.0, 0.1497005988023952, 0.28755964633233533, 0.19195008420658682], "isController": false}, {"data": ["MyCalender_weekschedules", 4, 0, 0.0, 1132.75, 790, 1612, 1064.5, 1612.0, 1612.0, 1612.0, 0.19585761151642755, 30.78364275265632, 0.25548516072565247], "isController": false}, {"data": ["MyStudent_CreateNewStudent", 2, 0, 0.0, 1788.0, 1244, 2332, 1788.0, 2332.0, 2332.0, 2332.0, 0.12640626975097966, 0.22386500995449377, 0.22503772437112882], "isController": false}, {"data": ["MyStudent_CreateNewEnrollment", 2, 0, 0.0, 418.0, 377, 459, 418.0, 459.0, 459.0, 459.0, 0.1434617315831002, 0.23928968510149917, 0.21953567713937305], "isController": false}, {"data": ["MyStudent_UpdateStudent", 2, 0, 0.0, 1607.0, 1217, 1997, 1607.0, 1997.0, 1997.0, 1997.0, 0.13529968881071575, 0.24093650639291028, 0.24615558618590178], "isController": false}, {"data": ["MyClasses_DeleteOneonOneClass", 2, 0, 0.0, 384.0, 382, 386, 384.0, 386.0, 386.0, 386.0, 0.16051364365971107, 0.33521330758426965, 0.20581485754414125], "isController": false}, {"data": ["MyClasses_GetactiveSchedules", 2, 0, 0.0, 1210.5, 859, 1562, 1210.5, 1562.0, 1562.0, 1562.0, 0.12328936012822092, 3.7186069650782883, 0.1530281022685242], "isController": false}, {"data": ["MyStudent_CreateNewSchedule", 2, 0, 0.0, 388.0, 378, 398, 388.0, 398.0, 398.0, 398.0, 0.14336917562724014, 0.3087197580645161, 0.2548163082437276], "isController": false}, {"data": ["Reports_OpenInvoices", 4, 0, 0.0, 885.0, 432, 1662, 723.0, 1662.0, 1662.0, 1662.0, 0.2775464890369137, 7.772656900499583, 0.37620559256175407], "isController": false}, {"data": ["Reports_PaidInvoices", 4, 0, 0.0, 553.75, 408, 818, 494.5, 818.0, 818.0, 818.0, 0.3071253071253071, 6.896747710956696, 0.4091005067567568], "isController": false}, {"data": ["MyStudent_GetinactiveStudentDetails", 2, 0, 0.0, 1810.0, 1651, 1969, 1810.0, 1969.0, 1969.0, 1969.0, 0.12124886329190665, 1.1519234048196423, 0.14978497271900576], "isController": false}, {"data": ["MyClasses_UpdateGroupClass", 2, 0, 0.0, 384.0, 379, 389, 384.0, 389.0, 389.0, 389.0, 0.1459321415541773, 0.27839691262313027, 0.2340044691718351], "isController": false}, {"data": ["MyCalender_monthschedules", 4, 0, 0.0, 3351.25, 1347, 7327, 2365.5, 7327.0, 7327.0, 7327.0, 0.1943917966661807, 145.57102780106428, 0.25357308827817465], "isController": false}, {"data": ["Reports_OverdueInvoices", 4, 0, 0.0, 499.0, 394, 720, 441.0, 720.0, 720.0, 720.0, 0.30284675953967294, 4.467507263590249, 0.4045843428225318], "isController": false}, {"data": ["MyClasses_GetinactiveSchedules", 2, 0, 0.0, 725.5, 642, 809, 725.5, 809.0, 809.0, 809.0, 0.131397411470994, 3.966174405426713, 0.16334853984626502], "isController": false}, {"data": ["MyClasses_NewOneonOneClass", 2, 0, 0.0, 413.5, 396, 431, 413.5, 431.0, 431.0, 431.0, 0.15254366562428495, 0.3193882999008466, 0.26844109907711083], "isController": false}, {"data": ["MyStudent_DeleteStudent", 2, 0, 0.0, 281.0, 271, 291, 281.0, 291.0, 291.0, 291.0, 0.15308075009567548, 0.272450846727899, 0.19538724646000766], "isController": false}, {"data": ["MyStudent_GetactiveStudentDetails", 2, 0, 0.0, 2600.5, 1812, 3389, 2600.5, 3389.0, 3389.0, 3389.0, 0.10982976386600769, 3.147041031713344, 0.13546385914332784], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 76, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
