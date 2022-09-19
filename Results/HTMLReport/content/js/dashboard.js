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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7796610169491526, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Feedback_CreateNewFeedback"], "isController": false}, {"data": [1.0, 500, 1500, "Courses_GetCourseDetails"], "isController": false}, {"data": [1.0, 500, 1500, "MyClasses_GetGroupClassDetails"], "isController": false}, {"data": [1.0, 500, 1500, "Feedback_GetinactiveFeedbacks"], "isController": false}, {"data": [1.0, 500, 1500, "MyStudent_DeleteSchedule"], "isController": false}, {"data": [1.0, 500, 1500, "Invoice_SendInvoice"], "isController": false}, {"data": [1.0, 500, 1500, "MyStudent_GetStudentDetails"], "isController": false}, {"data": [1.0, 500, 1500, "MyClasses_GetOneonOneClassDetails"], "isController": false}, {"data": [0.875, 500, 1500, "GetAuthorizationToken"], "isController": false}, {"data": [0.625, 500, 1500, "MyCalender_dayschedules"], "isController": false}, {"data": [1.0, 500, 1500, "MyClasses_DeleteGroupClass"], "isController": false}, {"data": [0.25, 500, 1500, "MyCalender_weekschedules"], "isController": false}, {"data": [1.0, 500, 1500, "Feedback_UpdateFeedbackKPI"], "isController": false}, {"data": [0.25, 500, 1500, "MyClasses_GetactiveSchedules"], "isController": false}, {"data": [0.625, 500, 1500, "Reports_OpenInvoices"], "isController": false}, {"data": [0.25, 500, 1500, "MyStudent_GetinactiveStudentDetails"], "isController": false}, {"data": [1.0, 500, 1500, "Feedback_GetFeedbackDetails"], "isController": false}, {"data": [0.125, 500, 1500, "MyCalender_monthschedules"], "isController": false}, {"data": [0.5, 500, 1500, "MyClasses_GetinactiveSchedules"], "isController": false}, {"data": [1.0, 500, 1500, "Courses_UpdateCourse"], "isController": false}, {"data": [0.75, 500, 1500, "MyClasses_NewOneonOneClass"], "isController": false}, {"data": [1.0, 500, 1500, "Feedback_CreateNewFeedbackKPI"], "isController": false}, {"data": [1.0, 500, 1500, "Feedback_DeleteFeedback"], "isController": false}, {"data": [1.0, 500, 1500, "MyStudent_DeleteStudent"], "isController": false}, {"data": [0.0, 500, 1500, "MyStudent_GetactiveStudentDetails"], "isController": false}, {"data": [1.0, 500, 1500, "MyClasses_UpdateOneonOneClass"], "isController": false}, {"data": [0.875, 500, 1500, "Reports_PartiallyPaidInvoices"], "isController": false}, {"data": [1.0, 500, 1500, "MyClasses_NewGroupClass"], "isController": false}, {"data": [0.75, 500, 1500, "Courses_GetactiveCourses"], "isController": false}, {"data": [1.0, 500, 1500, "MyStudent_DeleteEnrollment"], "isController": false}, {"data": [1.0, 500, 1500, "Feedback_UpdateFeedback"], "isController": false}, {"data": [1.0, 500, 1500, "Courses_CreateNewCourse"], "isController": false}, {"data": [1.0, 500, 1500, "Invoice_GetInvoiceDetails"], "isController": false}, {"data": [1.0, 500, 1500, "Invoice_PrintInvoice"], "isController": false}, {"data": [0.625, 500, 1500, "Reports_CancelledInvoices"], "isController": false}, {"data": [1.0, 500, 1500, "Courses_DeleteCourse"], "isController": false}, {"data": [1.0, 500, 1500, "Invoice_UpdateInvoice"], "isController": false}, {"data": [0.25, 500, 1500, "MyStudent_CreateNewStudent"], "isController": false}, {"data": [1.0, 500, 1500, "MyStudent_CreateNewEnrollment"], "isController": false}, {"data": [0.75, 500, 1500, "MyClasses_DeleteOneonOneClass"], "isController": false}, {"data": [0.25, 500, 1500, "MyStudent_UpdateStudent"], "isController": false}, {"data": [0.75, 500, 1500, "MyStudent_CreateNewSchedule"], "isController": false}, {"data": [1.0, 500, 1500, "Invoice_CreateNewInvoice"], "isController": false}, {"data": [0.75, 500, 1500, "Reports_PaidInvoices"], "isController": false}, {"data": [1.0, 500, 1500, "MyClasses_UpdateGroupClass"], "isController": false}, {"data": [1.0, 500, 1500, "Invoice_ReceivePaymentInvoice"], "isController": false}, {"data": [0.625, 500, 1500, "Reports_OverdueInvoices"], "isController": false}, {"data": [0.75, 500, 1500, "Feedback_GetactiveFeedbacks"], "isController": false}, {"data": [1.0, 500, 1500, "Courses_GetinactiveCourses"], "isController": false}, {"data": [1.0, 500, 1500, "Feedback_DeleteFeedbackKPI"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 118, 0, 0.0, 690.3644067796608, 236, 8894, 383.0, 1519.2000000000007, 2008.1999999999994, 7827.720000000013, 2.5505792841085944, 107.36682409648971, 3.4110451701106688], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Feedback_CreateNewFeedback", 2, 0, 0.0, 279.5, 261, 298, 279.5, 298.0, 298.0, 298.0, 0.7504690431519699, 0.6603248123827392, 1.004045497185741], "isController": false}, {"data": ["Courses_GetCourseDetails", 2, 0, 0.0, 250.0, 250, 250, 250.0, 250.0, 250.0, 250.0, 0.9583133684714902, 1.702784349544801, 1.209121945376138], "isController": false}, {"data": ["MyClasses_GetGroupClassDetails", 2, 0, 0.0, 264.5, 260, 269, 264.5, 269.0, 269.0, 269.0, 0.14663831659212553, 0.2739444332429064, 0.18573232091795588], "isController": false}, {"data": ["Feedback_GetinactiveFeedbacks", 2, 0, 0.0, 261.5, 259, 264, 261.5, 264.0, 264.0, 264.0, 0.7601672367920943, 0.6354522995058913, 0.9435278886354999], "isController": false}, {"data": ["MyStudent_DeleteSchedule", 2, 0, 0.0, 396.0, 387, 405, 396.0, 405.0, 405.0, 405.0, 0.11006548896593472, 0.236683795608387, 0.1411288935666722], "isController": false}, {"data": ["Invoice_SendInvoice", 2, 0, 0.0, 263.5, 259, 268, 263.5, 268.0, 268.0, 268.0, 0.11087703736556159, 0.07243822070074288, 0.14325226604945115], "isController": false}, {"data": ["MyStudent_GetStudentDetails", 2, 0, 0.0, 253.5, 253, 254, 253.5, 254.0, 254.0, 254.0, 0.10854816824966079, 0.19223838195386703, 0.13621523066485752], "isController": false}, {"data": ["MyClasses_GetOneonOneClassDetails", 2, 0, 0.0, 264.5, 263, 266, 264.5, 266.0, 266.0, 266.0, 0.15998720102391809, 0.3230210333173346, 0.20279627629789618], "isController": false}, {"data": ["GetAuthorizationToken", 4, 0, 0.0, 495.5, 259, 1126, 298.5, 1126.0, 1126.0, 1126.0, 1.9559902200488997, 3.9401551039119806, 0.6852651283618583], "isController": false}, {"data": ["MyCalender_dayschedules", 4, 0, 0.0, 779.25, 476, 1480, 580.5, 1480.0, 1480.0, 1480.0, 0.1690045631232043, 6.312419458762887, 0.2204568800701369], "isController": false}, {"data": ["MyClasses_DeleteGroupClass", 2, 0, 0.0, 372.5, 362, 383, 372.5, 383.0, 383.0, 383.0, 0.15150367396409362, 0.29102317059313687, 0.19426203507310053], "isController": false}, {"data": ["MyCalender_weekschedules", 4, 0, 0.0, 1320.25, 648, 2360, 1136.5, 2360.0, 2360.0, 2360.0, 0.17518503919765252, 33.00492981649367, 0.22851896104322691], "isController": false}, {"data": ["Feedback_UpdateFeedbackKPI", 2, 0, 0.0, 264.5, 263, 266, 264.5, 266.0, 266.0, 266.0, 0.7513148009015778, 0.5928343350864013, 1.019117439894816], "isController": false}, {"data": ["MyClasses_GetactiveSchedules", 2, 0, 0.0, 1199.0, 812, 1586, 1199.0, 1586.0, 1586.0, 1586.0, 0.12863390789812196, 3.8814402374903523, 0.15966181341651658], "isController": false}, {"data": ["Reports_OpenInvoices", 4, 0, 0.0, 928.25, 453, 1442, 909.0, 1442.0, 1442.0, 1442.0, 0.27689325764917627, 7.9610191618787205, 0.37532015782915684], "isController": false}, {"data": ["MyStudent_GetinactiveStudentDetails", 2, 0, 0.0, 1684.5, 1372, 1997, 1684.5, 1997.0, 1997.0, 1997.0, 0.09446884889707619, 0.8975001918898493, 0.11670224009257947], "isController": false}, {"data": ["Feedback_GetFeedbackDetails", 2, 0, 0.0, 255.5, 255, 256, 255.5, 256.0, 256.0, 256.0, 0.7538635506973238, 0.7693236430456087, 0.9496913871089333], "isController": false}, {"data": ["MyCalender_monthschedules", 4, 0, 0.0, 3755.25, 1210, 8894, 2458.5, 8894.0, 8894.0, 8894.0, 0.1781102502449016, 143.8759469064476, 0.23233473316858136], "isController": false}, {"data": ["MyClasses_GetinactiveSchedules", 2, 0, 0.0, 743.0, 693, 793, 743.0, 793.0, 793.0, 793.0, 0.13757996835660727, 4.141707904829056, 0.17103447238082134], "isController": false}, {"data": ["Courses_UpdateCourse", 2, 0, 0.0, 363.5, 282, 445, 363.5, 445.0, 445.0, 445.0, 0.9433962264150944, 1.6795032429245282, 1.6011939858490565], "isController": false}, {"data": ["MyClasses_NewOneonOneClass", 2, 0, 0.0, 454.0, 391, 517, 454.0, 517.0, 517.0, 517.0, 0.1539882968894364, 0.32173629022944256, 0.2709833115183246], "isController": false}, {"data": ["Feedback_CreateNewFeedbackKPI", 2, 0, 0.0, 266.0, 264, 268, 266.0, 268.0, 268.0, 268.0, 0.7496251874062968, 0.7488931315592203, 0.9977921195652173], "isController": false}, {"data": ["Feedback_DeleteFeedback", 2, 0, 0.0, 273.5, 268, 279, 273.5, 279.0, 279.0, 279.0, 0.7451564828614009, 0.6534673062593144, 0.9547317436661699], "isController": false}, {"data": ["MyStudent_DeleteStudent", 2, 0, 0.0, 270.5, 268, 273, 270.5, 273.0, 273.0, 273.0, 0.11400558627372742, 0.2029054501795588, 0.14551298951148606], "isController": false}, {"data": ["MyStudent_GetactiveStudentDetails", 2, 0, 0.0, 2397.0, 1512, 3282, 2397.0, 3282.0, 3282.0, 3282.0, 0.08663634394628546, 2.4824612166991553, 0.10685713125406107], "isController": false}, {"data": ["MyClasses_UpdateOneonOneClass", 2, 0, 0.0, 403.5, 396, 411, 403.5, 411.0, 411.0, 411.0, 0.1611733419292449, 0.32384194435490365, 0.28661782778628414], "isController": false}, {"data": ["Reports_PartiallyPaidInvoices", 4, 0, 0.0, 429.5, 259, 736, 361.5, 736.0, 736.0, 736.0, 0.29344875651089425, 4.457541059900227, 0.39374862445895387], "isController": false}, {"data": ["MyClasses_NewGroupClass", 2, 0, 0.0, 366.5, 365, 368, 366.5, 368.0, 368.0, 368.0, 0.1431229426077, 0.2728979935952483, 0.22838172677830257], "isController": false}, {"data": ["Courses_GetactiveCourses", 2, 0, 0.0, 807.0, 270, 1344, 807.0, 1344.0, 1344.0, 1344.0, 0.6591957811470006, 18.127240235662494, 0.8149822841133817], "isController": false}, {"data": ["MyStudent_DeleteEnrollment", 2, 0, 0.0, 270.5, 263, 278, 270.5, 278.0, 278.0, 278.0, 0.1108278842956888, 0.06612874736783775, 0.1423229178211238], "isController": false}, {"data": ["Feedback_UpdateFeedback", 2, 0, 0.0, 263.0, 261, 265, 263.0, 265.0, 265.0, 265.0, 0.7513148009015778, 0.7505810950413223, 1.0081118519909842], "isController": false}, {"data": ["Courses_CreateNewCourse", 2, 0, 0.0, 289.0, 287, 291, 289.0, 291.0, 291.0, 291.0, 1.0167768174885612, 1.7952465683782408, 1.6284316217590238], "isController": false}, {"data": ["Invoice_GetInvoiceDetails", 2, 0, 0.0, 319.0, 299, 339, 319.0, 339.0, 339.0, 339.0, 0.10968520346605243, 0.5321446199407699, 0.13817764889766368], "isController": false}, {"data": ["Invoice_PrintInvoice", 2, 0, 0.0, 236.0, 236, 236, 236.0, 236.0, 236.0, 236.0, 0.11109259567849802, 0.03308910320502138, 0.14081854413153364], "isController": false}, {"data": ["Reports_CancelledInvoices", 4, 0, 0.0, 857.75, 425, 1734, 636.0, 1734.0, 1734.0, 1734.0, 0.28188865398167723, 7.764394489957717, 0.37686090556730095], "isController": false}, {"data": ["Courses_DeleteCourse", 2, 0, 0.0, 259.0, 257, 261, 259.0, 261.0, 261.0, 261.0, 0.9551098376313276, 1.6961594138013372, 1.2255999283667622], "isController": false}, {"data": ["Invoice_UpdateInvoice", 2, 0, 0.0, 358.5, 333, 384, 358.5, 384.0, 384.0, 384.0, 0.10972732759093652, 0.5327776101388051, 0.1651267693531574], "isController": false}, {"data": ["MyStudent_CreateNewStudent", 2, 0, 0.0, 1717.0, 1213, 2221, 1717.0, 2221.0, 2221.0, 2221.0, 0.0980776775205963, 0.17369518377304827, 0.17460508410160847], "isController": false}, {"data": ["MyStudent_CreateNewEnrollment", 2, 0, 0.0, 424.5, 400, 449, 424.5, 449.0, 449.0, 449.0, 0.10769479295676054, 0.1788953543158688, 0.16480248101879272], "isController": false}, {"data": ["MyClasses_DeleteOneonOneClass", 2, 0, 0.0, 446.0, 374, 518, 446.0, 518.0, 518.0, 518.0, 0.1646361540994402, 0.3436618939331577, 0.21110084993414555], "isController": false}, {"data": ["MyStudent_UpdateStudent", 2, 0, 0.0, 1608.0, 1362, 1854, 1608.0, 1854.0, 1854.0, 1854.0, 0.10454783063251438, 0.1861747745687402, 0.19020762545739678], "isController": false}, {"data": ["MyStudent_CreateNewSchedule", 2, 0, 0.0, 460.5, 392, 529, 460.5, 529.0, 529.0, 529.0, 0.10803219359369093, 0.23252241668017068, 0.1920103440825366], "isController": false}, {"data": ["Invoice_CreateNewInvoice", 2, 0, 0.0, 340.0, 319, 361, 340.0, 361.0, 361.0, 361.0, 0.1092955899229466, 0.5306813213836822, 0.16031442975025958], "isController": false}, {"data": ["Reports_PaidInvoices", 4, 0, 0.0, 520.5, 411, 666, 502.5, 666.0, 666.0, 666.0, 0.28165047176454017, 6.107263171560343, 0.3751672299676102], "isController": false}, {"data": ["MyClasses_UpdateGroupClass", 2, 0, 0.0, 422.5, 378, 467, 422.5, 467.0, 467.0, 467.0, 0.14795088030773784, 0.28210360722740047, 0.23724154830596242], "isController": false}, {"data": ["Invoice_ReceivePaymentInvoice", 2, 0, 0.0, 355.0, 327, 383, 355.0, 383.0, 383.0, 383.0, 0.11013215859030838, 0.5503919156112335, 0.15315253303964757], "isController": false}, {"data": ["Reports_OverdueInvoices", 4, 0, 0.0, 613.0, 373, 775, 652.0, 775.0, 775.0, 775.0, 0.29025469849793195, 4.2740287805674475, 0.38776213627458095], "isController": false}, {"data": ["Feedback_GetactiveFeedbacks", 2, 0, 0.0, 687.5, 258, 1117, 687.5, 1117.0, 1117.0, 1117.0, 0.5732301519059902, 2.618161543422184, 0.7103799441100602], "isController": false}, {"data": ["Courses_GetinactiveCourses", 2, 0, 0.0, 254.5, 249, 260, 254.5, 260.0, 260.0, 260.0, 1.0309278350515465, 2.1393766108247423, 1.2765786082474226], "isController": false}, {"data": ["Feedback_DeleteFeedbackKPI", 2, 0, 0.0, 269.0, 265, 273, 269.0, 273.0, 273.0, 273.0, 0.7490636704119851, 0.48791549625468167, 0.9663213951310862], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 118, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
