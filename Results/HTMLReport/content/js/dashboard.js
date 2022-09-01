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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.43564356435643564, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "UpdateStudent"], "isController": false}, {"data": [0.0, 500, 1500, "CreateNewStudent"], "isController": false}, {"data": [0.825, 500, 1500, "GetStudentDetails"], "isController": false}, {"data": [0.0, 500, 1500, "GetactiveStudentDetails"], "isController": false}, {"data": [1.0, 500, 1500, "DeleteEnrollment"], "isController": false}, {"data": [0.0, 500, 1500, "GetinactiveStudentDetails"], "isController": false}, {"data": [0.5, 500, 1500, "CreateNewSchedule"], "isController": false}, {"data": [1.0, 500, 1500, "DeleteStudent"], "isController": false}, {"data": [0.75, 500, 1500, "GetAuthorizationToken"], "isController": false}, {"data": [0.5, 500, 1500, "CreateNewEnrollment"], "isController": false}, {"data": [0.5, 500, 1500, "DeleteSchedule"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 202, 0, 0.0, 3860.5544554455446, 266, 13091, 964.0, 11018.100000000013, 12220.75, 13044.11, 2.4799273209418815, 15.695352207994697, 3.5334000824084764], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["UpdateStudent", 20, 0, 0.0, 6633.250000000001, 5335, 8099, 6607.0, 7991.700000000001, 8094.65, 8099.0, 0.3662802410123986, 0.6374134662930608, 0.6620944590956541], "isController": false}, {"data": ["CreateNewStudent", 20, 0, 0.0, 6833.7, 5455, 9007, 6535.5, 8791.2, 8996.75, 9007.0, 0.37666911501591427, 0.6518141326251954, 0.6661599289978718], "isController": false}, {"data": ["GetStudentDetails", 20, 0, 0.0, 611.1499999999999, 283, 1292, 361.5, 1138.7, 1284.35, 1292.0, 0.4200709919976476, 0.7269197244334293, 0.5222171609502007], "isController": false}, {"data": ["GetactiveStudentDetails", 20, 0, 0.0, 10983.3, 8553, 13046, 10894.5, 12896.6, 13039.15, 13046.0, 0.4055725670715633, 10.636536638411778, 0.49547976699856017], "isController": false}, {"data": ["DeleteEnrollment", 20, 0, 0.0, 381.75000000000006, 293, 482, 399.0, 451.20000000000005, 480.54999999999995, 482.0, 0.4097856820882678, 0.24451079273040202, 0.5214362732041142], "isController": false}, {"data": ["GetinactiveStudentDetails", 20, 0, 0.0, 10597.9, 7929, 13091, 10380.0, 12926.300000000001, 13085.6, 13091.0, 0.3844822945903341, 9.212011797598908, 0.4704651514860241], "isController": false}, {"data": ["CreateNewSchedule", 20, 0, 0.0, 841.45, 667, 1089, 794.5, 1061.3000000000002, 1087.85, 1089.0, 0.4093327875562833, 0.8859016833810889, 0.7225283335038887], "isController": false}, {"data": ["DeleteStudent", 20, 0, 0.0, 397.05000000000007, 311, 494, 400.5, 489.8, 493.85, 494.0, 0.406512327486331, 0.7070297414581598, 0.5140951797800769], "isController": false}, {"data": ["GetAuthorizationToken", 2, 0, 0.0, 498.0, 266, 730, 498.0, 730.0, 730.0, 730.0, 1.9342359767891684, 3.8637496977756287, 0.6771714821083172], "isController": false}, {"data": ["CreateNewEnrollment", 20, 0, 0.0, 831.25, 566, 1102, 805.0, 1087.0000000000002, 1101.75, 1102.0, 0.41315485043794414, 0.6921352423669641, 0.627196499029086], "isController": false}, {"data": ["DeleteSchedule", 20, 0, 0.0, 831.0, 610, 1020, 838.5, 1006.6, 1019.35, 1020.0, 0.40769732550554466, 0.8808690896628344, 0.51798263719015], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 202, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
