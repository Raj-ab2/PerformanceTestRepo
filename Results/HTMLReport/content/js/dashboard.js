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

    var data = {"OkPercent": 39.37823834196891, "KoPercent": 60.62176165803109};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.39378238341968913, 2000, 2500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 2000, 2500, "MyTeachers_DeactivateTeacher"], "isController": false}, {"data": [0.0, 2000, 2500, "MyTeachers_DeleteTeacher"], "isController": false}, {"data": [1.0, 2000, 2500, "MyTeachers_SubscriptionValidation"], "isController": false}, {"data": [1.0, 2000, 2500, "MyTeachers_SearchTeacher"], "isController": false}, {"data": [0.0, 2000, 2500, "MyTeachers_UpdateTeacher"], "isController": false}, {"data": [1.0, 2000, 2500, "MyTeachers_GetinactiveSchedules"], "isController": false}, {"data": [0.0, 2000, 2500, "MyTeachers_NewTeacherAvailabilty"], "isController": false}, {"data": [0.0, 2000, 2500, "MyTeachers_GetTeacherDetails"], "isController": false}, {"data": [0.0, 2000, 2500, "MyTeachers_activateTeacher"], "isController": false}, {"data": [0.0, 2000, 2500, "MyTeachers_GetTeacherAvailabilityDetails"], "isController": false}, {"data": [0.0, 2000, 2500, "MyTeachers_DeleteAvailability"], "isController": false}, {"data": [1.0, 2000, 2500, "GetAuthorizationToken"], "isController": false}, {"data": [1.0, 2000, 2500, "MyTeachers_GetactiveTeachers"], "isController": false}, {"data": [0.0, 2000, 2500, "MyTeachers_NewTeacher"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 193, 117, 60.62176165803109, 432.259067357513, 245, 1941, 271.0, 1220.9999999999998, 1392.6999999999996, 1779.3200000000004, 5.046543248614162, 6.38470760936356, 6.2877765548190565], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["MyTeachers_DeactivateTeacher", 13, 13, 100.0, 320.07692307692304, 248, 738, 271.0, 585.1999999999998, 738.0, 738.0, 0.5890082008064881, 0.3514492291921526, 0.751171290947397], "isController": false}, {"data": ["MyTeachers_DeleteTeacher", 13, 13, 100.0, 266.3076923076923, 245, 326, 259.0, 315.59999999999997, 326.0, 326.0, 0.5919045667713883, 0.3531774319309748, 0.7485067215316669], "isController": false}, {"data": ["MyTeachers_SubscriptionValidation", 13, 0, 0.0, 1380.4615384615383, 1206, 1941, 1335.0, 1774.1999999999998, 1941.0, 1941.0, 0.5262731762610315, 0.15315371731033922, 0.6778455438830864], "isController": false}, {"data": ["MyTeachers_SearchTeacher", 13, 0, 0.0, 279.53846153846155, 257, 394, 268.0, 353.19999999999993, 394.0, 394.0, 0.5512211668928086, 0.4650928595658073, 0.6954446738254749], "isController": false}, {"data": ["MyTeachers_UpdateTeacher", 13, 13, 100.0, 266.2307692307692, 245, 302, 257.0, 302.0, 302.0, 302.0, 0.5878097305118467, 0.3507341263112679, 1.0762676060318321], "isController": false}, {"data": ["MyTeachers_GetinactiveSchedules", 13, 0, 0.0, 272.9230769230769, 253, 409, 260.0, 354.19999999999993, 409.0, 409.0, 0.5510342488979315, 0.7647090380213633, 0.691442014242116], "isController": false}, {"data": ["MyTeachers_NewTeacherAvailabilty", 13, 13, 100.0, 266.2307692307692, 246, 315, 254.0, 315.0, 315.0, 315.0, 0.5775211017325633, 0.34459511050644154, 0.9079731924700133], "isController": false}, {"data": ["MyTeachers_GetTeacherDetails", 13, 13, 100.0, 265.1538461538462, 254, 290, 261.0, 285.6, 290.0, 290.0, 0.5788325392938243, 0.34537761866067057, 0.7195403290440359], "isController": false}, {"data": ["MyTeachers_activateTeacher", 13, 13, 100.0, 271.15384615384613, 248, 337, 263.0, 322.2, 337.0, 337.0, 0.5917429104647457, 0.35308097489644497, 0.7535031607037188], "isController": false}, {"data": ["MyTeachers_GetTeacherAvailabilityDetails", 13, 13, 100.0, 313.38461538461536, 249, 464, 263.0, 464.0, 464.0, 464.0, 0.5794775786752252, 0.34576250055719, 0.7288306114602835], "isController": false}, {"data": ["MyTeachers_DeleteAvailability", 13, 13, 100.0, 284.5384615384616, 252, 361, 260.0, 361.0, 361.0, 361.0, 0.5849795257166, 0.34904540059847905, 0.7437483828690996], "isController": false}, {"data": ["GetAuthorizationToken", 24, 0, 0.0, 378.29166666666663, 314, 1267, 329.5, 463.5, 1092.75, 1267.0, 2.6266827186166135, 5.263305276622524, 0.9248325831782861], "isController": false}, {"data": ["MyTeachers_GetactiveTeachers", 13, 0, 0.0, 1250.4615384615386, 1020, 1769, 1169.0, 1627.3999999999999, 1769.0, 1769.0, 0.5305905881392595, 3.8154134652667238, 0.6647528417207461], "isController": false}, {"data": ["MyTeachers_NewTeacher", 13, 13, 100.0, 282.53846153846155, 246, 429, 259.0, 385.79999999999995, 429.0, 429.0, 0.5534976795674202, 0.3302608224762635, 0.9972271895090902], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["400", 117, 100.0, 60.62176165803109], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 193, 117, "400", 117, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["MyTeachers_DeactivateTeacher", 13, 13, "400", 13, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["MyTeachers_DeleteTeacher", 13, 13, "400", 13, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["MyTeachers_UpdateTeacher", 13, 13, "400", 13, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["MyTeachers_NewTeacherAvailabilty", 13, 13, "400", 13, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["MyTeachers_GetTeacherDetails", 13, 13, "400", 13, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["MyTeachers_activateTeacher", 13, 13, "400", 13, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["MyTeachers_GetTeacherAvailabilityDetails", 13, 13, "400", 13, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["MyTeachers_DeleteAvailability", 13, 13, "400", 13, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["MyTeachers_NewTeacher", 13, 13, "400", 13, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
