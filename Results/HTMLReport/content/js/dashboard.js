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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6111111111111112, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.375, 500, 1500, "MyCalender_weekschedules"], "isController": false}, {"data": [0.5, 500, 1500, "MyStudent_CreateNewStudent"], "isController": false}, {"data": [0.75, 500, 1500, "MyStudent_CreateNewEnrollment"], "isController": false}, {"data": [0.25, 500, 1500, "MyStudent_UpdateStudent"], "isController": false}, {"data": [0.75, 500, 1500, "MyStudent_CreateNewSchedule"], "isController": false}, {"data": [1.0, 500, 1500, "MyStudent_DeleteSchedule"], "isController": false}, {"data": [0.5, 500, 1500, "MyStudent_GetinactiveStudentDetails"], "isController": false}, {"data": [0.25, 500, 1500, "MyCalender_monthschedules"], "isController": false}, {"data": [1.0, 500, 1500, "MyStudent_GetStudentDetails"], "isController": false}, {"data": [1.0, 500, 1500, "MyStudent_DeleteEnrollment"], "isController": false}, {"data": [0.875, 500, 1500, "GetAuthorizationToken"], "isController": false}, {"data": [0.5, 500, 1500, "MyCalender_dayschedules"], "isController": false}, {"data": [1.0, 500, 1500, "MyStudent_DeleteStudent"], "isController": false}, {"data": [0.25, 500, 1500, "MyStudent_GetactiveStudentDetails"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 36, 0, 0.0, 1013.8888888888888, 308, 3982, 824.5, 1848.6000000000001, 3087.7999999999984, 3982.0, 1.800720288115246, 202.77593459258702, 2.285582201630652], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["MyCalender_weekschedules", 4, 0, 0.0, 1087.75, 645, 1885, 910.5, 1885.0, 1885.0, 1885.0, 0.2881429188877684, 59.15392628493733, 0.3741074322864141], "isController": false}, {"data": ["MyStudent_CreateNewStudent", 2, 0, 0.0, 1234.0, 1174, 1294, 1234.0, 1294.0, 1294.0, 1294.0, 0.21008403361344538, 0.3635438550420168, 0.3715451024159664], "isController": false}, {"data": ["MyStudent_CreateNewEnrollment", 2, 0, 0.0, 637.0, 461, 813, 637.0, 813.0, 813.0, 813.0, 0.2303351376252447, 0.38610377317747324, 0.34966403460785445], "isController": false}, {"data": ["MyStudent_UpdateStudent", 2, 0, 0.0, 1379.5, 1206, 1553, 1379.5, 1553.0, 1553.0, 1553.0, 0.21941854086670323, 0.38183968732857926, 0.3966247257268239], "isController": false}, {"data": ["MyStudent_CreateNewSchedule", 2, 0, 0.0, 486.0, 464, 508, 486.0, 508.0, 508.0, 508.0, 0.23874895547331978, 0.5157350483466634, 0.42142454786916556], "isController": false}, {"data": ["MyStudent_DeleteSchedule", 2, 0, 0.0, 441.0, 440, 442, 441.0, 442.0, 442.0, 442.0, 0.23943493355680592, 0.516749221836466, 0.3042039536693404], "isController": false}, {"data": ["MyStudent_GetinactiveStudentDetails", 2, 0, 0.0, 1462.0, 1440, 1484, 1462.0, 1484.0, 1484.0, 1484.0, 0.20350020350020348, 4.874664542633293, 0.24900952635327636], "isController": false}, {"data": ["MyCalender_monthschedules", 4, 0, 0.0, 2078.75, 1135, 3982, 1599.0, 3982.0, 3982.0, 3982.0, 0.2775850104094379, 196.45991011016656, 0.3603996790423317], "isController": false}, {"data": ["MyStudent_GetStudentDetails", 2, 0, 0.0, 310.5, 308, 313, 310.5, 313.0, 313.0, 313.0, 0.23435669088352473, 0.4055469299273494, 0.29134381591281927], "isController": false}, {"data": ["MyStudent_DeleteEnrollment", 2, 0, 0.0, 317.0, 316, 318, 317.0, 318.0, 318.0, 318.0, 0.24310198128114743, 0.1450540142214659, 0.3093377750091163], "isController": false}, {"data": ["GetAuthorizationToken", 4, 0, 0.0, 605.0, 315, 1447, 329.0, 1447.0, 1447.0, 1447.0, 1.6306563391765185, 3.25972024052181, 0.5716851814105177], "isController": false}, {"data": ["MyCalender_dayschedules", 4, 0, 0.0, 981.0, 620, 1428, 938.0, 1428.0, 1428.0, 1428.0, 0.2727582679849983, 18.160200200306853, 0.3541329270371633], "isController": false}, {"data": ["MyStudent_DeleteStudent", 2, 0, 0.0, 351.0, 324, 378, 351.0, 378.0, 378.0, 378.0, 0.25361399949277197, 0.44110012997717474, 0.3207325481866599], "isController": false}, {"data": ["MyStudent_GetactiveStudentDetails", 2, 0, 0.0, 2127.0, 1324, 2930, 2127.0, 2930.0, 2930.0, 2930.0, 0.17669405424507467, 4.633559998674794, 0.21586353697323082], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 36, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
