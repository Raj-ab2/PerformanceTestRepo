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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5694444444444444, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.25, 500, 1500, "UpdateStudent"], "isController": false}, {"data": [1.0, 500, 1500, "GetStudentDetails"], "isController": false}, {"data": [0.25, 500, 1500, "GetactiveStudentDetails"], "isController": false}, {"data": [1.0, 500, 1500, "DeleteEnrollment"], "isController": false}, {"data": [0.375, 500, 1500, "Getweekschedules"], "isController": false}, {"data": [0.0, 500, 1500, "GetinactiveStudentDetails"], "isController": false}, {"data": [1.0, 500, 1500, "CreateNewSchedule"], "isController": false}, {"data": [0.75, 500, 1500, "DeleteSchedule"], "isController": false}, {"data": [0.5, 500, 1500, "CreateNewStudent"], "isController": false}, {"data": [0.25, 500, 1500, "Getmonthschedules"], "isController": false}, {"data": [0.75, 500, 1500, "DeleteStudent"], "isController": false}, {"data": [0.875, 500, 1500, "GetAuthorizationToken"], "isController": false}, {"data": [0.75, 500, 1500, "CreateNewEnrollment"], "isController": false}, {"data": [0.5, 500, 1500, "Getdayschedules"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 36, 0, 0.0, 1056.8055555555557, 324, 4582, 837.5, 1904.5000000000005, 3344.399999999998, 4582.0, 1.6969925520882436, 191.04258243377015, 2.153924737201848], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["UpdateStudent", 2, 0, 0.0, 1356.0, 1165, 1547, 1356.0, 1547.0, 1547.0, 1547.0, 0.19890601690701143, 0.3461430880159125, 0.35954593485827946], "isController": false}, {"data": ["GetStudentDetails", 2, 0, 0.0, 390.0, 324, 456, 390.0, 456.0, 456.0, 456.0, 0.21244954323348203, 0.36763729551731467, 0.26410963724240494], "isController": false}, {"data": ["GetactiveStudentDetails", 2, 0, 0.0, 2198.5, 1271, 3126, 2198.5, 3126.0, 3126.0, 3126.0, 0.17006802721088435, 4.45980149872449, 0.2077686543367347], "isController": false}, {"data": ["DeleteEnrollment", 2, 0, 0.0, 335.0, 325, 345, 335.0, 345.0, 345.0, 345.0, 0.21654395842355997, 0.12920738144218274, 0.27554372834560414], "isController": false}, {"data": ["Getweekschedules", 4, 0, 0.0, 1041.25, 645, 1519, 1000.5, 1519.0, 1519.0, 1519.0, 0.2795638803466592, 57.33004754770059, 0.3629689247274252], "isController": false}, {"data": ["GetinactiveStudentDetails", 2, 0, 0.0, 1700.0, 1527, 1873, 1700.0, 1873.0, 1873.0, 1873.0, 0.19036740909956215, 4.5600802517608985, 0.2329398082048353], "isController": false}, {"data": ["CreateNewSchedule", 2, 0, 0.0, 455.0, 445, 465, 455.0, 465.0, 465.0, 465.0, 0.21152829190904282, 0.4569341618191433, 0.37337635510312006], "isController": false}, {"data": ["DeleteSchedule", 2, 0, 0.0, 475.0, 436, 514, 475.0, 514.0, 514.0, 514.0, 0.21220159151193635, 0.45869943633952254, 0.26960377984084877], "isController": false}, {"data": ["CreateNewStudent", 2, 0, 0.0, 1307.5, 1297, 1318, 1307.5, 1318.0, 1318.0, 1318.0, 0.19462826002335537, 0.3367981218372908, 0.34421072158427407], "isController": false}, {"data": ["Getmonthschedules", 4, 0, 0.0, 2250.25, 1189, 4582, 1615.0, 4582.0, 4582.0, 4582.0, 0.27212735560242196, 192.60484609922443, 0.3533137883529492], "isController": false}, {"data": ["DeleteStudent", 2, 0, 0.0, 572.5, 330, 815, 572.5, 815.0, 815.0, 815.0, 0.22629554197782303, 0.3935862893188505, 0.2861843035754696], "isController": false}, {"data": ["GetAuthorizationToken", 4, 0, 0.0, 628.75, 362, 1332, 410.5, 1332.0, 1332.0, 1332.0, 1.5037593984962407, 3.006050281954887, 0.5271968984962405], "isController": false}, {"data": ["CreateNewEnrollment", 2, 0, 0.0, 462.5, 423, 502, 462.5, 502.0, 502.0, 502.0, 0.21026072329688814, 0.35173497949957944, 0.3191897405908326], "isController": false}, {"data": ["Getdayschedules", 4, 0, 0.0, 965.0, 567, 1490, 901.5, 1490.0, 1490.0, 1490.0, 0.26395671109937974, 17.55215464976244, 0.34270551504553254], "isController": false}]}, function(index, item){
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
