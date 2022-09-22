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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7836734693877551, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "MyStudent_AddGuardian"], "isController": false}, {"data": [0.75, 500, 1500, "MyClasses_DeactivateGroupClass"], "isController": false}, {"data": [1.0, 500, 1500, "Courses_SearchCourse"], "isController": false}, {"data": [1.0, 500, 1500, "MyAccount_GetInvoiceconfig"], "isController": false}, {"data": [1.0, 500, 1500, "MyAccount_GetCancellationfee"], "isController": false}, {"data": [1.0, 500, 1500, "MyClasses_GetGroupClassDetails"], "isController": false}, {"data": [1.0, 500, 1500, "MyStudent_DeleteGuardian"], "isController": false}, {"data": [1.0, 500, 1500, "Dashboard_InvoiceSummary"], "isController": false}, {"data": [1.0, 500, 1500, "MyAccount_GetLatefee"], "isController": false}, {"data": [1.0, 500, 1500, "MyAccount_PutInvoiceconfig"], "isController": false}, {"data": [1.0, 500, 1500, "MyStudent_GetStudentDetails"], "isController": false}, {"data": [1.0, 500, 1500, "MyStudent_UpdateGuardian"], "isController": false}, {"data": [1.0, 500, 1500, "MyClasses_GetOneonOneClassDetails"], "isController": false}, {"data": [1.0, 500, 1500, "Dashboard_Contacts"], "isController": false}, {"data": [0.75, 500, 1500, "MyClasses_DeleteGroupClass"], "isController": false}, {"data": [0.5, 500, 1500, "MyCalender_weekschedules"], "isController": false}, {"data": [1.0, 500, 1500, "MyStudent_InactiveEnrollment"], "isController": false}, {"data": [0.375, 500, 1500, "Reports_OpenInvoices"], "isController": false}, {"data": [0.25, 500, 1500, "MyClasses_SearchOneonOneClass"], "isController": false}, {"data": [1.0, 500, 1500, "MyAccount_PutAttendanceSetup"], "isController": false}, {"data": [1.0, 500, 1500, "MyAccount_ProfileUpdate"], "isController": false}, {"data": [0.25, 500, 1500, "MyClasses_GetinactiveSchedules"], "isController": false}, {"data": [1.0, 500, 1500, "MyClasses_activateGroupClass"], "isController": false}, {"data": [0.5, 500, 1500, "MyTeachers_GetactiveTeachers"], "isController": false}, {"data": [1.0, 500, 1500, "Feedback_CreateNewFeedbackKPI"], "isController": false}, {"data": [1.0, 500, 1500, "MyStudent_DeleteStudent"], "isController": false}, {"data": [1.0, 500, 1500, "MyTeachers_SearchTeacher"], "isController": false}, {"data": [0.5, 500, 1500, "MyClasses_UpdateOneonOneClass"], "isController": false}, {"data": [0.5, 500, 1500, "MyAccount_Subscriptiondetail"], "isController": false}, {"data": [1.0, 500, 1500, "Dashboard_Basic"], "isController": false}, {"data": [1.0, 500, 1500, "MyClasses_NewGroupClass"], "isController": false}, {"data": [1.0, 500, 1500, "MyAccount_PutLatefee"], "isController": false}, {"data": [0.875, 500, 1500, "MyAccount_PreferencesUpdate"], "isController": false}, {"data": [1.0, 500, 1500, "Feedback_UpdateFeedback"], "isController": false}, {"data": [1.0, 500, 1500, "Invoice_GetInvoiceDetails"], "isController": false}, {"data": [1.0, 500, 1500, "Invoice_UpdateInvoice"], "isController": false}, {"data": [0.25, 500, 1500, "MyStudent_InactiveStudent"], "isController": false}, {"data": [0.5, 500, 1500, "MyTeacher_SubscriptionValidation"], "isController": false}, {"data": [0.25, 500, 1500, "MyStudent_CreateNewStudent"], "isController": false}, {"data": [0.25, 500, 1500, "MyStudent_UpdateStudent"], "isController": false}, {"data": [1.0, 500, 1500, "Feedback_DeactivateFeedbackKPI"], "isController": false}, {"data": [0.5, 500, 1500, "Reports_PaidInvoices"], "isController": false}, {"data": [1.0, 500, 1500, "MyTeachers_GetinactiveSchedules"], "isController": false}, {"data": [0.75, 500, 1500, "MyClasses_UpdateGroupClass"], "isController": false}, {"data": [1.0, 500, 1500, "Invoice_ReceivePaymentInvoice"], "isController": false}, {"data": [1.0, 500, 1500, "MyStudent_activeEnrollment"], "isController": false}, {"data": [0.625, 500, 1500, "Reports_OverdueInvoices"], "isController": false}, {"data": [1.0, 500, 1500, "MyTeachers_DeleteAvailability"], "isController": false}, {"data": [0.25, 500, 1500, "Dashboard_ClassSchedule"], "isController": false}, {"data": [1.0, 500, 1500, "Courses_GetinactiveCourses"], "isController": false}, {"data": [1.0, 500, 1500, "Feedback_DeleteFeedbackKPI"], "isController": false}, {"data": [1.0, 500, 1500, "MyAccount_PutCancellationfee"], "isController": false}, {"data": [1.0, 500, 1500, "Feedback_CreateNewFeedback"], "isController": false}, {"data": [1.0, 500, 1500, "Courses_GetCourseDetails"], "isController": false}, {"data": [1.0, 500, 1500, "MyTeachers_DeleteTeacher"], "isController": false}, {"data": [0.875, 500, 1500, "Dashboard_Widget"], "isController": false}, {"data": [1.0, 500, 1500, "MyAccount_SubscriptionReport"], "isController": false}, {"data": [1.0, 500, 1500, "MyStudent_ReinviteStudent"], "isController": false}, {"data": [1.0, 500, 1500, "Feedback_ActivateFeedbackKPI"], "isController": false}, {"data": [1.0, 500, 1500, "Feedback_GetinactiveFeedbacks"], "isController": false}, {"data": [0.5, 500, 1500, "MyStudent_DeleteSchedule"], "isController": false}, {"data": [0.375, 500, 1500, "Dashboard_ClassTrends"], "isController": false}, {"data": [1.0, 500, 1500, "Invoice_SendInvoice"], "isController": false}, {"data": [1.0, 500, 1500, "MyTeachers_GetTeacherAvailabilityDetails"], "isController": false}, {"data": [1.0, 500, 1500, "Feedback_SearchFeedback"], "isController": false}, {"data": [0.875, 500, 1500, "GetAuthorizationToken"], "isController": false}, {"data": [0.375, 500, 1500, "MyCalender_dayschedules"], "isController": false}, {"data": [1.0, 500, 1500, "MyClasses_DeactivateOneononeClass"], "isController": false}, {"data": [1.0, 500, 1500, "Feedback_UpdateFeedbackKPI"], "isController": false}, {"data": [0.5, 500, 1500, "MyTeachers_DeactivateTeacher"], "isController": false}, {"data": [1.0, 500, 1500, "InviteFriends"], "isController": false}, {"data": [0.0, 500, 1500, "MyClasses_GetactiveSchedules"], "isController": false}, {"data": [1.0, 500, 1500, "MyStudent_GetGuardianDetails"], "isController": false}, {"data": [1.0, 500, 1500, "MyAccount_GetAttendanceSetup"], "isController": false}, {"data": [1.0, 500, 1500, "Courses_ActivateCourse"], "isController": false}, {"data": [0.5, 500, 1500, "MyStudent_GetinactiveStudentDetails"], "isController": false}, {"data": [1.0, 500, 1500, "MyTeachers_UpdateTeacher"], "isController": false}, {"data": [1.0, 500, 1500, "MyTeachers_NewTeacherAvailabilty"], "isController": false}, {"data": [0.875, 500, 1500, "Dashboard_Notifications"], "isController": false}, {"data": [1.0, 500, 1500, "Dashboard_ApplicationUser"], "isController": false}, {"data": [1.0, 500, 1500, "Feedback_GetFeedbackDetails"], "isController": false}, {"data": [0.0, 500, 1500, "MyCalender_monthschedules"], "isController": false}, {"data": [1.0, 500, 1500, "Feedback_DeactivateFeedback"], "isController": false}, {"data": [0.75, 500, 1500, "Dashboard_FeesCollection"], "isController": false}, {"data": [1.0, 500, 1500, "Courses_UpdateCourse"], "isController": false}, {"data": [0.75, 500, 1500, "MyClasses_NewOneonOneClass"], "isController": false}, {"data": [1.0, 500, 1500, "Feedback_DeleteFeedback"], "isController": false}, {"data": [0.0, 500, 1500, "MyStudent_GetactiveStudentDetails"], "isController": false}, {"data": [0.25, 500, 1500, "Dashboard_ChatroomUsers"], "isController": false}, {"data": [0.5, 500, 1500, "MyStudent_SearchStudentDetails"], "isController": false}, {"data": [0.875, 500, 1500, "Dashboard_Current"], "isController": false}, {"data": [0.75, 500, 1500, "Reports_PartiallyPaidInvoices"], "isController": false}, {"data": [1.0, 500, 1500, "Courses_DeactivateCourse"], "isController": false}, {"data": [0.75, 500, 1500, "Courses_GetactiveCourses"], "isController": false}, {"data": [1.0, 500, 1500, "MyStudent_DeleteEnrollment"], "isController": false}, {"data": [1.0, 500, 1500, "Courses_CreateNewCourse"], "isController": false}, {"data": [1.0, 500, 1500, "Feedback_ActivateFeedback"], "isController": false}, {"data": [1.0, 500, 1500, "Invoice_PrintInvoice"], "isController": false}, {"data": [0.375, 500, 1500, "Reports_CancelledInvoices"], "isController": false}, {"data": [1.0, 500, 1500, "Courses_DeleteCourse"], "isController": false}, {"data": [1.0, 500, 1500, "MyTeachers_NewTeacher"], "isController": false}, {"data": [1.0, 500, 1500, "MyClasses_activateOneonOneClass"], "isController": false}, {"data": [0.5, 500, 1500, "MyStudent_activeStudent"], "isController": false}, {"data": [1.0, 500, 1500, "Dashboard_CourseTrends"], "isController": false}, {"data": [0.75, 500, 1500, "MyStudent_CreateNewEnrollment"], "isController": false}, {"data": [0.75, 500, 1500, "MyClasses_DeleteOneonOneClass"], "isController": false}, {"data": [1.0, 500, 1500, "MyStudent_CreateNewSchedule"], "isController": false}, {"data": [0.75, 500, 1500, "Invoice_CreateNewInvoice"], "isController": false}, {"data": [1.0, 500, 1500, "MyTeachers_GetTeacherDetails"], "isController": false}, {"data": [1.0, 500, 1500, "MyTeachers_activateTeacher"], "isController": false}, {"data": [0.25, 500, 1500, "MyClasses_SearchGroupClass"], "isController": false}, {"data": [0.75, 500, 1500, "Feedback_GetactiveFeedbacks"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 245, 0, 0.0, 811.2571428571426, 237, 17642, 372.0, 1814.8000000000002, 2757.299999999999, 8753.919999999958, 3.408316291751875, 75.79637331670911, 4.684206888276783], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["MyStudent_AddGuardian", 2, 0, 0.0, 366.5, 324, 409, 366.5, 409.0, 409.0, 409.0, 0.06115646882549002, 0.03649082270739687, 0.10164874017674219], "isController": false}, {"data": ["MyClasses_DeactivateGroupClass", 2, 0, 0.0, 520.0, 475, 565, 520.0, 565.0, 565.0, 565.0, 0.09208103130755065, 0.17373100828729282, 0.12193542817679559], "isController": false}, {"data": ["Courses_SearchCourse", 2, 0, 0.0, 280.0, 277, 283, 280.0, 283.0, 283.0, 283.0, 0.19964064683569574, 0.37344888575563984, 0.25715430974246356], "isController": false}, {"data": ["MyAccount_GetInvoiceconfig", 1, 0, 0.0, 297.0, 297, 297, 297.0, 297.0, 297.0, 297.0, 3.3670033670033668, 5.836358375420875, 4.350142045454546], "isController": false}, {"data": ["MyAccount_GetCancellationfee", 1, 0, 0.0, 258.0, 258, 258, 258.0, 258.0, 258.0, 258.0, 3.875968992248062, 3.6450763081395348, 5.00015140503876], "isController": false}, {"data": ["MyClasses_GetGroupClassDetails", 2, 0, 0.0, 339.5, 297, 382, 339.5, 382.0, 382.0, 382.0, 0.09248554913294799, 0.17259754335260116, 0.11885838150289017], "isController": false}, {"data": ["MyStudent_DeleteGuardian", 2, 0, 0.0, 294.5, 292, 297, 294.5, 297.0, 297.0, 297.0, 0.05790555603810186, 0.039074940646805056, 0.07583139711630331], "isController": false}, {"data": ["Dashboard_InvoiceSummary", 4, 0, 0.0, 284.75, 261, 320, 279.0, 320.0, 320.0, 320.0, 0.10464082038403182, 0.09028336407157432, 0.13340682715952493], "isController": false}, {"data": ["MyAccount_GetLatefee", 1, 0, 0.0, 254.0, 254, 254, 254.0, 254.0, 254.0, 254.0, 3.937007874015748, 4.271499753937007, 5.059670275590551], "isController": false}, {"data": ["MyAccount_PutInvoiceconfig", 1, 0, 0.0, 301.0, 301, 301, 301.0, 301.0, 301.0, 301.0, 3.3222591362126246, 5.758798795681063, 6.809982350498339], "isController": false}, {"data": ["MyStudent_GetStudentDetails", 2, 0, 0.0, 271.5, 271, 272, 271.5, 272.0, 272.0, 272.0, 0.057927359091699014, 0.13927456844117475, 0.07376687134333546], "isController": false}, {"data": ["MyStudent_UpdateGuardian", 2, 0, 0.0, 289.0, 287, 291, 289.0, 291.0, 291.0, 291.0, 0.05790052689479474, 0.0786519852643159, 0.0956150302530253], "isController": false}, {"data": ["MyClasses_GetOneonOneClassDetails", 2, 0, 0.0, 346.0, 313, 379, 346.0, 379.0, 379.0, 379.0, 0.07764276563531193, 0.15657452249699133, 0.09985890853682208], "isController": false}, {"data": ["Dashboard_Contacts", 4, 0, 0.0, 325.75, 273, 388, 321.0, 388.0, 388.0, 388.0, 0.10457242947896786, 0.5914112131055398, 0.13127720517110664], "isController": false}, {"data": ["MyClasses_DeleteGroupClass", 2, 0, 0.0, 502.5, 442, 563, 502.5, 563.0, 563.0, 563.0, 0.09255831173639394, 0.17802108883283968, 0.12039811643835616], "isController": false}, {"data": ["MyCalender_weekschedules", 4, 0, 0.0, 1610.0, 499, 3635, 1153.0, 3635.0, 3635.0, 3635.0, 0.11606313834726091, 17.85074303077124, 0.15247454771645777], "isController": false}, {"data": ["MyStudent_InactiveEnrollment", 2, 0, 0.0, 333.5, 317, 350, 333.5, 350.0, 350.0, 350.0, 0.059021424777194124, 0.08887796582659505, 0.07815727734167502], "isController": false}, {"data": ["Reports_OpenInvoices", 4, 0, 0.0, 1206.25, 907, 1806, 1056.0, 1806.0, 1806.0, 1806.0, 0.20887728459530025, 5.7853806298955615, 0.2850644582245431], "isController": false}, {"data": ["MyClasses_SearchOneonOneClass", 2, 0, 0.0, 3559.0, 1265, 5853, 3559.0, 5853.0, 5853.0, 5853.0, 0.07488673381510466, 1.7385569560414873, 0.09755752237241172], "isController": false}, {"data": ["MyAccount_PutAttendanceSetup", 1, 0, 0.0, 262.0, 262, 262, 262.0, 262.0, 262.0, 262.0, 3.8167938931297707, 2.8029580152671754, 5.36736641221374], "isController": false}, {"data": ["MyAccount_ProfileUpdate", 4, 0, 0.0, 354.0, 283, 409, 362.0, 409.0, 409.0, 409.0, 0.9699321047526673, 4.970902036857421, 3.050218613603298], "isController": false}, {"data": ["MyClasses_GetinactiveSchedules", 2, 0, 0.0, 1559.0, 675, 2443, 1559.0, 2443.0, 2443.0, 2443.0, 0.08291530201898761, 3.205963877430455, 0.10461579121926952], "isController": false}, {"data": ["MyClasses_activateGroupClass", 2, 0, 0.0, 460.0, 451, 469, 460.0, 469.0, 469.0, 469.0, 0.09251977610214183, 0.17437809363001341, 0.12242607091640838], "isController": false}, {"data": ["MyTeachers_GetactiveTeachers", 1, 0, 0.0, 1090.0, 1090, 1090, 1090.0, 1090.0, 1090.0, 1090.0, 0.9174311926605505, 2.538166571100917, 1.1458930619266054], "isController": false}, {"data": ["Feedback_CreateNewFeedbackKPI", 2, 0, 0.0, 295.5, 291, 300, 295.5, 300.0, 300.0, 300.0, 0.15529155990371923, 0.15513990798975077, 0.2095829451044336], "isController": false}, {"data": ["MyStudent_DeleteStudent", 2, 0, 0.0, 302.5, 298, 307, 302.5, 307.0, 307.0, 307.0, 0.050072605277652595, 0.08527990586350208, 0.06484011191227279], "isController": false}, {"data": ["MyTeachers_SearchTeacher", 1, 0, 0.0, 267.0, 267, 267, 267.0, 267.0, 267.0, 267.0, 3.745318352059925, 7.10659527153558, 4.827949438202247], "isController": false}, {"data": ["MyClasses_UpdateOneonOneClass", 2, 0, 0.0, 533.5, 518, 549, 533.5, 549.0, 549.0, 549.0, 0.07722305880535928, 0.1549363030425885, 0.13876018379087995], "isController": false}, {"data": ["MyAccount_Subscriptiondetail", 1, 0, 0.0, 968.0, 968, 968, 968.0, 968.0, 968.0, 968.0, 1.0330578512396695, 0.6456611570247934, 1.3296584452479339], "isController": false}, {"data": ["Dashboard_Basic", 4, 0, 0.0, 260.25, 255, 270, 258.0, 270.0, 270.0, 270.0, 0.10337520028945056, 0.08227616038662325, 0.13068280935028687], "isController": false}, {"data": ["MyClasses_NewGroupClass", 2, 0, 0.0, 428.0, 423, 433, 428.0, 433.0, 433.0, 433.0, 0.10421008753647354, 0.19814164104835347, 0.16822194794706127], "isController": false}, {"data": ["MyAccount_PutLatefee", 1, 0, 0.0, 262.0, 262, 262, 262.0, 262.0, 262.0, 262.0, 3.8167938931297707, 4.141072280534351, 5.415821803435114], "isController": false}, {"data": ["MyAccount_PreferencesUpdate", 4, 0, 0.0, 476.0, 272, 1050, 291.0, 1050.0, 1050.0, 1050.0, 0.25943702166299126, 0.3192291477493839, 0.42044505610325594], "isController": false}, {"data": ["Feedback_UpdateFeedback", 2, 0, 0.0, 286.0, 285, 287, 286.0, 287.0, 287.0, 287.0, 0.155448468832582, 0.15529666368723768, 0.2114645674646355], "isController": false}, {"data": ["Invoice_GetInvoiceDetails", 2, 0, 0.0, 389.0, 361, 417, 389.0, 417.0, 417.0, 417.0, 0.05868889019308645, 0.2803770027583778, 0.07502320045190444], "isController": false}, {"data": ["Invoice_UpdateInvoice", 2, 0, 0.0, 430.0, 410, 450, 430.0, 450.0, 450.0, 450.0, 0.05870267097152921, 0.28104476995890815, 0.08942985030818902], "isController": false}, {"data": ["MyStudent_InactiveStudent", 2, 0, 0.0, 1539.5, 609, 2470, 1539.5, 2470.0, 2470.0, 2470.0, 0.05561116672227784, 0.09433261386386387, 0.073315503003003], "isController": false}, {"data": ["MyTeacher_SubscriptionValidation", 1, 0, 0.0, 1116.0, 1116, 1116, 1116.0, 1116.0, 1116.0, 1116.0, 0.8960573476702509, 0.26076668906810035, 1.1787004368279568], "isController": false}, {"data": ["MyStudent_CreateNewStudent", 2, 0, 0.0, 1976.0, 600, 3352, 1976.0, 3352.0, 3352.0, 3352.0, 0.06067961165048544, 0.10281164669296117, 0.10915219205097088], "isController": false}, {"data": ["MyStudent_UpdateStudent", 2, 0, 0.0, 1933.0, 721, 3145, 1933.0, 3145.0, 3145.0, 3145.0, 0.04954787563483216, 0.08443461228787315, 0.09106357611792394], "isController": false}, {"data": ["Feedback_DeactivateFeedbackKPI", 2, 0, 0.0, 321.5, 290, 353, 321.5, 353.0, 353.0, 353.0, 0.2668089647812167, 0.2107895044023479, 0.35591899012806827], "isController": false}, {"data": ["Reports_PaidInvoices", 4, 0, 0.0, 932.0, 521, 1308, 949.5, 1308.0, 1308.0, 1308.0, 0.19233543299514352, 4.837639969106121, 0.2579811691590133], "isController": false}, {"data": ["MyTeachers_GetinactiveSchedules", 1, 0, 0.0, 263.0, 263, 263, 263.0, 263.0, 263.0, 263.0, 3.802281368821293, 3.2081749049429655, 4.7565648764258555], "isController": false}, {"data": ["MyClasses_UpdateGroupClass", 2, 0, 0.0, 498.5, 496, 501, 498.5, 501.0, 501.0, 501.0, 0.09200055200331203, 0.17524128582271492, 0.14923136413818483], "isController": false}, {"data": ["Invoice_ReceivePaymentInvoice", 2, 0, 0.0, 403.0, 400, 406, 403.0, 406.0, 406.0, 406.0, 0.058790675798818304, 0.2895325957553132, 0.0828466261500926], "isController": false}, {"data": ["MyStudent_activeEnrollment", 2, 0, 0.0, 342.5, 322, 363, 342.5, 363.0, 363.0, 363.0, 0.059065001033637515, 0.08975111485189452, 0.07815730117244028], "isController": false}, {"data": ["Reports_OverdueInvoices", 4, 0, 0.0, 753.5, 278, 1222, 757.0, 1222.0, 1222.0, 1222.0, 0.21041557075223566, 2.947153636244082, 0.28305414913203575], "isController": false}, {"data": ["MyTeachers_DeleteAvailability", 1, 0, 0.0, 372.0, 372, 372, 372.0, 372.0, 372.0, 372.0, 2.688172043010753, 2.829931115591398, 3.4888482862903225], "isController": false}, {"data": ["Dashboard_ClassSchedule", 2, 0, 0.0, 1572.5, 929, 2216, 1572.5, 2216.0, 2216.0, 2216.0, 0.1488981536628946, 11.554438560899344, 0.20153597751637878], "isController": false}, {"data": ["Courses_GetinactiveCourses", 2, 0, 0.0, 272.5, 270, 275, 272.5, 275.0, 275.0, 275.0, 0.20062192797672784, 0.1731931487611596, 0.25214884893168826], "isController": false}, {"data": ["Feedback_DeleteFeedbackKPI", 2, 0, 0.0, 309.5, 287, 332, 309.5, 332.0, 332.0, 332.0, 0.2638522427440633, 0.17186469327176782, 0.34527539577836414], "isController": false}, {"data": ["MyAccount_PutCancellationfee", 1, 0, 0.0, 261.0, 261, 261, 261.0, 261.0, 261.0, 261.0, 3.8314176245210727, 3.6031788793103448, 6.005298132183908], "isController": false}, {"data": ["Feedback_CreateNewFeedback", 2, 0, 0.0, 277.5, 276, 279, 277.5, 279.0, 279.0, 279.0, 0.15725743041358706, 0.13836811015883, 0.2133111043403051], "isController": false}, {"data": ["Courses_GetCourseDetails", 2, 0, 0.0, 285.5, 266, 305, 285.5, 305.0, 305.0, 305.0, 0.43393360815795184, 0.7377718865263615, 0.555553672163159], "isController": false}, {"data": ["MyTeachers_DeleteTeacher", 1, 0, 0.0, 282.0, 282, 282, 282.0, 282.0, 282.0, 282.0, 3.5460992907801416, 6.029061391843972, 4.578069592198582], "isController": false}, {"data": ["Dashboard_Widget", 4, 0, 0.0, 409.0, 274, 722, 320.0, 722.0, 722.0, 722.0, 0.10330578512396695, 0.3258571151859504, 0.13473132425103307], "isController": false}, {"data": ["MyAccount_SubscriptionReport", 1, 0, 0.0, 350.0, 350, 350, 350.0, 350.0, 350.0, 350.0, 2.857142857142857, 2.0089285714285716, 3.7220982142857144], "isController": false}, {"data": ["MyStudent_ReinviteStudent", 2, 0, 0.0, 281.0, 270, 292, 281.0, 292.0, 292.0, 292.0, 0.06124636349716736, 0.03654446103200122, 0.07841209232889297], "isController": false}, {"data": ["Feedback_ActivateFeedbackKPI", 2, 0, 0.0, 288.5, 283, 294, 288.5, 294.0, 294.0, 294.0, 0.26659557451346305, 0.21036057051452947, 0.35537398360437217], "isController": false}, {"data": ["Feedback_GetinactiveFeedbacks", 2, 0, 0.0, 291.5, 276, 307, 291.5, 307.0, 307.0, 307.0, 0.15725743041358706, 0.13130381152696965, 0.1981075051108665], "isController": false}, {"data": ["MyStudent_DeleteSchedule", 2, 0, 0.0, 517.0, 504, 530, 517.0, 530.0, 530.0, 530.0, 0.05865102639296188, 0.12600806451612903, 0.07629215542521994], "isController": false}, {"data": ["Dashboard_ClassTrends", 4, 0, 0.0, 1268.0, 769, 2185, 1059.0, 2185.0, 2185.0, 2185.0, 0.09900990099009901, 0.09574663521039604, 0.12535775061881188], "isController": false}, {"data": ["Invoice_SendInvoice", 2, 0, 0.0, 286.5, 284, 289, 286.5, 289.0, 289.0, 289.0, 0.05900227158745612, 0.0385473825117267, 0.0773252426468419], "isController": false}, {"data": ["MyTeachers_GetTeacherAvailabilityDetails", 1, 0, 0.0, 266.0, 266, 266, 266.0, 266.0, 266.0, 266.0, 3.7593984962406015, 3.972333176691729, 4.827743186090225], "isController": false}, {"data": ["Feedback_SearchFeedback", 2, 0, 0.0, 360.0, 285, 435, 360.0, 435.0, 435.0, 435.0, 0.15535187199005746, 0.16566820723939724, 0.20056169411216404], "isController": false}, {"data": ["GetAuthorizationToken", 4, 0, 0.0, 427.75, 299, 766, 323.0, 766.0, 766.0, 766.0, 2.2792022792022792, 4.649105235042735, 0.8018384971509972], "isController": false}, {"data": ["MyCalender_dayschedules", 4, 0, 0.0, 1114.25, 621, 1865, 985.5, 1865.0, 1865.0, 1865.0, 0.11612378795796319, 5.733045019741044, 0.1525542243656738], "isController": false}, {"data": ["MyClasses_DeactivateOneononeClass", 2, 0, 0.0, 472.5, 450, 495, 472.5, 495.0, 495.0, 495.0, 0.07751637533428937, 0.15783363532421224, 0.1026486376497035], "isController": false}, {"data": ["Feedback_UpdateFeedbackKPI", 2, 0, 0.0, 315.0, 309, 321, 315.0, 321.0, 321.0, 321.0, 0.1550147263990079, 0.12231630754921718, 0.2131452487986359], "isController": false}, {"data": ["MyTeachers_DeactivateTeacher", 1, 0, 0.0, 576.0, 576, 576, 576.0, 576.0, 576.0, 576.0, 1.736111111111111, 2.955118815104167, 2.2599962022569446], "isController": false}, {"data": ["InviteFriends", 4, 0, 0.0, 374.25, 355, 412, 365.0, 412.0, 412.0, 412.0, 0.271333604666938, 0.1618992504409171, 0.36129235347985345], "isController": false}, {"data": ["MyClasses_GetactiveSchedules", 2, 0, 0.0, 2942.5, 2422, 3463, 2942.5, 3463.0, 3463.0, 3463.0, 0.07955449482895784, 4.596563929494829, 0.10022001789976133], "isController": false}, {"data": ["MyStudent_GetGuardianDetails", 2, 0, 0.0, 258.5, 258, 259, 258.5, 259.0, 259.0, 259.0, 0.05794749956539375, 0.0787157928666628, 0.07384910833285042], "isController": false}, {"data": ["MyAccount_GetAttendanceSetup", 1, 0, 0.0, 255.0, 255, 255, 255.0, 255.0, 255.0, 255.0, 3.9215686274509802, 2.8799019607843137, 5.0245098039215685], "isController": false}, {"data": ["Courses_ActivateCourse", 2, 0, 0.0, 326.5, 290, 363, 326.5, 363.0, 363.0, 363.0, 0.4352557127312296, 0.7400197225244832, 0.5699979597388466], "isController": false}, {"data": ["MyStudent_GetinactiveStudentDetails", 2, 0, 0.0, 1612.0, 434, 2790, 1612.0, 2790.0, 2790.0, 2790.0, 0.06657567990413102, 0.5587090871642089, 0.08347966112978929], "isController": false}, {"data": ["MyTeachers_UpdateTeacher", 1, 0, 0.0, 333.0, 333, 333, 333.0, 333.0, 333.0, 333.0, 3.003003003003003, 5.108624249249249, 5.577843468468468], "isController": false}, {"data": ["MyTeachers_NewTeacherAvailabilty", 1, 0, 0.0, 345.0, 345, 345, 345.0, 345.0, 345.0, 345.0, 2.898550724637681, 3.0570652173913047, 4.633718297101449], "isController": false}, {"data": ["Dashboard_Notifications", 4, 0, 0.0, 425.75, 259, 723, 360.5, 723.0, 723.0, 723.0, 0.1034875297526648, 2.0477443356747385, 0.13102693586360342], "isController": false}, {"data": ["Dashboard_ApplicationUser", 4, 0, 0.0, 362.75, 335, 386, 365.0, 386.0, 386.0, 386.0, 0.09813061184436485, 0.6454435580319906, 0.1239569789264511], "isController": false}, {"data": ["Feedback_GetFeedbackDetails", 2, 0, 0.0, 272.0, 271, 273, 272.0, 273.0, 273.0, 273.0, 0.26595744680851063, 0.2714116522606383, 0.33997880651595747], "isController": false}, {"data": ["MyCalender_monthschedules", 4, 0, 0.0, 6337.5, 1829, 17642, 2939.5, 17642.0, 17642.0, 17642.0, 0.10915838882218099, 87.18125537263946, 0.14340363531546774], "isController": false}, {"data": ["Feedback_DeactivateFeedback", 2, 0, 0.0, 303.5, 288, 319, 303.5, 319.0, 319.0, 319.0, 0.2655689815429558, 0.27127456513079273, 0.35322749302881423], "isController": false}, {"data": ["Dashboard_FeesCollection", 4, 0, 0.0, 411.0, 264, 598, 391.0, 598.0, 598.0, 598.0, 0.10395280542633645, 0.10377515170612542, 0.13252967527742404], "isController": false}, {"data": ["Courses_UpdateCourse", 2, 0, 0.0, 317.5, 316, 319, 317.5, 319.0, 319.0, 319.0, 0.19892580067634774, 0.3382127138452357, 0.34132092948080367], "isController": false}, {"data": ["MyClasses_NewOneonOneClass", 2, 0, 0.0, 559.0, 464, 654, 559.0, 654.0, 654.0, 654.0, 0.09298865538404315, 0.194059332573926, 0.16536361470150643], "isController": false}, {"data": ["Feedback_DeleteFeedback", 2, 0, 0.0, 290.0, 289, 291, 290.0, 291.0, 291.0, 291.0, 0.2637478570486615, 0.23129450745087696, 0.3428207009099301], "isController": false}, {"data": ["MyStudent_GetactiveStudentDetails", 2, 0, 0.0, 2850.5, 1828, 3873, 2850.5, 3873.0, 3873.0, 3873.0, 0.0687734259482136, 2.712587793576562, 0.08610110553282212], "isController": false}, {"data": ["Dashboard_ChatroomUsers", 4, 0, 0.0, 4740.0, 507, 11214, 3619.5, 11214.0, 11214.0, 11214.0, 0.09771827820393805, 0.2786497776909171, 0.12334069783065423], "isController": false}, {"data": ["MyStudent_SearchStudentDetails", 2, 0, 0.0, 1435.0, 455, 2415, 1435.0, 2415.0, 2415.0, 2415.0, 0.05762194243567951, 0.14990708461782246, 0.07444709945547263], "isController": false}, {"data": ["Dashboard_Current", 4, 0, 0.0, 594.25, 364, 1237, 388.0, 1237.0, 1237.0, 1237.0, 0.10081661457808247, 0.5166851497126727, 0.12725143978727693], "isController": false}, {"data": ["Reports_PartiallyPaidInvoices", 4, 0, 0.0, 552.0, 275, 1148, 392.5, 1148.0, 1148.0, 1148.0, 0.20794343938448742, 3.00000040613953, 0.2809470199105843], "isController": false}, {"data": ["Courses_DeactivateCourse", 2, 0, 0.0, 293.0, 291, 295, 293.0, 295.0, 295.0, 295.0, 0.4422821760283061, 0.7523979986731534, 0.580063439849624], "isController": false}, {"data": ["Courses_GetactiveCourses", 2, 0, 0.0, 899.5, 410, 1389, 899.5, 1389.0, 1389.0, 1389.0, 0.18037518037518038, 3.989832053796898, 0.22634971365440118], "isController": false}, {"data": ["MyStudent_DeleteEnrollment", 2, 0, 0.0, 295.5, 290, 301, 295.5, 301.0, 301.0, 301.0, 0.05918035212309513, 0.03531171401094836, 0.07709627903536026], "isController": false}, {"data": ["Courses_CreateNewCourse", 2, 0, 0.0, 360.0, 336, 384, 360.0, 384.0, 384.0, 384.0, 0.1984717673910886, 0.3345334673017763, 0.32154752158380473], "isController": false}, {"data": ["Feedback_ActivateFeedback", 2, 0, 0.0, 291.0, 288, 294, 291.0, 294.0, 294.0, 294.0, 0.2653927813163482, 0.2708354067144374, 0.35273396032377924], "isController": false}, {"data": ["Invoice_PrintInvoice", 2, 0, 0.0, 241.0, 237, 245, 241.0, 245.0, 245.0, 245.0, 0.059094669660796594, 0.01760143969388961, 0.07600359369459875], "isController": false}, {"data": ["Reports_CancelledInvoices", 4, 0, 0.0, 1293.25, 280, 2551, 1171.0, 2551.0, 2551.0, 2551.0, 0.1945903872348706, 5.346009832895505, 0.2619559070344425], "isController": false}, {"data": ["Courses_DeleteCourse", 2, 0, 0.0, 294.5, 284, 305, 294.5, 305.0, 305.0, 305.0, 0.4322455154527772, 0.7344796844607737, 0.5626789766587422], "isController": false}, {"data": ["MyTeachers_NewTeacher", 1, 0, 0.0, 446.0, 446, 446, 446.0, 446.0, 446.0, 446.0, 2.242152466367713, 3.8142867152466366, 4.094555773542601], "isController": false}, {"data": ["MyClasses_activateOneonOneClass", 2, 0, 0.0, 377.0, 355, 399, 377.0, 399.0, 399.0, 399.0, 0.07793321123796906, 0.15853015528192338, 0.10312451291742976], "isController": false}, {"data": ["MyStudent_activeStudent", 2, 0, 0.0, 1428.5, 497, 2360, 1428.5, 2360.0, 2360.0, 2360.0, 0.05302789267154523, 0.08984706424329197, 0.0698580343885884], "isController": false}, {"data": ["Dashboard_CourseTrends", 2, 0, 0.0, 289.0, 266, 312, 289.0, 312.0, 312.0, 312.0, 0.15661707126076743, 1.5527114330462022, 0.20066562255285827], "isController": false}, {"data": ["MyStudent_CreateNewEnrollment", 2, 0, 0.0, 660.0, 471, 849, 660.0, 849.0, 849.0, 849.0, 0.057615302624377036, 0.09565040474750093, 0.08923620113502145], "isController": false}, {"data": ["MyClasses_DeleteOneonOneClass", 2, 0, 0.0, 564.5, 479, 650, 564.5, 650.0, 650.0, 650.0, 0.0776910228023152, 0.16224829322534282, 0.10105902575457407], "isController": false}, {"data": ["MyStudent_CreateNewSchedule", 2, 0, 0.0, 482.5, 472, 493, 482.5, 493.0, 493.0, 493.0, 0.058251296091338035, 0.12526304100891245, 0.10461341163278381], "isController": false}, {"data": ["Invoice_CreateNewInvoice", 2, 0, 0.0, 450.0, 387, 513, 450.0, 513.0, 513.0, 513.0, 0.058431693350473296, 0.2797189070351759, 0.08679160701764636], "isController": false}, {"data": ["MyTeachers_GetTeacherDetails", 1, 0, 0.0, 260.0, 260, 260, 260.0, 260.0, 260.0, 260.0, 3.8461538461538463, 6.54296875, 4.8828125], "isController": false}, {"data": ["MyTeachers_activateTeacher", 1, 0, 0.0, 316.0, 316, 316, 316.0, 316.0, 316.0, 316.0, 3.1645569620253164, 5.383455300632911, 4.113305973101266], "isController": false}, {"data": ["MyClasses_SearchGroupClass", 2, 0, 0.0, 2522.0, 1237, 3807, 2522.0, 3807.0, 3807.0, 3807.0, 0.08863283846665189, 0.1828052293374695, 0.11459949036117881], "isController": false}, {"data": ["Feedback_GetactiveFeedbacks", 2, 0, 0.0, 710.5, 308, 1113, 710.5, 1113.0, 1113.0, 1113.0, 0.1478852410529429, 0.20565291333924876, 0.18601190476190477], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 245, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
