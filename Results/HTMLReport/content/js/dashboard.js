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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6388888888888888, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "MyClasses_GetGroupClassDetails"], "isController": false}, {"data": [1.0, 500, 1500, "MyClasses_UpdateOneonOneClass"], "isController": false}, {"data": [1.0, 500, 1500, "MyStudent_DeleteSchedule"], "isController": false}, {"data": [0.625, 500, 1500, "Reports_PartiallyPaidInvoices"], "isController": false}, {"data": [0.5, 500, 1500, "MyClasses_NewGroupClass"], "isController": false}, {"data": [1.0, 500, 1500, "MyStudent_GetStudentDetails"], "isController": false}, {"data": [1.0, 500, 1500, "MyStudent_DeleteEnrollment"], "isController": false}, {"data": [1.0, 500, 1500, "MyClasses_GetOneonOneClassDetails"], "isController": false}, {"data": [0.75, 500, 1500, "GetAuthorizationToken"], "isController": false}, {"data": [0.5, 500, 1500, "Reports_CancelledInvoices"], "isController": false}, {"data": [0.5, 500, 1500, "MyCalender_dayschedules"], "isController": false}, {"data": [1.0, 500, 1500, "MyClasses_DeleteGroupClass"], "isController": false}, {"data": [0.375, 500, 1500, "MyCalender_weekschedules"], "isController": false}, {"data": [0.25, 500, 1500, "MyStudent_CreateNewStudent"], "isController": false}, {"data": [1.0, 500, 1500, "MyClasses_DeleteOneonOneClass"], "isController": false}, {"data": [1.0, 500, 1500, "MyStudent_CreateNewEnrollment"], "isController": false}, {"data": [0.0, 500, 1500, "MyStudent_UpdateStudent"], "isController": false}, {"data": [1.0, 500, 1500, "MyStudent_CreateNewSchedule"], "isController": false}, {"data": [0.375, 500, 1500, "Reports_OpenInvoices"], "isController": false}, {"data": [0.75, 500, 1500, "Reports_PaidInvoices"], "isController": false}, {"data": [0.0, 500, 1500, "MyStudent_GetinactiveStudentDetails"], "isController": false}, {"data": [1.0, 500, 1500, "MyClasses_UpdateGroupClass"], "isController": false}, {"data": [0.125, 500, 1500, "MyCalender_monthschedules"], "isController": false}, {"data": [0.625, 500, 1500, "Reports_OverdueInvoices"], "isController": false}, {"data": [1.0, 500, 1500, "MyClasses_NewOneonOneClass"], "isController": false}, {"data": [1.0, 500, 1500, "MyStudent_DeleteStudent"], "isController": false}, {"data": [0.0, 500, 1500, "MyStudent_GetactiveStudentDetails"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 72, 0, 0.0, 1007.8472222222218, 266, 6757, 510.5, 2453.1000000000004, 2947.9499999999985, 6757.0, 2.8014474144974906, 166.2133237155169, 3.7300196247227735], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["MyClasses_GetGroupClassDetails", 2, 0, 0.0, 293.0, 272, 314, 293.0, 314.0, 314.0, 314.0, 0.6038647342995169, 1.1290029627113527, 0.757779476147343], "isController": false}, {"data": ["MyClasses_UpdateOneonOneClass", 2, 0, 0.0, 432.5, 407, 458, 432.5, 458.0, 458.0, 458.0, 0.5689900426742532, 1.1413140113798008, 1.0049008712660028], "isController": false}, {"data": ["MyStudent_DeleteSchedule", 2, 0, 0.0, 442.5, 422, 463, 442.5, 463.0, 463.0, 463.0, 0.17866714311238163, 0.386297905127747, 0.22699800116133642], "isController": false}, {"data": ["Reports_PartiallyPaidInvoices", 4, 0, 0.0, 984.7499999999999, 453, 2502, 492.0, 2502.0, 2502.0, 2502.0, 0.3172337219446427, 11.316011876437466, 0.4238044254104211], "isController": false}, {"data": ["MyClasses_NewGroupClass", 2, 0, 0.0, 1240.5, 409, 2072, 1240.5, 2072.0, 2072.0, 2072.0, 0.39138943248532293, 0.7455127813111545, 0.6197636374755381], "isController": false}, {"data": ["MyStudent_GetStudentDetails", 2, 0, 0.0, 270.5, 266, 275, 270.5, 275.0, 275.0, 275.0, 0.1810774105930285, 0.31334880036215484, 0.22510892937980986], "isController": false}, {"data": ["MyStudent_DeleteEnrollment", 2, 0, 0.0, 281.0, 275, 287, 281.0, 287.0, 287.0, 287.0, 0.1817190623296384, 0.10842807332364164, 0.23123040841359258], "isController": false}, {"data": ["MyClasses_GetOneonOneClassDetails", 2, 0, 0.0, 276.5, 271, 282, 276.5, 282.0, 282.0, 282.0, 0.5989817310572028, 1.2105397386942198, 0.7522368224019167], "isController": false}, {"data": ["GetAuthorizationToken", 4, 0, 0.0, 544.0, 337, 901, 469.0, 901.0, 901.0, 901.0, 1.7969451931716083, 3.59213555705301, 0.6299837151841869], "isController": false}, {"data": ["Reports_CancelledInvoices", 4, 0, 0.0, 1097.75, 452, 2315, 812.0, 2315.0, 2315.0, 2315.0, 0.30309918920966883, 8.374151085473972, 0.4034415965749792], "isController": false}, {"data": ["MyCalender_dayschedules", 4, 0, 0.0, 1029.0, 568, 1460, 1044.0, 1460.0, 1460.0, 1460.0, 0.2031075454453133, 12.33759330252869, 0.2637026188179141], "isController": false}, {"data": ["MyClasses_DeleteGroupClass", 2, 0, 0.0, 386.5, 383, 390, 386.5, 390.0, 390.0, 390.0, 0.5846243788365975, 1.1244313614440222, 0.7427698406898569], "isController": false}, {"data": ["MyCalender_weekschedules", 4, 0, 0.0, 1395.5, 590, 3115, 938.5, 3115.0, 3115.0, 3115.0, 0.21114864864864866, 45.95457540976035, 0.27414270349451014], "isController": false}, {"data": ["MyStudent_CreateNewStudent", 2, 0, 0.0, 1874.0, 1409, 2339, 1874.0, 2339.0, 2339.0, 2339.0, 0.15245064410397136, 0.26381107553929417, 0.26961730124247274], "isController": false}, {"data": ["MyClasses_DeleteOneonOneClass", 2, 0, 0.0, 400.5, 400, 401, 400.5, 401.0, 401.0, 401.0, 0.5701254275940707, 1.1931433509122007, 0.7243488098631699], "isController": false}, {"data": ["MyStudent_CreateNewEnrollment", 2, 0, 0.0, 406.5, 398, 415, 406.5, 415.0, 415.0, 415.0, 0.17908309455587393, 0.299579434545129, 0.2718600297725645], "isController": false}, {"data": ["MyStudent_UpdateStudent", 2, 0, 0.0, 2279.5, 1701, 2858, 2279.5, 2858.0, 2858.0, 2858.0, 0.1610305958132045, 0.28023097826086957, 0.291081672705314], "isController": false}, {"data": ["MyStudent_CreateNewSchedule", 2, 0, 0.0, 424.5, 415, 434, 424.5, 434.0, 434.0, 434.0, 0.17877893984088675, 0.386888799499419, 0.3155692712523465], "isController": false}, {"data": ["Reports_OpenInvoices", 4, 0, 0.0, 986.5, 530, 1826, 795.0, 1826.0, 1826.0, 1826.0, 0.2826855123674912, 7.93417347614841, 0.3815150176678445], "isController": false}, {"data": ["Reports_PaidInvoices", 4, 0, 0.0, 541.0, 415, 703, 523.0, 703.0, 703.0, 703.0, 0.3038359285985568, 6.018636654956324, 0.4029386631219142], "isController": false}, {"data": ["MyStudent_GetinactiveStudentDetails", 2, 0, 0.0, 2478.5, 2113, 2844, 2478.5, 2844.0, 2844.0, 2844.0, 0.1374192661811186, 3.2922918527552563, 0.16815072316888827], "isController": false}, {"data": ["MyClasses_UpdateGroupClass", 2, 0, 0.0, 401.0, 381, 421, 401.0, 421.0, 421.0, 421.0, 0.584966364434045, 1.114235247879497, 0.9308620027785902], "isController": false}, {"data": ["MyCalender_monthschedules", 4, 0, 0.0, 3196.5, 1100, 6757, 2464.5, 6757.0, 6757.0, 6757.0, 0.19559902200489, 121.70857846882642, 0.25395400366748166], "isController": false}, {"data": ["Reports_OverdueInvoices", 4, 0, 0.0, 565.75, 435, 695, 566.5, 695.0, 695.0, 695.0, 0.3117449925960564, 4.48985854570961, 0.41464519523030163], "isController": false}, {"data": ["MyClasses_NewOneonOneClass", 2, 0, 0.0, 455.0, 435, 475, 455.0, 475.0, 475.0, 475.0, 0.5707762557077625, 1.1956201840753424, 0.997464950770548], "isController": false}, {"data": ["MyStudent_DeleteStudent", 2, 0, 0.0, 300.5, 285, 316, 300.5, 316.0, 316.0, 316.0, 0.20249063480814014, 0.3521834185481421, 0.2560794649184975], "isController": false}, {"data": ["MyStudent_GetactiveStudentDetails", 2, 0, 0.0, 2958.0, 2254, 3662, 2958.0, 3662.0, 3662.0, 3662.0, 0.12421588721197441, 3.2569065974163096, 0.15175202627166015], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 72, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
