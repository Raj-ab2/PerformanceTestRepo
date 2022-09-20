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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7123287671232876, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Feedback_CreateNewFeedback"], "isController": false}, {"data": [1.0, 500, 1500, "Courses_GetCourseDetails"], "isController": false}, {"data": [1.0, 500, 1500, "MyTeachers_DeleteTeacher"], "isController": false}, {"data": [1.0, 500, 1500, "MyClasses_GetGroupClassDetails"], "isController": false}, {"data": [1.0, 500, 1500, "Feedback_GetinactiveFeedbacks"], "isController": false}, {"data": [0.75, 500, 1500, "MyStudent_DeleteSchedule"], "isController": false}, {"data": [1.0, 500, 1500, "Invoice_SendInvoice"], "isController": false}, {"data": [1.0, 500, 1500, "MyStudent_GetStudentDetails"], "isController": false}, {"data": [1.0, 500, 1500, "MyTeachers_GetTeacherAvailabilityDetails"], "isController": false}, {"data": [1.0, 500, 1500, "MyClasses_GetOneonOneClassDetails"], "isController": false}, {"data": [0.875, 500, 1500, "GetAuthorizationToken"], "isController": false}, {"data": [0.25, 500, 1500, "MyCalender_dayschedules"], "isController": false}, {"data": [0.5, 500, 1500, "MyClasses_DeleteGroupClass"], "isController": false}, {"data": [0.5, 500, 1500, "MyCalender_weekschedules"], "isController": false}, {"data": [1.0, 500, 1500, "Feedback_UpdateFeedbackKPI"], "isController": false}, {"data": [0.5, 500, 1500, "MyTeachers_DeactivateTeacher"], "isController": false}, {"data": [0.875, 500, 1500, "InviteFriends"], "isController": false}, {"data": [0.0, 500, 1500, "MyClasses_GetactiveSchedules"], "isController": false}, {"data": [1.0, 500, 1500, "MyStudent_InactiveEnrollment"], "isController": false}, {"data": [0.125, 500, 1500, "Reports_OpenInvoices"], "isController": false}, {"data": [0.5, 500, 1500, "MyStudent_GetinactiveStudentDetails"], "isController": false}, {"data": [1.0, 500, 1500, "MyTeachers_UpdateTeacher"], "isController": false}, {"data": [1.0, 500, 1500, "MyTeachers_NewTeacherAvailabilty"], "isController": false}, {"data": [1.0, 500, 1500, "Feedback_GetFeedbackDetails"], "isController": false}, {"data": [0.375, 500, 1500, "MyCalender_monthschedules"], "isController": false}, {"data": [0.5, 500, 1500, "MyClasses_GetinactiveSchedules"], "isController": false}, {"data": [1.0, 500, 1500, "Courses_UpdateCourse"], "isController": false}, {"data": [0.0, 500, 1500, "MyTeachers_GetactiveTeachers"], "isController": false}, {"data": [0.5, 500, 1500, "MyClasses_NewOneonOneClass"], "isController": false}, {"data": [1.0, 500, 1500, "Feedback_CreateNewFeedbackKPI"], "isController": false}, {"data": [1.0, 500, 1500, "Feedback_DeleteFeedback"], "isController": false}, {"data": [1.0, 500, 1500, "MyStudent_DeleteStudent"], "isController": false}, {"data": [0.0, 500, 1500, "MyStudent_GetactiveStudentDetails"], "isController": false}, {"data": [0.5, 500, 1500, "MyClasses_UpdateOneonOneClass"], "isController": false}, {"data": [0.75, 500, 1500, "Reports_PartiallyPaidInvoices"], "isController": false}, {"data": [0.75, 500, 1500, "MyClasses_NewGroupClass"], "isController": false}, {"data": [0.5, 500, 1500, "Courses_GetactiveCourses"], "isController": false}, {"data": [1.0, 500, 1500, "MyStudent_DeleteEnrollment"], "isController": false}, {"data": [0.75, 500, 1500, "MyAccount_PreferencesUpdate"], "isController": false}, {"data": [1.0, 500, 1500, "Feedback_UpdateFeedback"], "isController": false}, {"data": [1.0, 500, 1500, "Courses_CreateNewCourse"], "isController": false}, {"data": [1.0, 500, 1500, "Invoice_GetInvoiceDetails"], "isController": false}, {"data": [1.0, 500, 1500, "Invoice_PrintInvoice"], "isController": false}, {"data": [0.5, 500, 1500, "Reports_CancelledInvoices"], "isController": false}, {"data": [1.0, 500, 1500, "Courses_DeleteCourse"], "isController": false}, {"data": [0.5, 500, 1500, "MyTeachers_NewTeacher"], "isController": false}, {"data": [0.75, 500, 1500, "MyStudent_activeStudent"], "isController": false}, {"data": [1.0, 500, 1500, "Invoice_UpdateInvoice"], "isController": false}, {"data": [0.5, 500, 1500, "MyStudent_InactiveStudent"], "isController": false}, {"data": [0.0, 500, 1500, "MyTeacher_SubscriptionValidation"], "isController": false}, {"data": [0.5, 500, 1500, "MyStudent_CreateNewStudent"], "isController": false}, {"data": [0.75, 500, 1500, "MyStudent_CreateNewEnrollment"], "isController": false}, {"data": [0.5, 500, 1500, "MyClasses_DeleteOneonOneClass"], "isController": false}, {"data": [0.5, 500, 1500, "MyStudent_UpdateStudent"], "isController": false}, {"data": [0.75, 500, 1500, "MyStudent_CreateNewSchedule"], "isController": false}, {"data": [0.75, 500, 1500, "Invoice_CreateNewInvoice"], "isController": false}, {"data": [0.5, 500, 1500, "Reports_PaidInvoices"], "isController": false}, {"data": [1.0, 500, 1500, "MyTeachers_GetinactiveSchedules"], "isController": false}, {"data": [1.0, 500, 1500, "MyTeachers_GetTeacherDetails"], "isController": false}, {"data": [0.5, 500, 1500, "MyClasses_UpdateGroupClass"], "isController": false}, {"data": [0.75, 500, 1500, "Invoice_ReceivePaymentInvoice"], "isController": false}, {"data": [1.0, 500, 1500, "MyStudent_activeEnrollment"], "isController": false}, {"data": [1.0, 500, 1500, "MyTeachers_activateTeacher"], "isController": false}, {"data": [0.625, 500, 1500, "Reports_OverdueInvoices"], "isController": false}, {"data": [0.5, 500, 1500, "Feedback_GetactiveFeedbacks"], "isController": false}, {"data": [1.0, 500, 1500, "MyTeachers_DeleteAvailability"], "isController": false}, {"data": [1.0, 500, 1500, "Courses_GetinactiveCourses"], "isController": false}, {"data": [1.0, 500, 1500, "Feedback_DeleteFeedbackKPI"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 146, 0, 0.0, 846.5410958904108, 239, 15185, 420.5, 1704.0, 1923.7500000000011, 10084.560000000012, 2.5657698188144735, 81.0457289982514, 3.494536480941251], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Feedback_CreateNewFeedback", 2, 0, 0.0, 282.5, 276, 289, 282.5, 289.0, 289.0, 289.0, 0.7317965605561654, 0.6438952158799853, 0.9926420142700328], "isController": false}, {"data": ["Courses_GetCourseDetails", 2, 0, 0.0, 284.5, 254, 315, 284.5, 315.0, 315.0, 315.0, 0.970402717127608, 1.6531909570596799, 1.2423808224163029], "isController": false}, {"data": ["MyTeachers_DeleteTeacher", 1, 0, 0.0, 311.0, 311, 311, 311.0, 311.0, 311.0, 311.0, 3.215434083601286, 5.46686595659164, 4.151175643086817], "isController": false}, {"data": ["MyClasses_GetGroupClassDetails", 2, 0, 0.0, 367.5, 318, 417, 367.5, 417.0, 417.0, 417.0, 0.16835016835016836, 0.3146701388888889, 0.21635627104377103], "isController": false}, {"data": ["Feedback_GetinactiveFeedbacks", 2, 0, 0.0, 289.5, 267, 312, 289.5, 312.0, 312.0, 312.0, 0.7222824124232575, 0.6030776002166847, 0.9099065547128927], "isController": false}, {"data": ["MyStudent_DeleteSchedule", 2, 0, 0.0, 514.0, 424, 604, 514.0, 604.0, 604.0, 604.0, 0.07877427232265942, 0.16943392069400134, 0.10246809641970933], "isController": false}, {"data": ["Invoice_SendInvoice", 2, 0, 0.0, 312.5, 265, 360, 312.5, 360.0, 360.0, 360.0, 0.07892036934732855, 0.05156028036461211, 0.10342884342198722], "isController": false}, {"data": ["MyStudent_GetStudentDetails", 2, 0, 0.0, 257.5, 256, 259, 257.5, 259.0, 259.0, 259.0, 0.07469096612764686, 0.12655158811666728, 0.09511427717817529], "isController": false}, {"data": ["MyTeachers_GetTeacherAvailabilityDetails", 1, 0, 0.0, 285.0, 285, 285, 285.0, 285.0, 285.0, 285.0, 3.5087719298245617, 3.707510964912281, 4.505893640350878], "isController": false}, {"data": ["MyClasses_GetOneonOneClassDetails", 2, 0, 0.0, 358.0, 304, 412, 358.0, 412.0, 412.0, 412.0, 0.1573192794777, 0.31709667269723907, 0.20233348737512782], "isController": false}, {"data": ["GetAuthorizationToken", 4, 0, 0.0, 436.75, 299, 779, 334.5, 779.0, 779.0, 779.0, 2.197802197802198, 4.483065762362637, 0.773201407967033], "isController": false}, {"data": ["MyCalender_dayschedules", 4, 0, 0.0, 1158.5, 519, 1992, 1061.5, 1992.0, 1992.0, 1992.0, 0.13387776959635853, 4.4861799965693825, 0.17587799760693487], "isController": false}, {"data": ["MyClasses_DeleteGroupClass", 2, 0, 0.0, 681.0, 602, 760, 681.0, 760.0, 760.0, 760.0, 0.1543924656476764, 0.29747688937779837, 0.20083082445576655], "isController": false}, {"data": ["MyCalender_weekschedules", 4, 0, 0.0, 1396.75, 433, 3798, 678.0, 3798.0, 3798.0, 3798.0, 0.14054319946593585, 21.2547570579038, 0.18463451082182636], "isController": false}, {"data": ["Feedback_UpdateFeedbackKPI", 2, 0, 0.0, 280.0, 258, 302, 280.0, 302.0, 302.0, 302.0, 0.735023888276369, 0.5799797868430724, 1.0106578463800073], "isController": false}, {"data": ["MyTeachers_DeactivateTeacher", 1, 0, 0.0, 642.0, 642, 642, 642.0, 642.0, 642.0, 642.0, 1.557632398753894, 2.6513215537383177, 2.027660144080997], "isController": false}, {"data": ["InviteFriends", 4, 0, 0.0, 520.25, 361, 932, 394.0, 932.0, 932.0, 932.0, 1.38264777048047, 0.8249978396128587, 1.8410549170411339], "isController": false}, {"data": ["MyClasses_GetactiveSchedules", 2, 0, 0.0, 2702.5, 1687, 3718, 2702.5, 3718.0, 3718.0, 3718.0, 0.08902341315766046, 5.169226205710852, 0.11214863571619335], "isController": false}, {"data": ["MyStudent_InactiveEnrollment", 2, 0, 0.0, 340.5, 295, 386, 340.5, 386.0, 386.0, 386.0, 0.07974163709580957, 0.12007969179857263, 0.10559537099796659], "isController": false}, {"data": ["Reports_OpenInvoices", 4, 0, 0.0, 1783.25, 1292, 2534, 1653.5, 2534.0, 2534.0, 2534.0, 0.17540013155009868, 4.876774556018417, 0.2393766443762333], "isController": false}, {"data": ["MyStudent_GetinactiveStudentDetails", 2, 0, 0.0, 1031.0, 357, 1705, 1031.0, 1705.0, 1705.0, 1705.0, 0.07689941556444171, 0.645346804348662, 0.09642465779760075], "isController": false}, {"data": ["MyTeachers_UpdateTeacher", 1, 0, 0.0, 309.0, 309, 309, 309.0, 309.0, 309.0, 309.0, 3.236245954692557, 5.5054105987055015, 6.011074029126213], "isController": false}, {"data": ["MyTeachers_NewTeacherAvailabilty", 1, 0, 0.0, 493.0, 493, 493, 493.0, 493.0, 493.0, 493.0, 2.028397565922921, 2.1393255578093306, 3.2426629056795133], "isController": false}, {"data": ["Feedback_GetFeedbackDetails", 2, 0, 0.0, 266.0, 246, 286, 266.0, 286.0, 286.0, 286.0, 0.7380073800738007, 0.7531422970479705, 0.9434098247232472], "isController": false}, {"data": ["MyCalender_monthschedules", 4, 0, 0.0, 4785.25, 1126, 15185, 1415.0, 15185.0, 15185.0, 15185.0, 0.13720714849243645, 101.30975880483999, 0.1802518715912599], "isController": false}, {"data": ["MyClasses_GetinactiveSchedules", 2, 0, 0.0, 1071.0, 453, 1689, 1071.0, 1689.0, 1689.0, 1689.0, 0.09785693316371466, 3.328330270207457, 0.1234679273901556], "isController": false}, {"data": ["Courses_UpdateCourse", 2, 0, 0.0, 336.5, 317, 356, 336.5, 356.0, 356.0, 356.0, 0.9699321047526673, 1.6523892155674105, 1.6642292070805045], "isController": false}, {"data": ["MyTeachers_GetactiveTeachers", 1, 0, 0.0, 1773.0, 1773, 1773, 1773.0, 1773.0, 1773.0, 1773.0, 0.5640157924421885, 1.560406972645234, 0.7044689438804287], "isController": false}, {"data": ["MyClasses_NewOneonOneClass", 2, 0, 0.0, 754.0, 702, 806, 754.0, 806.0, 806.0, 806.0, 0.15382248884786956, 0.3213898582910321, 0.27354565643747114], "isController": false}, {"data": ["Feedback_CreateNewFeedbackKPI", 2, 0, 0.0, 264.5, 255, 274, 264.5, 274.0, 274.0, 274.0, 0.7410151908114117, 0.7402915431641349, 1.000081048536495], "isController": false}, {"data": ["Feedback_DeleteFeedback", 2, 0, 0.0, 270.5, 266, 275, 270.5, 275.0, 275.0, 275.0, 0.7451564828614009, 0.6534673062593144, 0.9685578893442622], "isController": false}, {"data": ["MyStudent_DeleteStudent", 2, 0, 0.0, 275.0, 273, 277, 275.0, 277.0, 277.0, 277.0, 0.07657260997741108, 0.13041272636777826, 0.09915554768559287], "isController": false}, {"data": ["MyStudent_GetactiveStudentDetails", 2, 0, 0.0, 3018.5, 1704, 4333, 3018.5, 4333.0, 4333.0, 4333.0, 0.07694379255953526, 3.0363493296272077, 0.09633002154426193], "isController": false}, {"data": ["MyClasses_UpdateOneonOneClass", 2, 0, 0.0, 940.5, 794, 1087, 940.5, 1087.0, 1087.0, 1087.0, 0.15144631228229594, 0.30370605690595187, 0.2721300923822505], "isController": false}, {"data": ["Reports_PartiallyPaidInvoices", 4, 0, 0.0, 679.25, 278, 1377, 531.0, 1377.0, 1377.0, 1377.0, 0.1766316347257794, 2.5518441446613087, 0.23864244789366776], "isController": false}, {"data": ["MyClasses_NewGroupClass", 2, 0, 0.0, 594.0, 430, 758, 594.0, 758.0, 758.0, 758.0, 0.16816614815437653, 0.3208130570503657, 0.27146351845623473], "isController": false}, {"data": ["Courses_GetactiveCourses", 2, 0, 0.0, 1001.0, 286, 1716, 1001.0, 1716.0, 1716.0, 1716.0, 0.5730659025787965, 12.699229942693409, 0.7191305515759312], "isController": false}, {"data": ["MyStudent_DeleteEnrollment", 2, 0, 0.0, 301.0, 275, 327, 301.0, 327.0, 327.0, 327.0, 0.08049909438518817, 0.04803217448178708, 0.10486893741195412], "isController": false}, {"data": ["MyAccount_PreferencesUpdate", 4, 0, 0.0, 635.25, 256, 1730, 277.5, 1730.0, 1730.0, 1730.0, 0.942507068803016, 1.1597254948162112, 1.5274321100377004], "isController": false}, {"data": ["Feedback_UpdateFeedback", 2, 0, 0.0, 256.5, 254, 259, 256.5, 259.0, 259.0, 259.0, 0.7468259895444362, 0.7460966672890217, 1.0159459017923824], "isController": false}, {"data": ["Courses_CreateNewCourse", 2, 0, 0.0, 357.5, 329, 386, 357.5, 386.0, 386.0, 386.0, 0.9560229445506692, 1.614689143164436, 1.5488692041108987], "isController": false}, {"data": ["Invoice_GetInvoiceDetails", 2, 0, 0.0, 368.0, 306, 430, 368.0, 430.0, 430.0, 430.0, 0.07784524365561264, 0.3725396645843064, 0.09951115619648139], "isController": false}, {"data": ["Invoice_PrintInvoice", 2, 0, 0.0, 242.5, 239, 246, 242.5, 246.0, 246.0, 246.0, 0.07930214115781127, 0.023620266653449642, 0.1019930858445678], "isController": false}, {"data": ["Reports_CancelledInvoices", 4, 0, 0.0, 1665.0, 286, 4066, 1154.0, 4066.0, 4066.0, 4066.0, 0.16849909431736806, 4.531333920447365, 0.22683203273094907], "isController": false}, {"data": ["Courses_DeleteCourse", 2, 0, 0.0, 263.0, 256, 270, 263.0, 270.0, 270.0, 270.0, 0.9694619486185168, 1.6506415111488122, 1.2620046655356276], "isController": false}, {"data": ["MyTeachers_NewTeacher", 1, 0, 0.0, 528.0, 528, 528, 528.0, 528.0, 528.0, 528.0, 1.893939393939394, 3.221916429924242, 3.4586588541666665], "isController": false}, {"data": ["MyStudent_activeStudent", 2, 0, 0.0, 853.5, 463, 1244, 853.5, 1244.0, 1244.0, 1244.0, 0.0757174225789354, 0.1282907501703642, 0.09974883111228894], "isController": false}, {"data": ["Invoice_UpdateInvoice", 2, 0, 0.0, 349.0, 345, 353, 349.0, 353.0, 353.0, 353.0, 0.0777302759424796, 0.3710026598328799, 0.11841721725612125], "isController": false}, {"data": ["MyStudent_InactiveStudent", 2, 0, 0.0, 1080.5, 754, 1407, 1080.5, 1407.0, 1407.0, 1407.0, 0.07714561234329798, 0.13086125843780136, 0.1017056412729026], "isController": false}, {"data": ["MyTeacher_SubscriptionValidation", 1, 0, 0.0, 1704.0, 1704, 1704, 1704.0, 1704.0, 1704.0, 1704.0, 0.5868544600938967, 0.1707838174882629, 0.7719657790492958], "isController": false}, {"data": ["MyStudent_CreateNewStudent", 2, 0, 0.0, 979.0, 544, 1414, 979.0, 1414.0, 1414.0, 1414.0, 0.07389617587289857, 0.1252049464252725, 0.13292651949011638], "isController": false}, {"data": ["MyStudent_CreateNewEnrollment", 2, 0, 0.0, 696.5, 428, 965, 696.5, 965.0, 965.0, 965.0, 0.07328423289729215, 0.1221642437067165, 0.11350468103037631], "isController": false}, {"data": ["MyClasses_DeleteOneonOneClass", 2, 0, 0.0, 715.5, 695, 736, 715.5, 736.0, 736.0, 736.0, 0.15607928827844547, 0.3258002721632589, 0.2030250117059466], "isController": false}, {"data": ["MyStudent_UpdateStudent", 2, 0, 0.0, 1195.5, 1151, 1240, 1195.5, 1240.0, 1240.0, 1240.0, 0.0735564545788893, 0.12534766917984552, 0.13518871827877896], "isController": false}, {"data": ["MyStudent_CreateNewSchedule", 2, 0, 0.0, 504.0, 409, 599, 504.0, 599.0, 599.0, 599.0, 0.07479431563201197, 0.1607639538145101, 0.13432299457741212], "isController": false}, {"data": ["Invoice_CreateNewInvoice", 2, 0, 0.0, 711.5, 333, 1090, 711.5, 1090.0, 1090.0, 1090.0, 0.0755629439322956, 0.36139601358243917, 0.11223753683693517], "isController": false}, {"data": ["Reports_PaidInvoices", 4, 0, 0.0, 751.0, 536, 986, 741.0, 986.0, 986.0, 986.0, 0.16657643776287845, 3.6785901126473157, 0.22343040748761087], "isController": false}, {"data": ["MyTeachers_GetinactiveSchedules", 1, 0, 0.0, 341.0, 341, 341, 341.0, 341.0, 341.0, 341.0, 2.932551319648094, 2.474340175953079, 3.668552969208211], "isController": false}, {"data": ["MyTeachers_GetTeacherDetails", 1, 0, 0.0, 260.0, 260, 260, 260.0, 260.0, 260.0, 260.0, 3.8461538461538463, 6.54296875, 4.8828125], "isController": false}, {"data": ["MyClasses_UpdateGroupClass", 2, 0, 0.0, 984.5, 587, 1382, 984.5, 1382.0, 1382.0, 1382.0, 0.15457145065306438, 0.29487825083082153, 0.25072576126439444], "isController": false}, {"data": ["Invoice_ReceivePaymentInvoice", 2, 0, 0.0, 478.0, 323, 633, 478.0, 633.0, 633.0, 633.0, 0.0777846919726198, 0.38353018532202865, 0.10961260792626011], "isController": false}, {"data": ["MyStudent_activeEnrollment", 2, 0, 0.0, 345.0, 282, 408, 345.0, 408.0, 408.0, 408.0, 0.08006725649545618, 0.12166469834661116, 0.10594837163217102], "isController": false}, {"data": ["MyTeachers_activateTeacher", 1, 0, 0.0, 357.0, 357, 357, 357.0, 357.0, 357.0, 357.0, 2.8011204481792715, 4.765187324929972, 3.6409094887955185], "isController": false}, {"data": ["Reports_OverdueInvoices", 4, 0, 0.0, 877.75, 272, 1348, 945.5, 1348.0, 1348.0, 1348.0, 0.18036704694052397, 2.4360119718627407, 0.24263242886774586], "isController": false}, {"data": ["Feedback_GetactiveFeedbacks", 2, 0, 0.0, 1018.5, 270, 1767, 1018.5, 1767.0, 1767.0, 1767.0, 0.4684937924572499, 0.5609115132349496, 0.5892773483251347], "isController": false}, {"data": ["MyTeachers_DeleteAvailability", 1, 0, 0.0, 399.0, 399, 399, 399.0, 399.0, 399.0, 399.0, 2.506265664160401, 2.6384320175438596, 3.2527608082706765], "isController": false}, {"data": ["Courses_GetinactiveCourses", 2, 0, 0.0, 254.0, 250, 258, 254.0, 258.0, 258.0, 258.0, 0.9886307464162134, 0.8534663865546218, 1.2425466510133465], "isController": false}, {"data": ["Feedback_DeleteFeedbackKPI", 2, 0, 0.0, 272.5, 270, 275, 272.5, 275.0, 275.0, 275.0, 0.7423904974016332, 0.48356881031922794, 0.9714875649591685], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 146, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
