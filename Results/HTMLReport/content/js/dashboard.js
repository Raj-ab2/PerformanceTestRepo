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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8843888070692194, 2000, 2500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 2000, 2500, "MyStudent_AddGuardian"], "isController": false}, {"data": [1.0, 2000, 2500, "MyClasses_DeactivateGroupClass"], "isController": false}, {"data": [1.0, 2000, 2500, "Courses_SearchCourse"], "isController": false}, {"data": [1.0, 2000, 2500, "MyAccount_GetInvoiceconfig"], "isController": false}, {"data": [1.0, 2000, 2500, "MyAccount_GetCancellationfee"], "isController": false}, {"data": [1.0, 2000, 2500, "MyClasses_GetGroupClassDetails"], "isController": false}, {"data": [1.0, 2000, 2500, "MyStudent_DeleteGuardian"], "isController": false}, {"data": [1.0, 2000, 2500, "Dashboard_InvoiceSummary"], "isController": false}, {"data": [1.0, 2000, 2500, "MyAccount_GetLatefee"], "isController": false}, {"data": [1.0, 2000, 2500, "MyAccount_PutInvoiceconfig"], "isController": false}, {"data": [1.0, 2000, 2500, "MyStudent_GetStudentDetails"], "isController": false}, {"data": [1.0, 2000, 2500, "MyStudent_UpdateGuardian"], "isController": false}, {"data": [1.0, 2000, 2500, "MyClasses_GetOneonOneClassDetails"], "isController": false}, {"data": [0.9, 2000, 2500, "Dashboard_Contacts"], "isController": false}, {"data": [1.0, 2000, 2500, "MyClasses_DeleteGroupClass"], "isController": false}, {"data": [0.5, 2000, 2500, "MyCalender_weekschedules"], "isController": false}, {"data": [1.0, 2000, 2500, "MyStudent_InactiveEnrollment"], "isController": false}, {"data": [0.6, 2000, 2500, "Reports_OpenInvoices"], "isController": false}, {"data": [1.0, 2000, 2500, "MyAccount_PutAttendanceSetup"], "isController": false}, {"data": [1.0, 2000, 2500, "MyAccount_ProfileUpdate"], "isController": false}, {"data": [0.3333333333333333, 2000, 2500, "MyClasses_GetinactiveSchedules"], "isController": false}, {"data": [0.9166666666666666, 2000, 2500, "MyClasses_activateGroupClass"], "isController": false}, {"data": [1.0, 2000, 2500, "MyTeachers_GetactiveTeachers"], "isController": false}, {"data": [1.0, 2000, 2500, "Feedback_CreateNewFeedbackKPI"], "isController": false}, {"data": [1.0, 2000, 2500, "MyStudent_DeleteStudent"], "isController": false}, {"data": [1.0, 2000, 2500, "MyTeachers_SearchTeacher"], "isController": false}, {"data": [1.0, 2000, 2500, "MyClasses_UpdateOneonOneClass"], "isController": false}, {"data": [1.0, 2000, 2500, "MyAccount_Subscriptiondetail"], "isController": false}, {"data": [1.0, 2000, 2500, "Dashboard_Basic"], "isController": false}, {"data": [1.0, 2000, 2500, "MyClasses_NewGroupClass"], "isController": false}, {"data": [1.0, 2000, 2500, "MyAccount_PutLatefee"], "isController": false}, {"data": [0.9, 2000, 2500, "MyAccount_PreferencesUpdate"], "isController": false}, {"data": [1.0, 2000, 2500, "Feedback_UpdateFeedback"], "isController": false}, {"data": [1.0, 2000, 2500, "Invoice_GetInvoiceDetails"], "isController": false}, {"data": [1.0, 2000, 2500, "Invoice_UpdateInvoice"], "isController": false}, {"data": [1.0, 2000, 2500, "MyStudent_InactiveStudent"], "isController": false}, {"data": [0.5833333333333334, 2000, 2500, "MyStudent_CreateNewStudent"], "isController": false}, {"data": [0.8333333333333334, 2000, 2500, "MyStudent_UpdateStudent"], "isController": false}, {"data": [1.0, 2000, 2500, "Feedback_DeactivateFeedbackKPI"], "isController": false}, {"data": [0.6, 2000, 2500, "Reports_PaidInvoices"], "isController": false}, {"data": [1.0, 2000, 2500, "MyTeachers_GetinactiveSchedules"], "isController": false}, {"data": [1.0, 2000, 2500, "MyClasses_UpdateGroupClass"], "isController": false}, {"data": [1.0, 2000, 2500, "Invoice_ReceivePaymentInvoice"], "isController": false}, {"data": [1.0, 2000, 2500, "MyStudent_activeEnrollment"], "isController": false}, {"data": [0.7, 2000, 2500, "Reports_OverdueInvoices"], "isController": false}, {"data": [1.0, 2000, 2500, "MyTeachers_DeleteAvailability"], "isController": false}, {"data": [1.0, 2000, 2500, "Dashboard_ClassSchedule"], "isController": false}, {"data": [1.0, 2000, 2500, "Courses_GetinactiveCourses"], "isController": false}, {"data": [1.0, 2000, 2500, "Feedback_DeleteFeedbackKPI"], "isController": false}, {"data": [1.0, 2000, 2500, "MyAccount_PutCancellationfee"], "isController": false}, {"data": [1.0, 2000, 2500, "Feedback_CreateNewFeedback"], "isController": false}, {"data": [1.0, 2000, 2500, "Courses_GetCourseDetails"], "isController": false}, {"data": [0.8333333333333334, 2000, 2500, "MyTeachers_DeleteTeacher"], "isController": false}, {"data": [1.0, 2000, 2500, "Dashboard_Widget"], "isController": false}, {"data": [1.0, 2000, 2500, "MyAccount_SubscriptionReport"], "isController": false}, {"data": [1.0, 2000, 2500, "MyStudent_ReinviteStudent"], "isController": false}, {"data": [1.0, 2000, 2500, "Feedback_ActivateFeedbackKPI"], "isController": false}, {"data": [1.0, 2000, 2500, "Feedback_GetinactiveFeedbacks"], "isController": false}, {"data": [1.0, 2000, 2500, "MyStudent_DeleteSchedule"], "isController": false}, {"data": [0.8, 2000, 2500, "Dashboard_ClassTrends"], "isController": false}, {"data": [1.0, 2000, 2500, "Invoice_SendInvoice"], "isController": false}, {"data": [1.0, 2000, 2500, "MyTeachers_GetTeacherAvailabilityDetails"], "isController": false}, {"data": [1.0, 2000, 2500, "Feedback_SearchFeedback"], "isController": false}, {"data": [1.0, 2000, 2500, "GetAuthorizationToken"], "isController": false}, {"data": [0.45, 2000, 2500, "MyCalender_dayschedules"], "isController": false}, {"data": [1.0, 2000, 2500, "MyClasses_DeactivateOneononeClass"], "isController": false}, {"data": [1.0, 2000, 2500, "Feedback_UpdateFeedbackKPI"], "isController": false}, {"data": [0.8333333333333334, 2000, 2500, "MyTeachers_DeactivateTeacher"], "isController": false}, {"data": [0.8, 2000, 2500, "InviteFriends"], "isController": false}, {"data": [1.0, 2000, 2500, "MyTeachers_SubscriptionValidation"], "isController": false}, {"data": [0.3333333333333333, 2000, 2500, "MyClasses_GetactiveSchedules"], "isController": false}, {"data": [1.0, 2000, 2500, "MyStudent_GetGuardianDetails"], "isController": false}, {"data": [1.0, 2000, 2500, "MyAccount_GetAttendanceSetup"], "isController": false}, {"data": [1.0, 2000, 2500, "Courses_ActivateCourse"], "isController": false}, {"data": [1.0, 2000, 2500, "MyTeachers_UpdateTeacher"], "isController": false}, {"data": [0.4166666666666667, 2000, 2500, "MyStudent_GetinactiveStudentDetails"], "isController": false}, {"data": [0.8333333333333334, 2000, 2500, "MyTeachers_NewTeacherAvailabilty"], "isController": false}, {"data": [0.75, 2000, 2500, "Dashboard_Notifications"], "isController": false}, {"data": [1.0, 2000, 2500, "Feedback_GetFeedbackDetails"], "isController": false}, {"data": [1.0, 2000, 2500, "Dashboard_ApplicationUser"], "isController": false}, {"data": [0.35, 2000, 2500, "MyCalender_monthschedules"], "isController": false}, {"data": [1.0, 2000, 2500, "Feedback_DeactivateFeedback"], "isController": false}, {"data": [0.95, 2000, 2500, "Dashboard_FeesCollection"], "isController": false}, {"data": [1.0, 2000, 2500, "Courses_UpdateCourse"], "isController": false}, {"data": [1.0, 2000, 2500, "MyClasses_NewOneonOneClass"], "isController": false}, {"data": [1.0, 2000, 2500, "Feedback_DeleteFeedback"], "isController": false}, {"data": [0.3333333333333333, 2000, 2500, "MyStudent_GetactiveStudentDetails"], "isController": false}, {"data": [0.4, 2000, 2500, "Dashboard_ChatroomUsers"], "isController": false}, {"data": [0.75, 2000, 2500, "MyStudent_SearchStudentDetails"], "isController": false}, {"data": [0.75, 2000, 2500, "Dashboard_Current"], "isController": false}, {"data": [0.9, 2000, 2500, "Reports_PartiallyPaidInvoices"], "isController": false}, {"data": [1.0, 2000, 2500, "Courses_DeactivateCourse"], "isController": false}, {"data": [1.0, 2000, 2500, "Courses_GetactiveCourses"], "isController": false}, {"data": [1.0, 2000, 2500, "MyStudent_DeleteEnrollment"], "isController": false}, {"data": [0.9166666666666666, 2000, 2500, "Courses_CreateNewCourse"], "isController": false}, {"data": [1.0, 2000, 2500, "Feedback_ActivateFeedback"], "isController": false}, {"data": [1.0, 2000, 2500, "Invoice_PrintInvoice"], "isController": false}, {"data": [0.7, 2000, 2500, "Reports_CancelledInvoices"], "isController": false}, {"data": [1.0, 2000, 2500, "Courses_DeleteCourse"], "isController": false}, {"data": [0.6666666666666666, 2000, 2500, "MyTeachers_NewTeacher"], "isController": false}, {"data": [1.0, 2000, 2500, "MyClasses_activateOneonOneClass"], "isController": false}, {"data": [1.0, 2000, 2500, "MyStudent_activeStudent"], "isController": false}, {"data": [1.0, 2000, 2500, "Dashboard_CourseTrends"], "isController": false}, {"data": [1.0, 2000, 2500, "MyStudent_CreateNewEnrollment"], "isController": false}, {"data": [1.0, 2000, 2500, "MyClasses_DeleteOneonOneClass"], "isController": false}, {"data": [1.0, 2000, 2500, "MyStudent_CreateNewSchedule"], "isController": false}, {"data": [0.8333333333333334, 2000, 2500, "Invoice_CreateNewInvoice"], "isController": false}, {"data": [1.0, 2000, 2500, "MyTeachers_GetTeacherDetails"], "isController": false}, {"data": [1.0, 2000, 2500, "MyTeachers_activateTeacher"], "isController": false}, {"data": [0.3333333333333333, 2000, 2500, "MyClasses_SearchGroupClass"], "isController": false}, {"data": [1.0, 2000, 2500, "Feedback_GetactiveFeedbacks"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 679, 0, 0.0, 1456.9823269513977, 235, 35324, 633.0, 2559.0, 5907.0, 15769.000000000015, 8.375684610450486, 91.65074237445725, 11.642051753620418], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["MyStudent_AddGuardian", 6, 0, 0.0, 457.0, 324, 782, 408.0, 782.0, 782.0, 782.0, 0.17936683507219514, 0.10702454709874144, 0.2981272981375744], "isController": false}, {"data": ["MyClasses_DeactivateGroupClass", 6, 0, 0.0, 913.1666666666666, 447, 1342, 957.5, 1342.0, 1342.0, 1342.0, 0.32175032175032175, 0.6042244811776062, 0.4260678088803089], "isController": false}, {"data": ["Courses_SearchCourse", 6, 0, 0.0, 612.5, 339, 1019, 539.5, 1019.0, 1019.0, 1019.0, 0.7828810020876827, 1.4671373466858038, 1.0084180095250523], "isController": false}, {"data": ["MyAccount_GetInvoiceconfig", 3, 0, 0.0, 617.3333333333334, 539, 725, 588.0, 725.0, 725.0, 725.0, 0.46670815183571873, 0.8089911811605476, 0.6029832860143124], "isController": false}, {"data": ["MyAccount_GetCancellationfee", 3, 0, 0.0, 488.6666666666667, 328, 745, 393.0, 745.0, 745.0, 745.0, 0.37467216185837393, 0.35235282409142005, 0.483341724428625], "isController": false}, {"data": ["MyClasses_GetGroupClassDetails", 6, 0, 0.0, 410.5, 311, 536, 382.5, 536.0, 536.0, 536.0, 0.30152268958239103, 0.5606437509422584, 0.38750376903361977], "isController": false}, {"data": ["MyStudent_DeleteGuardian", 6, 0, 0.0, 394.0, 306, 486, 385.5, 486.0, 486.0, 486.0, 0.19401778496362165, 0.13092411075181892, 0.2540799312853678], "isController": false}, {"data": ["Dashboard_InvoiceSummary", 10, 0, 0.0, 517.6, 266, 1185, 290.0, 1175.6000000000001, 1185.0, 1185.0, 0.25363973012732716, 0.2180459515928575, 0.3255951418480191], "isController": false}, {"data": ["MyAccount_GetLatefee", 3, 0, 0.0, 676.0, 574, 752, 702.0, 752.0, 752.0, 752.0, 0.39898922729086317, 0.4328877260938955, 0.5127634991355233], "isController": false}, {"data": ["MyAccount_PutInvoiceconfig", 3, 0, 0.0, 530.0, 396, 749, 445.0, 749.0, 749.0, 749.0, 0.49228749589760423, 0.8533303761896948, 1.009093216688546], "isController": false}, {"data": ["MyStudent_GetStudentDetails", 6, 0, 0.0, 436.5, 293, 656, 380.5, 656.0, 656.0, 656.0, 0.18975332068311196, 0.45622331593927895, 0.24163899430740038], "isController": false}, {"data": ["MyStudent_UpdateGuardian", 6, 0, 0.0, 381.1666666666667, 284, 553, 361.0, 553.0, 553.0, 553.0, 0.19227071716977504, 0.26118024178042687, 0.31750955345125936], "isController": false}, {"data": ["MyClasses_GetOneonOneClassDetails", 6, 0, 0.0, 559.5, 309, 1207, 441.0, 1207.0, 1207.0, 1207.0, 0.38216560509554137, 0.7701159434713376, 0.49151572452229303], "isController": false}, {"data": ["Dashboard_Contacts", 10, 0, 0.0, 801.3, 277, 2559, 443.5, 2501.1000000000004, 2559.0, 2559.0, 0.25280614824552533, 1.1106188852512895, 0.31958745986702397], "isController": false}, {"data": ["MyClasses_DeleteGroupClass", 6, 0, 0.0, 670.6666666666666, 544, 1027, 601.0, 1027.0, 1027.0, 1027.0, 0.3575046177679795, 0.6844607452481677, 0.46503530358100453], "isController": false}, {"data": ["MyCalender_weekschedules", 10, 0, 0.0, 4497.8, 323, 20131, 2150.5, 18803.600000000006, 20131.0, 20131.0, 0.39047247169074584, 35.63206206071847, 0.528815648184303], "isController": false}, {"data": ["MyStudent_InactiveEnrollment", 6, 0, 0.0, 417.6666666666667, 318, 610, 391.5, 610.0, 610.0, 610.0, 0.21863498888605473, 0.32731195113508, 0.2895205516889553], "isController": false}, {"data": ["Reports_OpenInvoices", 10, 0, 0.0, 4946.8, 1061, 15701, 1816.0, 15413.5, 15701.0, 15701.0, 0.2650340568763086, 3.7244532016114067, 0.3727300247144258], "isController": false}, {"data": ["MyAccount_PutAttendanceSetup", 3, 0, 0.0, 688.0, 402, 1123, 539.0, 1123.0, 1123.0, 1123.0, 0.40966816878328555, 0.3008500614502253, 0.5760958623514952], "isController": false}, {"data": ["MyAccount_ProfileUpdate", 10, 0, 0.0, 862.8, 433, 1524, 792.5, 1487.9, 1524.0, 1524.0, 0.6003121623244086, 3.313793485112258, 2.0680284998199063], "isController": false}, {"data": ["MyClasses_GetinactiveSchedules", 6, 0, 0.0, 6083.333333333333, 435, 13038, 6460.0, 13038.0, 13038.0, 13038.0, 0.1667685807993774, 6.342960455000278, 0.21562656345544498], "isController": false}, {"data": ["MyClasses_activateGroupClass", 6, 0, 0.0, 1047.8333333333333, 628, 2022, 906.5, 2022.0, 2022.0, 2022.0, 0.32957978577313923, 0.6182839535841802, 0.4361138766822302], "isController": false}, {"data": ["MyTeachers_GetactiveTeachers", 3, 0, 0.0, 1625.3333333333333, 1450, 1765, 1661.0, 1765.0, 1765.0, 1765.0, 1.3386880856760375, 3.282661897590361, 1.713886797188755], "isController": false}, {"data": ["Feedback_CreateNewFeedbackKPI", 6, 0, 0.0, 621.5, 418, 1079, 525.5, 1079.0, 1079.0, 1079.0, 0.3408122692416927, 0.34047944476001135, 0.4599634336836126], "isController": false}, {"data": ["MyStudent_DeleteStudent", 6, 0, 0.0, 314.8333333333333, 274, 356, 315.0, 356.0, 356.0, 356.0, 0.23525721455457968, 0.4006724435382685, 0.3046397133782936], "isController": false}, {"data": ["MyTeachers_SearchTeacher", 3, 0, 0.0, 643.0, 508, 897, 524.0, 897.0, 897.0, 897.0, 3.3444816053511706, 6.346023202341137, 4.3112458193979935], "isController": false}, {"data": ["MyClasses_UpdateOneonOneClass", 6, 0, 0.0, 760.1666666666666, 573, 1227, 680.5, 1227.0, 1227.0, 1227.0, 0.3778099615893206, 0.7609082787607833, 0.6788772747308104], "isController": false}, {"data": ["MyAccount_Subscriptiondetail", 3, 0, 0.0, 1151.3333333333333, 1055, 1262, 1137.0, 1262.0, 1262.0, 1262.0, 0.4129955947136564, 0.3097466960352423, 0.5315705017896476], "isController": false}, {"data": ["Dashboard_Basic", 10, 0, 0.0, 374.59999999999997, 255, 1051, 297.0, 985.1000000000003, 1051.0, 1051.0, 0.24327940639824838, 0.1936256994282934, 0.30968233031261405], "isController": false}, {"data": ["MyClasses_NewGroupClass", 6, 0, 0.0, 930.0, 638, 1634, 756.5, 1634.0, 1634.0, 1634.0, 0.262501640635254, 0.4991120061687886, 0.4237453241895262], "isController": false}, {"data": ["MyAccount_PutLatefee", 3, 0, 0.0, 522.0, 472, 557, 537.0, 557.0, 557.0, 557.0, 0.4064489906516732, 0.4409812779433681, 0.5767288900555481], "isController": false}, {"data": ["MyAccount_PreferencesUpdate", 10, 0, 0.0, 1661.3999999999999, 1113, 2250, 1736.5, 2225.5, 2250.0, 2250.0, 0.5258176464402146, 0.6470021821432327, 0.8567643975444316], "isController": false}, {"data": ["Feedback_UpdateFeedback", 6, 0, 0.0, 661.8333333333334, 373, 959, 632.0, 959.0, 959.0, 959.0, 0.34029038112522686, 0.3399580662999092, 0.46291455166742285], "isController": false}, {"data": ["Invoice_GetInvoiceDetails", 6, 0, 0.0, 657.5, 377, 1605, 450.5, 1605.0, 1605.0, 1605.0, 0.21183448665442733, 1.015005770283152, 0.2707923271783646], "isController": false}, {"data": ["Invoice_UpdateInvoice", 6, 0, 0.0, 516.1666666666667, 422, 788, 479.0, 788.0, 788.0, 788.0, 0.21317416329140906, 1.021667710331841, 0.324757514389256], "isController": false}, {"data": ["MyStudent_InactiveStudent", 6, 0, 0.0, 928.0, 412, 1519, 1010.5, 1519.0, 1519.0, 1519.0, 0.22169671888856046, 0.37606171944280226, 0.29227594775347326], "isController": false}, {"data": ["MyStudent_CreateNewStudent", 6, 0, 0.0, 1910.0, 454, 3662, 1961.0, 3662.0, 3662.0, 3662.0, 0.17049329393043874, 0.28887291500909296, 0.306688132245965], "isController": false}, {"data": ["MyStudent_UpdateStudent", 6, 0, 0.0, 1106.5, 440, 2799, 936.0, 2799.0, 2799.0, 2799.0, 0.23016725487187356, 0.39222837866349547, 0.42302223991100196], "isController": false}, {"data": ["Feedback_DeactivateFeedbackKPI", 6, 0, 0.0, 646.0, 312, 1016, 582.5, 1016.0, 1016.0, 1016.0, 0.49079754601227, 0.38774923312883436, 0.6547162576687117], "isController": false}, {"data": ["Reports_PaidInvoices", 10, 0, 0.0, 2076.9, 298, 4548, 1871.5, 4395.0, 4548.0, 4548.0, 0.30816640986132515, 7.937000433359013, 0.4261664580123266], "isController": false}, {"data": ["MyTeachers_GetinactiveSchedules", 3, 0, 0.0, 670.0, 500, 773, 737.0, 773.0, 773.0, 773.0, 1.9193857965451055, 1.619481765834933, 2.4610874520153554], "isController": false}, {"data": ["MyClasses_UpdateGroupClass", 6, 0, 0.0, 831.6666666666666, 451, 1854, 620.5, 1854.0, 1854.0, 1854.0, 0.30158331239004776, 0.5730770136969088, 0.48918933777330986], "isController": false}, {"data": ["Invoice_ReceivePaymentInvoice", 6, 0, 0.0, 596.0, 349, 923, 586.0, 923.0, 923.0, 923.0, 0.2138122728244601, 1.056498501086879, 0.301647913548571], "isController": false}, {"data": ["MyStudent_activeEnrollment", 6, 0, 0.0, 492.3333333333333, 287, 1238, 357.5, 1238.0, 1238.0, 1238.0, 0.2213368747233289, 0.3343829542939354, 0.2928822902833112], "isController": false}, {"data": ["Reports_OverdueInvoices", 10, 0, 0.0, 1971.9, 286, 7178, 854.5, 6950.1, 7178.0, 7178.0, 0.3199181009661527, 2.4145381282391707, 0.44366767107620453], "isController": false}, {"data": ["MyTeachers_DeleteAvailability", 3, 0, 0.0, 1286.0, 1125, 1445, 1288.0, 1445.0, 1445.0, 1445.0, 1.5756302521008403, 1.6587201286764706, 2.0449341846113445], "isController": false}, {"data": ["Dashboard_ClassSchedule", 3, 0, 0.0, 1242.6666666666667, 765, 1507, 1456.0, 1507.0, 1507.0, 1507.0, 0.16406890894175555, 3.1113275909215203, 0.22158916119770303], "isController": false}, {"data": ["Courses_GetinactiveCourses", 6, 0, 0.0, 613.6666666666666, 380, 1006, 560.5, 1006.0, 1006.0, 1006.0, 0.7941760423560555, 0.6765490569159497, 1.0229669920582396], "isController": false}, {"data": ["Feedback_DeleteFeedbackKPI", 6, 0, 0.0, 601.1666666666667, 426, 727, 617.5, 727.0, 727.0, 727.0, 0.5551443375277572, 0.36160280579200593, 0.7264584104367136], "isController": false}, {"data": ["MyAccount_PutCancellationfee", 3, 0, 0.0, 635.0, 511, 771, 623.0, 771.0, 771.0, 771.0, 0.3864485379363648, 0.36342767776632745, 0.6057127962772124], "isController": false}, {"data": ["Feedback_CreateNewFeedback", 6, 0, 0.0, 642.8333333333334, 411, 1019, 609.0, 1019.0, 1019.0, 1019.0, 0.33375980419424817, 0.2936695152138844, 0.4527269219002058], "isController": false}, {"data": ["Courses_GetCourseDetails", 6, 0, 0.0, 489.83333333333337, 386, 673, 436.0, 673.0, 673.0, 673.0, 0.7027406886858749, 1.19960031623331, 0.8997002371749824], "isController": false}, {"data": ["MyTeachers_DeleteTeacher", 3, 0, 0.0, 1420.6666666666667, 931, 2089, 1242.0, 2089.0, 2089.0, 2089.0, 1.2484394506866416, 2.122590901997503, 1.6117548377028714], "isController": false}, {"data": ["Dashboard_Widget", 10, 0, 0.0, 455.3, 371, 966, 411.5, 912.3000000000002, 966.0, 966.0, 0.24296022741077286, 0.7663686860710902, 0.3190039314001798], "isController": false}, {"data": ["MyAccount_SubscriptionReport", 3, 0, 0.0, 388.3333333333333, 345, 470, 350.0, 470.0, 470.0, 470.0, 0.47273873306019537, 0.33331773952095806, 0.6158529979514655], "isController": false}, {"data": ["MyStudent_ReinviteStudent", 6, 0, 0.0, 365.0, 277, 477, 348.0, 477.0, 477.0, 477.0, 0.17874165872259293, 0.10665151706982841, 0.22883819783722595], "isController": false}, {"data": ["Feedback_ActivateFeedbackKPI", 6, 0, 0.0, 454.33333333333337, 328, 545, 483.0, 545.0, 545.0, 545.0, 0.5195704883962591, 0.4099735885001732, 0.6925915201766539], "isController": false}, {"data": ["Feedback_GetinactiveFeedbacks", 6, 0, 0.0, 571.8333333333333, 414, 839, 489.0, 839.0, 839.0, 839.0, 0.3333518528807156, 0.27833577559864436, 0.43036245069170515], "isController": false}, {"data": ["MyStudent_DeleteSchedule", 6, 0, 0.0, 669.5, 478, 893, 630.5, 893.0, 893.0, 893.0, 0.2152775286139715, 0.4610036529905637, 0.28002897276739264], "isController": false}, {"data": ["Dashboard_ClassTrends", 10, 0, 0.0, 1884.2, 297, 5007, 1691.0, 4908.1, 5007.0, 5007.0, 0.2674297328376969, 0.2152757116973765, 0.3409467931832161], "isController": false}, {"data": ["Invoice_SendInvoice", 6, 0, 0.0, 340.5, 297, 468, 307.5, 468.0, 468.0, 468.0, 0.21704529011720444, 0.14180009676602517, 0.2844480266965707], "isController": false}, {"data": ["MyTeachers_GetTeacherAvailabilityDetails", 3, 0, 0.0, 851.6666666666666, 781, 975, 799.0, 975.0, 975.0, 975.0, 2.3866348448687353, 2.5218153341288785, 3.0648679892601436], "isController": false}, {"data": ["Feedback_SearchFeedback", 6, 0, 0.0, 569.3333333333333, 424, 922, 501.5, 922.0, 922.0, 922.0, 0.34015533760417255, 0.3627437779919497, 0.4391458557741369], "isController": false}, {"data": ["GetAuthorizationToken", 10, 0, 0.0, 390.09999999999997, 342, 773, 348.0, 731.3000000000002, 773.0, 773.0, 2.536783358701167, 5.235583935819381, 0.8935720287924911], "isController": false}, {"data": ["MyCalender_dayschedules", 10, 0, 0.0, 3101.0, 1029, 8390, 2370.0, 8039.000000000002, 8390.0, 8390.0, 0.38106851611919823, 8.31778792108071, 0.5160799005411173], "isController": false}, {"data": ["MyClasses_DeactivateOneononeClass", 6, 0, 0.0, 707.8333333333334, 461, 1633, 524.0, 1633.0, 1633.0, 1633.0, 0.3829461322440643, 0.7795421998659688, 0.5071044485575696], "isController": false}, {"data": ["Feedback_UpdateFeedbackKPI", 6, 0, 0.0, 575.3333333333334, 423, 806, 504.5, 806.0, 806.0, 806.0, 0.3392130257801899, 0.26766027815468113, 0.4664179104477612], "isController": false}, {"data": ["MyTeachers_DeactivateTeacher", 3, 0, 0.0, 1786.3333333333333, 1439, 2205, 1715.0, 2205.0, 2205.0, 2205.0, 1.0826416456153014, 1.842816785456514, 1.409337220317575], "isController": false}, {"data": ["InviteFriends", 10, 0, 0.0, 1531.4, 650, 3324, 1331.5, 3220.7000000000003, 3324.0, 3324.0, 0.5425052894265718, 0.323701886562144, 0.7271372165409863], "isController": false}, {"data": ["MyTeachers_SubscriptionValidation", 3, 0, 0.0, 1547.6666666666667, 1468, 1604, 1571.0, 1604.0, 1604.0, 1604.0, 1.124859392575928, 0.32735165916760406, 1.479673439257593], "isController": false}, {"data": ["MyClasses_GetactiveSchedules", 6, 0, 0.0, 8410.333333333332, 1215, 16404, 9452.5, 16404.0, 16404.0, 16404.0, 0.1362985847663615, 5.302556237363985, 0.17596360259875968], "isController": false}, {"data": ["MyStudent_GetGuardianDetails", 6, 0, 0.0, 342.83333333333337, 279, 508, 318.0, 508.0, 508.0, 508.0, 0.19069412662090007, 0.25903860364225784, 0.24302327660183068], "isController": false}, {"data": ["MyAccount_GetAttendanceSetup", 3, 0, 0.0, 462.6666666666667, 385, 573, 430.0, 573.0, 573.0, 573.0, 0.4094445202675037, 0.3006858195714481, 0.5246007915927392], "isController": false}, {"data": ["Courses_ActivateCourse", 6, 0, 0.0, 590.1666666666667, 402, 800, 580.5, 800.0, 800.0, 800.0, 0.6903693476009665, 1.1784820503969622, 0.9040872022782188], "isController": false}, {"data": ["MyTeachers_UpdateTeacher", 3, 0, 0.0, 1517.3333333333333, 1373, 1595, 1584.0, 1595.0, 1595.0, 1595.0, 1.3921113689095126, 2.368220707656613, 2.585738109048724], "isController": false}, {"data": ["MyStudent_GetinactiveStudentDetails", 6, 0, 0.0, 3163.0, 296, 10482, 2417.5, 10482.0, 10482.0, 10482.0, 0.16032492518170158, 0.566825850390124, 0.20604257962804617], "isController": false}, {"data": ["MyTeachers_NewTeacherAvailabilty", 3, 0, 0.0, 1882.3333333333333, 1748, 2098, 1801.0, 2098.0, 2098.0, 2098.0, 1.4091122592766556, 1.4861730859558477, 2.2526530941756695], "isController": false}, {"data": ["Dashboard_Notifications", 10, 0, 0.0, 1794.9, 266, 6813, 1131.5, 6470.700000000001, 6813.0, 6813.0, 0.2471637954472429, 8.908661777972762, 0.3151097021058355], "isController": false}, {"data": ["Feedback_GetFeedbackDetails", 6, 0, 0.0, 458.6666666666667, 395, 551, 448.5, 551.0, 551.0, 551.0, 0.5524861878453039, 0.5638164709944752, 0.7062543162983426], "isController": false}, {"data": ["Dashboard_ApplicationUser", 10, 0, 0.0, 907.5, 326, 1773, 793.5, 1746.9, 1773.0, 1773.0, 0.33637189276464063, 2.259703015153554, 0.42785584992768005], "isController": false}, {"data": ["MyCalender_monthschedules", 10, 0, 0.0, 5745.700000000001, 354, 23657, 3997.5, 22098.600000000006, 23657.0, 23657.0, 0.2090344697840674, 71.15821182116056, 0.2830947291958444], "isController": false}, {"data": ["Feedback_DeactivateFeedback", 6, 0, 0.0, 589.8333333333333, 329, 968, 455.5, 968.0, 968.0, 968.0, 0.5223295899712719, 0.5335515147558109, 0.6947391616610081], "isController": false}, {"data": ["Dashboard_FeesCollection", 10, 0, 0.0, 626.8, 246, 2117, 344.5, 2055.7000000000003, 2117.0, 2117.0, 0.2591344908007256, 0.21636717737755892, 0.33264871890386105], "isController": false}, {"data": ["Courses_UpdateCourse", 6, 0, 0.0, 1011.3333333333334, 537, 1873, 808.5, 1873.0, 1873.0, 1873.0, 0.6548073774964531, 1.1177766561169922, 1.1235317990832696], "isController": false}, {"data": ["MyClasses_NewOneonOneClass", 6, 0, 0.0, 907.8333333333334, 502, 1256, 944.5, 1256.0, 1256.0, 1256.0, 0.37034750941299915, 0.774028705789766, 0.6585964986729214], "isController": false}, {"data": ["Feedback_DeleteFeedback", 6, 0, 0.0, 505.3333333333333, 352, 612, 512.0, 612.0, 612.0, 612.0, 0.5627462014631401, 0.49350203995498026, 0.7314601505346089], "isController": false}, {"data": ["MyStudent_GetactiveStudentDetails", 6, 0, 0.0, 10879.833333333332, 1060, 27863, 11607.5, 27863.0, 27863.0, 27863.0, 0.12286270093170881, 3.7141170523190334, 0.15765780178150915], "isController": false}, {"data": ["Dashboard_ChatroomUsers", 10, 0, 0.0, 6982.999999999999, 270, 35324, 2870.5, 33395.70000000001, 35324.0, 35324.0, 0.2701826434669837, 0.3964349822354912, 0.3434010844455852], "isController": false}, {"data": ["MyStudent_SearchStudentDetails", 6, 0, 0.0, 1616.6666666666667, 351, 3116, 1838.0, 3116.0, 3116.0, 3116.0, 0.18162005085361424, 0.47237767132824793, 0.23465168679622228], "isController": false}, {"data": ["Dashboard_Current", 10, 0, 0.0, 2314.7, 1046, 6155, 1331.0, 6130.2, 6155.0, 6155.0, 0.2335411849879726, 1.2890834822158388, 0.2968299338494593], "isController": false}, {"data": ["Reports_PartiallyPaidInvoices", 10, 0, 0.0, 1379.3999999999999, 288, 8557, 527.5, 7855.600000000002, 8557.0, 8557.0, 0.3240860772621208, 2.1709652802534354, 0.45134683084327193], "isController": false}, {"data": ["Courses_DeactivateCourse", 6, 0, 0.0, 757.6666666666666, 495, 1153, 686.5, 1153.0, 1153.0, 1153.0, 0.6634966272254782, 1.1332574228685173, 0.8701913773084154], "isController": false}, {"data": ["Courses_GetactiveCourses", 6, 0, 0.0, 1592.3333333333333, 1327, 1804, 1649.0, 1804.0, 1804.0, 1804.0, 0.6807351940095302, 10.381654895620603, 0.8755158696392104], "isController": false}, {"data": ["MyStudent_DeleteEnrollment", 6, 0, 0.0, 351.5, 280, 494, 325.0, 494.0, 494.0, 494.0, 0.22179506136330032, 0.13234060790329735, 0.28894005064320566], "isController": false}, {"data": ["Courses_CreateNewCourse", 6, 0, 0.0, 1063.5, 570, 2352, 880.5, 2352.0, 2352.0, 2352.0, 0.7623888182973316, 1.2902537325285897, 1.2351592280813215], "isController": false}, {"data": ["Feedback_ActivateFeedback", 6, 0, 0.0, 503.6666666666667, 392, 683, 451.5, 683.0, 683.0, 683.0, 0.5463485703879075, 0.5575529844290658, 0.7261527385722091], "isController": false}, {"data": ["Invoice_PrintInvoice", 6, 0, 0.0, 256.5, 235, 279, 256.0, 279.0, 279.0, 279.0, 0.2173834281366617, 0.06474799373211115, 0.2795839598202964], "isController": false}, {"data": ["Reports_CancelledInvoices", 10, 0, 0.0, 3010.6, 308, 13261, 844.0, 12864.000000000002, 13261.0, 13261.0, 0.3263601057406743, 4.773175901977742, 0.45292026002741426], "isController": false}, {"data": ["Courses_DeleteCourse", 6, 0, 0.0, 730.8333333333334, 611, 1010, 698.5, 1010.0, 1010.0, 1010.0, 0.6590509666080844, 1.1243769908831285, 0.8579247446177505], "isController": false}, {"data": ["MyTeachers_NewTeacher", 3, 0, 0.0, 1893.0, 1322, 2605, 1752.0, 2605.0, 2605.0, 2605.0, 1.1516314779270633, 1.9591230806142035, 2.1030770153550864], "isController": false}, {"data": ["MyClasses_activateOneonOneClass", 6, 0, 0.0, 458.6666666666667, 376, 645, 440.0, 645.0, 645.0, 645.0, 0.41467965996267886, 0.8433304608127722, 0.5487216203607713], "isController": false}, {"data": ["MyStudent_activeStudent", 6, 0, 0.0, 776.3333333333334, 342, 1535, 759.5, 1535.0, 1535.0, 1535.0, 0.22852789944772425, 0.3872030327556656, 0.3010587269091602], "isController": false}, {"data": ["Dashboard_CourseTrends", 3, 0, 0.0, 276.0, 242, 313, 273.0, 313.0, 313.0, 313.0, 0.17573662937144865, 0.5691418377658016, 0.2246477029758069], "isController": false}, {"data": ["MyStudent_CreateNewEnrollment", 6, 0, 0.0, 874.1666666666667, 461, 1758, 616.5, 1758.0, 1758.0, 1758.0, 0.19395506707612736, 0.32051201107160177, 0.3004030628737676], "isController": false}, {"data": ["MyClasses_DeleteOneonOneClass", 6, 0, 0.0, 784.6666666666667, 493, 1052, 806.0, 1052.0, 1052.0, 1052.0, 0.41319468356173816, 0.8627725578472557, 0.5374758969767922], "isController": false}, {"data": ["MyStudent_CreateNewSchedule", 6, 0, 0.0, 942.0, 416, 1634, 850.5, 1634.0, 1634.0, 1634.0, 0.20249063480814014, 0.43378608973709964, 0.36365261466032195], "isController": false}, {"data": ["Invoice_CreateNewInvoice", 6, 0, 0.0, 850.0, 346, 2507, 490.5, 2507.0, 2507.0, 2507.0, 0.2086738775084339, 0.9996918799777414, 0.3099540700100859], "isController": false}, {"data": ["MyTeachers_GetTeacherDetails", 3, 0, 0.0, 564.6666666666666, 487, 620, 587.0, 620.0, 620.0, 620.0, 2.997002997002997, 5.098417207792209, 3.8047889610389616], "isController": false}, {"data": ["MyTeachers_activateTeacher", 3, 0, 0.0, 979.0, 805, 1076, 1056.0, 1076.0, 1076.0, 1076.0, 1.611170784103115, 2.7408784237379162, 2.094207337540279], "isController": false}, {"data": ["MyClasses_SearchGroupClass", 6, 0, 0.0, 3097.5, 648, 7584, 2942.0, 7584.0, 7584.0, 7584.0, 0.2684203462622467, 0.5526995118104951, 0.34705911958126423], "isController": false}, {"data": ["Feedback_GetactiveFeedbacks", 6, 0, 0.0, 1510.5, 1237, 1841, 1531.0, 1841.0, 1841.0, 1841.0, 0.3107842121620221, 0.4383048825494665, 0.4006202734901067], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 679, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
