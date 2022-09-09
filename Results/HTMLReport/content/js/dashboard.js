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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5178571428571429, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.375, 500, 1500, "MyCalender_weekschedules"], "isController": false}, {"data": [0.25, 500, 1500, "MyStudent_CreateNewStudent"], "isController": false}, {"data": [0.5, 500, 1500, "MyStudent_CreateNewEnrollment"], "isController": false}, {"data": [0.25, 500, 1500, "MyStudent_UpdateStudent"], "isController": false}, {"data": [0.75, 500, 1500, "MyStudent_CreateNewSchedule"], "isController": false}, {"data": [0.375, 500, 1500, "Reports_OpenInvoices"], "isController": false}, {"data": [0.5, 500, 1500, "MyStudent_DeleteSchedule"], "isController": false}, {"data": [0.0, 500, 1500, "MyStudent_GetinactiveStudentDetails"], "isController": false}, {"data": [0.625, 500, 1500, "Reports_PaidInvoices"], "isController": false}, {"data": [0.625, 500, 1500, "Reports_PartiallyPaidInvoices"], "isController": false}, {"data": [0.125, 500, 1500, "MyCalender_monthschedules"], "isController": false}, {"data": [0.75, 500, 1500, "Reports_OverdueInvoices"], "isController": false}, {"data": [1.0, 500, 1500, "MyStudent_GetStudentDetails"], "isController": false}, {"data": [1.0, 500, 1500, "MyStudent_DeleteEnrollment"], "isController": false}, {"data": [0.875, 500, 1500, "GetAuthorizationToken"], "isController": false}, {"data": [0.5, 500, 1500, "Reports_CancelledInvoices"], "isController": false}, {"data": [0.375, 500, 1500, "MyCalender_dayschedules"], "isController": false}, {"data": [1.0, 500, 1500, "MyStudent_DeleteStudent"], "isController": false}, {"data": [0.0, 500, 1500, "MyStudent_GetactiveStudentDetails"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 56, 0, 0.0, 1030.5178571428573, 317, 4998, 696.5, 1992.1000000000006, 2858.45, 4998.0, 2.41597998188015, 191.81037388368784, 3.122859727555115], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["MyCalender_weekschedules", 4, 0, 0.0, 1280.25, 650, 2831, 820.0, 2831.0, 2831.0, 2831.0, 0.251414204902577, 52.96700679604022, 0.3264210795097423], "isController": false}, {"data": ["MyStudent_CreateNewStudent", 2, 0, 0.0, 1470.5, 1351, 1590, 1470.5, 1590.0, 1590.0, 1590.0, 0.1699668564629897, 0.2941223336449392, 0.30059568071726017], "isController": false}, {"data": ["MyStudent_CreateNewEnrollment", 2, 0, 0.0, 605.0, 573, 637, 605.0, 637.0, 637.0, 637.0, 0.18456995201181248, 0.30875813261351054, 0.28018944375230714], "isController": false}, {"data": ["MyStudent_UpdateStudent", 2, 0, 0.0, 1659.0, 1489, 1829, 1659.0, 1829.0, 1829.0, 1829.0, 0.17667844522968196, 0.30746190371024734, 0.3193669942579505], "isController": false}, {"data": ["MyStudent_CreateNewSchedule", 2, 0, 0.0, 579.5, 462, 697, 579.5, 697.0, 697.0, 697.0, 0.1864454181038501, 0.403115386408129, 0.3291016535378018], "isController": false}, {"data": ["Reports_OpenInvoices", 4, 0, 0.0, 1108.75, 632, 2088, 857.5, 2088.0, 2088.0, 2088.0, 0.3044371717786742, 8.159005394246138, 0.4108712611309841], "isController": false}, {"data": ["MyStudent_DeleteSchedule", 2, 0, 0.0, 626.5, 557, 696, 626.5, 696.0, 696.0, 696.0, 0.1888930865130336, 0.4080385814129203, 0.2399901421420476], "isController": false}, {"data": ["MyStudent_GetinactiveStudentDetails", 2, 0, 0.0, 1717.5, 1647, 1788, 1717.5, 1788.0, 1788.0, 1788.0, 0.16578249336870027, 3.9718182713030505, 0.2028568986240053], "isController": false}, {"data": ["Reports_PaidInvoices", 4, 0, 0.0, 586.25, 454, 800, 545.5, 800.0, 800.0, 800.0, 0.341646737273659, 6.73517840365562, 0.4530822941578408], "isController": false}, {"data": ["Reports_PartiallyPaidInvoices", 4, 0, 0.0, 693.0, 424, 951, 698.5, 951.0, 951.0, 951.0, 0.3441156228492773, 12.000948334265313, 0.45971696490020647], "isController": false}, {"data": ["MyCalender_monthschedules", 4, 0, 0.0, 2425.0, 1196, 4998, 1753.0, 4998.0, 4998.0, 4998.0, 0.24050024050024052, 166.01597729527415, 0.31225104467291964], "isController": false}, {"data": ["Reports_OverdueInvoices", 4, 0, 0.0, 526.25, 479, 634, 496.0, 634.0, 634.0, 634.0, 0.34231921266581083, 4.685828519469405, 0.455311296534018], "isController": false}, {"data": ["MyStudent_GetStudentDetails", 2, 0, 0.0, 328.0, 317, 339, 328.0, 339.0, 339.0, 339.0, 0.1901863826550019, 0.3291115918600228, 0.2364328760935717], "isController": false}, {"data": ["MyStudent_DeleteEnrollment", 2, 0, 0.0, 348.0, 318, 378, 348.0, 378.0, 378.0, 378.0, 0.19590557351356647, 0.11689287638358312, 0.24928218973454797], "isController": false}, {"data": ["GetAuthorizationToken", 4, 0, 0.0, 624.0, 348, 1400, 374.0, 1400.0, 1400.0, 1400.0, 1.5698587127158556, 3.1381843602825743, 0.5503703885400314], "isController": false}, {"data": ["Reports_CancelledInvoices", 4, 0, 0.0, 944.5, 461, 1852, 732.5, 1852.0, 1852.0, 1852.0, 0.34147174321324913, 9.443244328367765, 0.4545175644527915], "isController": false}, {"data": ["MyCalender_dayschedules", 4, 0, 0.0, 1099.0, 535, 1772, 1044.5, 1772.0, 1772.0, 1772.0, 0.23482446870963955, 12.664755507367618, 0.3048819640131502], "isController": false}, {"data": ["MyStudent_DeleteStudent", 2, 0, 0.0, 339.5, 338, 341, 339.5, 341.0, 341.0, 341.0, 0.20347949944043137, 0.3539033090853596, 0.25733003103062363], "isController": false}, {"data": ["MyStudent_GetactiveStudentDetails", 2, 0, 0.0, 2607.0, 2200, 3014, 2607.0, 3014.0, 3014.0, 3014.0, 0.15047776690993905, 3.9465880341960724, 0.1838356312542322], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 56, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
