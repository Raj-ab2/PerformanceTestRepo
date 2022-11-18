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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9377662091812589, 2000, 2500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 2000, 2500, "MyStudent_AddGuardian"], "isController": false}, {"data": [0.9722222222222222, 2000, 2500, "MyClasses_DeactivateGroupClass"], "isController": false}, {"data": [1.0, 2000, 2500, "Courses_SearchCourse"], "isController": false}, {"data": [1.0, 2000, 2500, "MyAccount_GetInvoiceconfig"], "isController": false}, {"data": [1.0, 2000, 2500, "MyAccount_GetCancellationfee"], "isController": false}, {"data": [1.0, 2000, 2500, "MyClasses_GetGroupClassDetails"], "isController": false}, {"data": [1.0, 2000, 2500, "MyStudent_DeleteGuardian"], "isController": false}, {"data": [1.0, 2000, 2500, "Dashboard_InvoiceSummary"], "isController": false}, {"data": [1.0, 2000, 2500, "MyAccount_GetLatefee"], "isController": false}, {"data": [1.0, 2000, 2500, "MyStudent_GetStudentDetails"], "isController": false}, {"data": [1.0, 2000, 2500, "MyAccount_PutInvoiceconfig"], "isController": false}, {"data": [1.0, 2000, 2500, "MyStudent_UpdateGuardian"], "isController": false}, {"data": [1.0, 2000, 2500, "MyClasses_GetOneonOneClassDetails"], "isController": false}, {"data": [1.0, 2000, 2500, "Dashboard_Contacts"], "isController": false}, {"data": [1.0, 2000, 2500, "MyClasses_DeleteGroupClass"], "isController": false}, {"data": [0.6041666666666666, 2000, 2500, "MyCalender_weekschedules"], "isController": false}, {"data": [1.0, 2000, 2500, "MyStudent_InactiveEnrollment"], "isController": false}, {"data": [0.6666666666666666, 2000, 2500, "Reports_OpenInvoices"], "isController": false}, {"data": [1.0, 2000, 2500, "Subscription_GetOpenInvoices"], "isController": false}, {"data": [1.0, 2000, 2500, "MyAccount_PutAttendanceSetup"], "isController": false}, {"data": [1.0, 2000, 2500, "MyAccount_ProfileUpdate"], "isController": false}, {"data": [0.5833333333333334, 2000, 2500, "MyClasses_GetinactiveSchedules"], "isController": false}, {"data": [1.0, 2000, 2500, "MyClasses_activateGroupClass"], "isController": false}, {"data": [0.9615384615384616, 2000, 2500, "MyTeachers_GetactiveTeachers"], "isController": false}, {"data": [1.0, 2000, 2500, "Feedback_CreateNewFeedbackKPI"], "isController": false}, {"data": [1.0, 2000, 2500, "MyStudent_DeleteStudent"], "isController": false}, {"data": [1.0, 2000, 2500, "MyTeachers_SearchTeacher"], "isController": false}, {"data": [1.0, 2000, 2500, "MyClasses_UpdateOneonOneClass"], "isController": false}, {"data": [0.9615384615384616, 2000, 2500, "MyAccount_Subscriptiondetail"], "isController": false}, {"data": [1.0, 2000, 2500, "Dashboard_Basic"], "isController": false}, {"data": [1.0, 2000, 2500, "MyClasses_NewGroupClass"], "isController": false}, {"data": [1.0, 2000, 2500, "MyAccount_PutLatefee"], "isController": false}, {"data": [0.9791666666666666, 2000, 2500, "MyAccount_PreferencesUpdate"], "isController": false}, {"data": [1.0, 2000, 2500, "Feedback_UpdateFeedback"], "isController": false}, {"data": [1.0, 2000, 2500, "Invoice_GetInvoiceDetails"], "isController": false}, {"data": [1.0, 2000, 2500, "Invoice_UpdateInvoice"], "isController": false}, {"data": [0.9444444444444444, 2000, 2500, "MyStudent_InactiveStudent"], "isController": false}, {"data": [0.8888888888888888, 2000, 2500, "MyStudent_CreateNewStudent"], "isController": false}, {"data": [0.9444444444444444, 2000, 2500, "MyStudent_UpdateStudent"], "isController": false}, {"data": [1.0, 2000, 2500, "Feedback_DeactivateFeedbackKPI"], "isController": false}, {"data": [0.8958333333333334, 2000, 2500, "Reports_PaidInvoices"], "isController": false}, {"data": [1.0, 2000, 2500, "MyTeachers_GetinactiveSchedules"], "isController": false}, {"data": [1.0, 2000, 2500, "MyClasses_UpdateGroupClass"], "isController": false}, {"data": [1.0, 2000, 2500, "Invoice_ReceivePaymentInvoice"], "isController": false}, {"data": [1.0, 2000, 2500, "MyStudent_activeEnrollment"], "isController": false}, {"data": [0.8958333333333334, 2000, 2500, "Reports_OverdueInvoices"], "isController": false}, {"data": [1.0, 2000, 2500, "MyTeachers_DeleteAvailability"], "isController": false}, {"data": [0.6538461538461539, 2000, 2500, "Dashboard_ClassSchedule"], "isController": false}, {"data": [1.0, 2000, 2500, "Courses_GetinactiveCourses"], "isController": false}, {"data": [1.0, 2000, 2500, "Feedback_DeleteFeedbackKPI"], "isController": false}, {"data": [1.0, 2000, 2500, "MyAccount_PutCancellationfee"], "isController": false}, {"data": [1.0, 2000, 2500, "Feedback_CreateNewFeedback"], "isController": false}, {"data": [1.0, 2000, 2500, "Courses_GetCourseDetails"], "isController": false}, {"data": [1.0, 2000, 2500, "MyTeachers_DeleteTeacher"], "isController": false}, {"data": [1.0, 2000, 2500, "Dashboard_Widget"], "isController": false}, {"data": [1.0, 2000, 2500, "MyAccount_SubscriptionReport"], "isController": false}, {"data": [1.0, 2000, 2500, "MyStudent_ReinviteStudent"], "isController": false}, {"data": [1.0, 2000, 2500, "Feedback_ActivateFeedbackKPI"], "isController": false}, {"data": [1.0, 2000, 2500, "Feedback_GetinactiveFeedbacks"], "isController": false}, {"data": [1.0, 2000, 2500, "MyStudent_DeleteSchedule"], "isController": false}, {"data": [1.0, 2000, 2500, "Subscription_GetSubscriptiondetail"], "isController": false}, {"data": [0.5, 2000, 2500, "Dashboard_ClassTrends"], "isController": false}, {"data": [1.0, 2000, 2500, "Invoice_SendInvoice"], "isController": false}, {"data": [1.0, 2000, 2500, "Subscription_GetSubscriptionreport"], "isController": false}, {"data": [1.0, 2000, 2500, "MyTeachers_GetTeacherAvailabilityDetails"], "isController": false}, {"data": [1.0, 2000, 2500, "Feedback_SearchFeedback"], "isController": false}, {"data": [1.0, 2000, 2500, "GetAuthorizationToken"], "isController": false}, {"data": [0.375, 2000, 2500, "MyCalender_dayschedules"], "isController": false}, {"data": [1.0, 2000, 2500, "MyClasses_DeactivateOneononeClass"], "isController": false}, {"data": [1.0, 2000, 2500, "Feedback_UpdateFeedbackKPI"], "isController": false}, {"data": [1.0, 2000, 2500, "MyTeachers_DeactivateTeacher"], "isController": false}, {"data": [1.0, 2000, 2500, "InviteFriends"], "isController": false}, {"data": [1.0, 2000, 2500, "MyTeachers_SubscriptionValidation"], "isController": false}, {"data": [0.4444444444444444, 2000, 2500, "MyClasses_GetactiveSchedules"], "isController": false}, {"data": [1.0, 2000, 2500, "MyStudent_GetGuardianDetails"], "isController": false}, {"data": [1.0, 2000, 2500, "MyAccount_GetAttendanceSetup"], "isController": false}, {"data": [1.0, 2000, 2500, "Courses_ActivateCourse"], "isController": false}, {"data": [1.0, 2000, 2500, "MyTeachers_UpdateTeacher"], "isController": false}, {"data": [0.8888888888888888, 2000, 2500, "MyStudent_GetinactiveStudentDetails"], "isController": false}, {"data": [1.0, 2000, 2500, "MyTeachers_NewTeacherAvailabilty"], "isController": false}, {"data": [1.0, 2000, 2500, "Dashboard_Notifications"], "isController": false}, {"data": [0.9791666666666666, 2000, 2500, "Dashboard_ApplicationUser"], "isController": false}, {"data": [1.0, 2000, 2500, "Feedback_GetFeedbackDetails"], "isController": false}, {"data": [0.5, 2000, 2500, "MyCalender_monthschedules"], "isController": false}, {"data": [1.0, 2000, 2500, "Subscription_addTeacherValidation"], "isController": false}, {"data": [1.0, 2000, 2500, "Feedback_DeactivateFeedback"], "isController": false}, {"data": [1.0, 2000, 2500, "Subscription_GetAutoPaymentDetails"], "isController": false}, {"data": [1.0, 2000, 2500, "Dashboard_FeesCollection"], "isController": false}, {"data": [1.0, 2000, 2500, "Courses_UpdateCourse"], "isController": false}, {"data": [0.9722222222222222, 2000, 2500, "MyClasses_NewOneonOneClass"], "isController": false}, {"data": [1.0, 2000, 2500, "Feedback_DeleteFeedback"], "isController": false}, {"data": [0.7222222222222222, 2000, 2500, "MyStudent_GetactiveStudentDetails"], "isController": false}, {"data": [0.8125, 2000, 2500, "Dashboard_ChatroomUsers"], "isController": false}, {"data": [0.8888888888888888, 2000, 2500, "MyStudent_SearchStudentDetails"], "isController": false}, {"data": [0.4583333333333333, 2000, 2500, "Dashboard_Current"], "isController": false}, {"data": [0.9375, 2000, 2500, "Reports_PartiallyPaidInvoices"], "isController": false}, {"data": [1.0, 2000, 2500, "Courses_DeactivateCourse"], "isController": false}, {"data": [1.0, 2000, 2500, "Courses_GetactiveCourses"], "isController": false}, {"data": [1.0, 2000, 2500, "MyStudent_DeleteEnrollment"], "isController": false}, {"data": [1.0, 2000, 2500, "Courses_CreateNewCourse"], "isController": false}, {"data": [1.0, 2000, 2500, "Feedback_ActivateFeedback"], "isController": false}, {"data": [1.0, 2000, 2500, "Invoice_PrintInvoice"], "isController": false}, {"data": [0.8125, 2000, 2500, "Reports_CancelledInvoices"], "isController": false}, {"data": [1.0, 2000, 2500, "Courses_DeleteCourse"], "isController": false}, {"data": [0.9230769230769231, 2000, 2500, "MyTeachers_NewTeacher"], "isController": false}, {"data": [1.0, 2000, 2500, "MyClasses_activateOneonOneClass"], "isController": false}, {"data": [1.0, 2000, 2500, "MyStudent_activeStudent"], "isController": false}, {"data": [1.0, 2000, 2500, "Dashboard_CourseTrends"], "isController": false}, {"data": [0.9722222222222222, 2000, 2500, "MyStudent_CreateNewEnrollment"], "isController": false}, {"data": [0.9444444444444444, 2000, 2500, "MyClasses_DeleteOneonOneClass"], "isController": false}, {"data": [1.0, 2000, 2500, "MyStudent_CreateNewSchedule"], "isController": false}, {"data": [0.9166666666666666, 2000, 2500, "Invoice_CreateNewInvoice"], "isController": false}, {"data": [1.0, 2000, 2500, "Subscription_GetPaymentHistory"], "isController": false}, {"data": [1.0, 2000, 2500, "MyTeachers_GetTeacherDetails"], "isController": false}, {"data": [1.0, 2000, 2500, "MyTeachers_activateTeacher"], "isController": false}, {"data": [0.8055555555555556, 2000, 2500, "MyClasses_SearchGroupClass"], "isController": false}, {"data": [0.9444444444444444, 2000, 2500, "Feedback_GetactiveFeedbacks"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 2113, 0, 0.0, 862.8854708944632, 243, 15331, 458.0, 1641.0000000000007, 2557.9999999999995, 7484.3000000000775, 14.936556745484749, 127.77830012061287, 20.432533002862897], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["MyStudent_AddGuardian", 18, 0, 0.0, 438.1111111111111, 281, 938, 426.0, 654.5000000000005, 938.0, 938.0, 0.184305373525557, 0.10997127267980013, 0.3016260629556438], "isController": false}, {"data": ["MyClasses_DeactivateGroupClass", 18, 0, 0.0, 673.3888888888888, 399, 2208, 526.0, 1031.7000000000019, 2208.0, 2208.0, 0.3165057762304162, 0.634471133134638, 0.41103508928100435], "isController": false}, {"data": ["Courses_SearchCourse", 18, 0, 0.0, 352.61111111111114, 268, 420, 362.5, 411.90000000000003, 420.0, 420.0, 1.2315270935960592, 2.328489540571976, 1.5548430444376027], "isController": false}, {"data": ["MyAccount_GetInvoiceconfig", 13, 0, 0.0, 346.53846153846155, 280, 456, 328.0, 450.4, 456.0, 456.0, 0.499923088755576, 0.8657397059106291, 0.6321893987463467], "isController": false}, {"data": ["MyAccount_GetCancellationfee", 13, 0, 0.0, 414.84615384615387, 256, 1311, 341.0, 968.1999999999997, 1311.0, 1311.0, 0.5094243504839532, 0.47762359663388065, 0.6432094713742702], "isController": false}, {"data": ["MyClasses_GetGroupClassDetails", 18, 0, 0.0, 418.27777777777777, 271, 543, 425.5, 537.6, 543.0, 543.0, 0.3106447604583736, 0.6169581567979429, 0.3912890301411708], "isController": false}, {"data": ["MyStudent_DeleteGuardian", 18, 0, 0.0, 434.3333333333333, 269, 819, 376.0, 782.1, 819.0, 819.0, 0.1823431089500076, 0.12304598465278832, 0.2341316384288102], "isController": false}, {"data": ["Dashboard_InvoiceSummary", 24, 0, 0.0, 385.95833333333337, 263, 1107, 350.0, 529.5, 969.25, 1107.0, 0.3776553894571204, 0.3248549370574351, 0.47732469512195125], "isController": false}, {"data": ["MyAccount_GetLatefee", 13, 0, 0.0, 317.2307692307692, 255, 525, 294.0, 472.59999999999997, 525.0, 525.0, 0.5102641598304353, 0.5535400189386506, 0.6417783073949052], "isController": false}, {"data": ["MyStudent_GetStudentDetails", 18, 0, 0.0, 403.9444444444444, 255, 729, 383.5, 623.7000000000002, 729.0, 729.0, 0.18222127737115437, 0.4453111554853666, 0.22739103737054694], "isController": false}, {"data": ["MyAccount_PutInvoiceconfig", 13, 0, 0.0, 421.9230769230769, 356, 535, 400.0, 524.2, 535.0, 535.0, 0.4990786240786241, 0.8642773077587531, 1.0093295310580468], "isController": false}, {"data": ["MyStudent_UpdateGuardian", 18, 0, 0.0, 345.7222222222223, 265, 722, 329.0, 461.0000000000004, 722.0, 722.0, 0.1818751326172842, 0.25065061408117695, 0.2956951008649173], "isController": false}, {"data": ["MyClasses_GetOneonOneClassDetails", 18, 0, 0.0, 450.3333333333333, 266, 836, 407.0, 651.5000000000003, 836.0, 836.0, 0.32237843646458314, 0.6996759425091789, 0.40638362474254497], "isController": false}, {"data": ["Dashboard_Contacts", 24, 0, 0.0, 550.4583333333335, 296, 1638, 358.0, 1428.5, 1593.0, 1638.0, 0.38215951975287016, 1.6350630364166174, 0.4755534844190379], "isController": false}, {"data": ["MyClasses_DeleteGroupClass", 18, 0, 0.0, 675.6666666666666, 366, 1660, 570.0, 1084.000000000001, 1660.0, 1660.0, 0.3204272363150868, 0.6533363929684024, 0.40861774032042725], "isController": false}, {"data": ["MyCalender_weekschedules", 24, 0, 0.0, 2794.041666666668, 426, 12599, 1905.5, 7362.5, 11773.0, 12599.0, 0.44643687568593166, 42.01649302326122, 0.5968840682490374], "isController": false}, {"data": ["MyStudent_InactiveEnrollment", 18, 0, 0.0, 387.33333333333337, 271, 568, 321.5, 564.4, 568.0, 568.0, 0.18611768841830983, 0.3013608078800161, 0.2417045956851716], "isController": false}, {"data": ["Reports_OpenInvoices", 24, 0, 0.0, 2224.8750000000005, 1061, 6942, 1607.5, 5013.0, 6687.0, 6942.0, 0.640221943607117, 8.18614515532051, 0.8892145110304905], "isController": false}, {"data": ["Subscription_GetOpenInvoices", 18, 0, 0.0, 1434.8888888888891, 1183, 1804, 1384.5, 1755.4, 1804.0, 1804.0, 0.7145692735212386, 0.25044040293767367, 0.9105408272131797], "isController": false}, {"data": ["MyAccount_PutAttendanceSetup", 13, 0, 0.0, 358.69230769230774, 309, 411, 354.0, 410.6, 411.0, 411.0, 0.49892539146453785, 0.36538639133021183, 0.6869219181762358], "isController": false}, {"data": ["MyAccount_ProfileUpdate", 24, 0, 0.0, 499.2916666666667, 298, 749, 464.5, 673.5, 738.75, 749.0, 0.7382570980343904, 4.596924121012643, 2.8889535878525945], "isController": false}, {"data": ["MyClasses_GetinactiveSchedules", 18, 0, 0.0, 2315.777777777778, 462, 6197, 1983.5, 6098.900000000001, 6197.0, 6197.0, 0.27286784100900463, 9.400098748787254, 0.3458368941954947], "isController": false}, {"data": ["MyClasses_activateGroupClass", 18, 0, 0.0, 606.1111111111113, 377, 875, 575.0, 848.9000000000001, 875.0, 875.0, 0.3177124702144559, 0.6362695536581061, 0.41229191487953404], "isController": false}, {"data": ["MyTeachers_GetactiveTeachers", 13, 0, 0.0, 1448.4615384615386, 1097, 2360, 1384.0, 2112.3999999999996, 2360.0, 2360.0, 0.40135844396418646, 2.8863617725378203, 0.5028437596480395], "isController": false}, {"data": ["Feedback_CreateNewFeedbackKPI", 18, 0, 0.0, 364.94444444444446, 263, 577, 355.0, 460.00000000000017, 577.0, 577.0, 0.4869339392955689, 0.48645841787047556, 0.6447277988557052], "isController": false}, {"data": ["MyStudent_DeleteStudent", 18, 0, 0.0, 327.7222222222223, 275, 482, 286.0, 479.3, 482.0, 482.0, 0.18916902252162307, 0.32591425125849943, 0.24012519639422822], "isController": false}, {"data": ["MyTeachers_SearchTeacher", 13, 0, 0.0, 370.1538461538462, 288, 554, 339.0, 535.6, 554.0, 554.0, 0.40951330918254847, 0.7774354229012442, 0.5166598578516302], "isController": false}, {"data": ["MyClasses_UpdateOneonOneClass", 18, 0, 0.0, 990.4999999999999, 405, 1705, 981.0, 1576.3000000000002, 1705.0, 1705.0, 0.31736516388384434, 0.6804101118271418, 0.56184584758538], "isController": false}, {"data": ["MyAccount_Subscriptiondetail", 13, 0, 0.0, 1434.9230769230771, 1270, 2260, 1337.0, 1977.9999999999998, 2260.0, 2260.0, 0.47942174362000295, 0.4732633062582977, 0.6039230182364655], "isController": false}, {"data": ["Dashboard_Basic", 24, 0, 0.0, 305.5416666666666, 245, 448, 282.0, 420.5, 447.0, 448.0, 0.3864236491273266, 0.3075539785534875, 0.4842560036549237], "isController": false}, {"data": ["MyClasses_NewGroupClass", 18, 0, 0.0, 590.9444444444443, 419, 977, 545.5, 834.8000000000002, 977.0, 977.0, 0.3046252263534668, 0.6165223222596422, 0.4838768108277344], "isController": false}, {"data": ["MyAccount_PutLatefee", 13, 0, 0.0, 356.07692307692304, 267, 560, 324.0, 528.4, 560.0, 560.0, 0.504560450223171, 0.5473525737434504, 0.7020334028721134], "isController": false}, {"data": ["MyAccount_PreferencesUpdate", 24, 0, 0.0, 1258.5416666666665, 1034, 2066, 1178.5, 1499.5, 1935.5, 2066.0, 0.6332620913480567, 0.7792092139634291, 1.0193107832660493], "isController": false}, {"data": ["Feedback_UpdateFeedback", 18, 0, 0.0, 347.2222222222223, 273, 504, 333.0, 502.2, 504.0, 504.0, 0.4862105291591259, 0.48573571418924394, 0.6489929280003242], "isController": false}, {"data": ["Invoice_GetInvoiceDetails", 18, 0, 0.0, 484.5, 297, 986, 416.5, 786.2000000000003, 986.0, 986.0, 0.18422426233534958, 0.9069386821056834, 0.23079006302004976], "isController": false}, {"data": ["Invoice_UpdateInvoice", 18, 0, 0.0, 516.2222222222223, 328, 994, 419.0, 956.2, 994.0, 994.0, 0.1841903300076746, 0.9065318016116655, 0.27589576937835764], "isController": false}, {"data": ["MyStudent_InactiveStudent", 18, 0, 0.0, 750.6111111111112, 354, 3468, 487.5, 1620.300000000003, 3468.0, 3468.0, 0.18664261050797895, 0.32028568632635496, 0.2412926847761844], "isController": false}, {"data": ["MyStudent_CreateNewStudent", 18, 0, 0.0, 1219.9444444444446, 372, 7569, 561.5, 3897.900000000006, 7569.0, 7569.0, 0.18397007420126327, 0.31534019771672694, 0.3262294854203716], "isController": false}, {"data": ["MyStudent_UpdateStudent", 18, 0, 0.0, 802.3333333333335, 365, 2802, 452.0, 1731.9000000000017, 2802.0, 2802.0, 0.18715493309211143, 0.32262699891866037, 0.33918785481456065], "isController": false}, {"data": ["Feedback_DeactivateFeedbackKPI", 18, 0, 0.0, 408.27777777777777, 303, 1056, 338.5, 781.5000000000005, 1056.0, 1056.0, 0.588235294117647, 0.46472886029411764, 0.7696652879901961], "isController": false}, {"data": ["Reports_PaidInvoices", 24, 0, 0.0, 1227.9999999999998, 274, 4091, 1018.5, 2983.5, 4011.75, 4091.0, 0.4227659462030333, 6.159814748145996, 0.5772778166781166], "isController": false}, {"data": ["MyTeachers_GetinactiveSchedules", 13, 0, 0.0, 356.0, 255, 626, 327.0, 556.8, 626.0, 626.0, 0.414131438947469, 0.5410898525851359, 0.5196553152177376], "isController": false}, {"data": ["MyClasses_UpdateGroupClass", 18, 0, 0.0, 804.6666666666666, 372, 1740, 644.0, 1218.9000000000008, 1740.0, 1740.0, 0.3151039843148239, 0.6374906453504656, 0.5029833673237168], "isController": false}, {"data": ["Invoice_ReceivePaymentInvoice", 18, 0, 0.0, 505.2777777777778, 316, 844, 450.0, 815.2, 844.0, 844.0, 0.18490174526702893, 0.9375597881077361, 0.25603554928658745], "isController": false}, {"data": ["MyStudent_activeEnrollment", 18, 0, 0.0, 534.0, 275, 1889, 373.5, 1691.0000000000002, 1889.0, 1889.0, 0.18663293449184, 0.3047467138346847, 0.24219146919001308], "isController": false}, {"data": ["Reports_OverdueInvoices", 24, 0, 0.0, 927.4999999999998, 329, 5664, 478.5, 2715.5, 5019.0, 5664.0, 0.5669469904563923, 5.674037592719456, 0.7763685716479259], "isController": false}, {"data": ["MyTeachers_DeleteAvailability", 13, 0, 0.0, 514.0769230769231, 379, 642, 508.0, 640.0, 642.0, 642.0, 0.3992996897748564, 0.4206264685781859, 0.5072833799182971], "isController": false}, {"data": ["Dashboard_ClassSchedule", 13, 0, 0.0, 2244.9230769230767, 600, 6022, 1401.0, 5311.599999999999, 6022.0, 6022.0, 0.2171770326934964, 9.516618611027582, 0.28736149743564043], "isController": false}, {"data": ["Courses_GetinactiveCourses", 18, 0, 0.0, 378.0, 292, 521, 365.0, 470.6000000000001, 521.0, 521.0, 1.2320328542094456, 1.3238738449691991, 1.5554815836755647], "isController": false}, {"data": ["Feedback_DeleteFeedbackKPI", 18, 0, 0.0, 424.1666666666667, 316, 1024, 386.0, 521.8000000000008, 1024.0, 1024.0, 0.5665544049604986, 0.369034949324856, 0.7269121702968115], "isController": false}, {"data": ["MyAccount_PutCancellationfee", 13, 0, 0.0, 359.3076923076923, 272, 689, 321.0, 580.9999999999999, 689.0, 689.0, 0.5108857973748331, 0.47899381287825193, 0.7867457065943566], "isController": false}, {"data": ["Feedback_CreateNewFeedback", 18, 0, 0.0, 360.0555555555556, 277, 613, 324.5, 523.0000000000001, 613.0, 613.0, 0.48861261163440917, 0.4299218389478542, 0.6502905802953391], "isController": false}, {"data": ["Courses_GetCourseDetails", 18, 0, 0.0, 326.83333333333337, 251, 438, 312.0, 436.2, 438.0, 438.0, 1.222909165024798, 2.108907916638359, 1.5344086512331], "isController": false}, {"data": ["MyTeachers_DeleteTeacher", 13, 0, 0.0, 378.46153846153845, 288, 442, 385.0, 441.6, 442.0, 442.0, 0.40155680484339284, 0.6831171426144437, 0.5077980207882868], "isController": false}, {"data": ["Dashboard_Widget", 24, 0, 0.0, 473.5416666666667, 354, 866, 394.0, 694.0, 826.5, 866.0, 0.38646720664723594, 1.2043133363391894, 0.49978437344004123], "isController": false}, {"data": ["MyAccount_SubscriptionReport", 13, 0, 0.0, 407.1538461538462, 313, 726, 375.0, 626.8, 726.0, 726.0, 0.49637266132111496, 0.3640016466208476, 0.6330317511454754], "isController": false}, {"data": ["MyStudent_ReinviteStudent", 18, 0, 0.0, 370.9444444444444, 252, 864, 334.5, 612.9000000000004, 864.0, 864.0, 0.18428084400626554, 0.10995663641389476, 0.23122087018950213], "isController": false}, {"data": ["Feedback_ActivateFeedbackKPI", 18, 0, 0.0, 340.0, 271, 489, 316.0, 454.80000000000007, 489.0, 489.0, 0.5858802851284055, 0.4622961624841324, 0.7660117725319793], "isController": false}, {"data": ["Feedback_GetinactiveFeedbacks", 18, 0, 0.0, 404.72222222222223, 270, 1298, 327.0, 769.7000000000008, 1298.0, 1298.0, 0.4896094005004897, 0.420279944374932, 0.6195822084784027], "isController": false}, {"data": ["MyStudent_DeleteSchedule", 18, 0, 0.0, 562.9444444444443, 370, 1610, 464.5, 1061.9000000000008, 1610.0, 1610.0, 0.18479544171243775, 0.4186771726297418, 0.23565629651968584], "isController": false}, {"data": ["Subscription_GetSubscriptiondetail", 18, 0, 0.0, 488.7222222222222, 270, 656, 520.5, 655.1, 656.0, 656.0, 0.7426355309844046, 0.6980741758808483, 0.9390519922229557], "isController": false}, {"data": ["Dashboard_ClassTrends", 24, 0, 0.0, 2922.75, 1075, 10801, 2316.5, 6150.5, 10047.75, 10801.0, 0.3728908362077002, 0.3403751679950903, 0.4680253390976042], "isController": false}, {"data": ["Invoice_SendInvoice", 18, 0, 0.0, 337.72222222222223, 268, 432, 335.0, 419.40000000000003, 432.0, 432.0, 0.1850557223341695, 0.12090066234527286, 0.23779539840954889], "isController": false}, {"data": ["Subscription_GetSubscriptionreport", 18, 0, 0.0, 614.6111111111112, 487, 921, 562.5, 839.1000000000001, 921.0, 921.0, 0.7293059438434423, 3.3523066832786355, 0.9627930518414974], "isController": false}, {"data": ["MyTeachers_GetTeacherAvailabilityDetails", 13, 0, 0.0, 364.7692307692308, 297, 477, 339.0, 472.6, 477.0, 477.0, 0.40080160320641284, 0.4237742311546169, 0.504103158239556], "isController": false}, {"data": ["Feedback_SearchFeedback", 18, 0, 0.0, 477.8333333333333, 275, 1401, 389.5, 759.300000000001, 1401.0, 1401.0, 0.4876330831956221, 0.5200149676265815, 0.6170812535556579], "isController": false}, {"data": ["GetAuthorizationToken", 24, 0, 0.0, 415.66666666666663, 256, 1192, 332.0, 810.5, 1119.0, 1192.0, 2.389724186000199, 4.788491517723788, 0.8414015047794484], "isController": false}, {"data": ["MyCalender_dayschedules", 24, 0, 0.0, 2935.7083333333335, 1449, 8259, 2555.0, 4596.5, 7393.75, 8259.0, 0.4579540901024672, 11.006420450750854, 0.6122825314366401], "isController": false}, {"data": ["MyClasses_DeactivateOneononeClass", 18, 0, 0.0, 692.888888888889, 374, 940, 700.0, 940.0, 940.0, 940.0, 0.3186348267865678, 0.6971519799614098, 0.4138000134977253], "isController": false}, {"data": ["Feedback_UpdateFeedbackKPI", 18, 0, 0.0, 384.61111111111103, 270, 882, 342.0, 794.7000000000002, 882.0, 882.0, 0.4849791189546006, 0.3826788360501145, 0.6544534302168934], "isController": false}, {"data": ["MyTeachers_DeactivateTeacher", 13, 0, 0.0, 616.5384615384617, 391, 1624, 558.0, 1259.9999999999995, 1624.0, 1624.0, 0.396124078249741, 0.6746488207690902, 0.5051831788195503], "isController": false}, {"data": ["InviteFriends", 24, 0, 0.0, 544.5833333333333, 350, 1107, 466.0, 812.0, 1035.5, 1107.0, 0.6456298926640304, 0.38523424259543215, 0.8525908421434912], "isController": false}, {"data": ["MyTeachers_SubscriptionValidation", 13, 0, 0.0, 1353.8461538461538, 1206, 1556, 1379.0, 1516.3999999999999, 1556.0, 1556.0, 0.4010117835770251, 0.1167006948300327, 0.5165075151150595], "isController": false}, {"data": ["MyClasses_GetactiveSchedules", 18, 0, 0.0, 2882.9444444444443, 1251, 5560, 2379.0, 4876.000000000001, 5560.0, 5560.0, 0.26280057816127195, 5.421659193275225, 0.3325642082037581], "isController": false}, {"data": ["MyStudent_GetGuardianDetails", 18, 0, 0.0, 316.22222222222223, 248, 602, 289.5, 431.0000000000003, 602.0, 602.0, 0.18164204407846937, 0.2503293838802777, 0.22684560615463792], "isController": false}, {"data": ["MyAccount_GetAttendanceSetup", 13, 0, 0.0, 340.4615384615385, 262, 688, 307.0, 571.9999999999999, 688.0, 688.0, 0.5014077988197632, 0.36720437430092184, 0.6286807068885718], "isController": false}, {"data": ["Courses_ActivateCourse", 18, 0, 0.0, 358.7777777777778, 287, 453, 357.5, 423.30000000000007, 453.0, 453.0, 1.2209184019534696, 2.10315647680255, 1.5676798946957877], "isController": false}, {"data": ["MyTeachers_UpdateTeacher", 13, 0, 0.0, 471.4615384615384, 376, 574, 476.0, 568.0, 574.0, 574.0, 0.3976021531685833, 0.6767778837625398, 0.7280014183692195], "isController": false}, {"data": ["MyStudent_GetinactiveStudentDetails", 18, 0, 0.0, 1847.4444444444448, 270, 14330, 382.5, 11107.100000000006, 14330.0, 14330.0, 0.18422237687804477, 1.1210559300415524, 0.23204703363593565], "isController": false}, {"data": ["MyTeachers_NewTeacherAvailabilty", 13, 0, 0.0, 465.84615384615387, 363, 779, 432.0, 713.8, 779.0, 779.0, 0.40328835117108736, 0.425615838762215, 0.6340461164107337], "isController": false}, {"data": ["Dashboard_Notifications", 24, 0, 0.0, 657.2083333333334, 270, 1647, 501.0, 1488.5, 1633.75, 1647.0, 0.39009801212554657, 6.140202393820197, 0.4896225293792565], "isController": false}, {"data": ["Dashboard_ApplicationUser", 24, 0, 0.0, 950.0, 388, 2246, 890.0, 1497.5, 2109.25, 2246.0, 0.3805959498247673, 2.7395134169983666, 0.4765812076785233], "isController": false}, {"data": ["Feedback_GetFeedbackDetails", 18, 0, 0.0, 385.05555555555554, 265, 838, 343.5, 527.5000000000005, 838.0, 838.0, 0.5675726808349625, 0.5792123549536482, 0.7110362832660655], "isController": false}, {"data": ["MyCalender_monthschedules", 24, 0, 0.0, 4527.916666666667, 675, 15331, 2372.5, 12180.0, 14706.75, 15331.0, 0.399560483468185, 130.87602335347785, 0.5342105454833017], "isController": false}, {"data": ["Subscription_addTeacherValidation", 18, 0, 0.0, 763.7222222222223, 535, 1448, 702.5, 1054.7000000000007, 1448.0, 1448.0, 0.7173315267205994, 0.21186810066552425, 0.9273704942613478], "isController": false}, {"data": ["Feedback_DeactivateFeedback", 18, 0, 0.0, 435.11111111111114, 308, 1242, 406.0, 681.3000000000009, 1242.0, 1242.0, 0.5658775818164671, 0.5780351079883052, 0.738201305055173], "isController": false}, {"data": ["Subscription_GetAutoPaymentDetails", 18, 0, 0.0, 728.3888888888888, 610, 872, 740.5, 832.4000000000001, 872.0, 872.0, 0.740222889336678, 0.23328747635399102, 0.9432299805691492], "isController": false}, {"data": ["Dashboard_FeesCollection", 24, 0, 0.0, 387.8750000000001, 272, 689, 345.5, 650.5, 685.5, 689.0, 0.377447511205473, 0.29695424923330976, 0.47706195447039396], "isController": false}, {"data": ["Courses_UpdateCourse", 18, 0, 0.0, 468.8333333333333, 302, 868, 437.5, 699.7000000000003, 868.0, 868.0, 1.223491027732463, 2.107588087105764, 2.0680264197593803], "isController": false}, {"data": ["MyClasses_NewOneonOneClass", 18, 0, 0.0, 882.3888888888889, 402, 2382, 745.0, 2026.5000000000005, 2382.0, 2382.0, 0.3197044509964122, 0.7168546687950694, 0.5600551767699193], "isController": false}, {"data": ["Feedback_DeleteFeedback", 18, 0, 0.0, 415.94444444444446, 296, 624, 396.5, 562.8000000000001, 624.0, 624.0, 0.5622364516632828, 0.4930550132750273, 0.7164305306106512], "isController": false}, {"data": ["MyStudent_GetactiveStudentDetails", 18, 0, 0.0, 2364.7222222222226, 1009, 7663, 1480.0, 7657.6, 7663.0, 7663.0, 0.18079005252955416, 3.3155828470415716, 0.22737056248305093], "isController": false}, {"data": ["Dashboard_ChatroomUsers", 24, 0, 0.0, 2553.7916666666665, 323, 14907, 953.5, 11234.5, 14587.0, 14907.0, 0.3798550219999367, 0.7603128412759963, 0.47528246771232313], "isController": false}, {"data": ["MyStudent_SearchStudentDetails", 18, 0, 0.0, 1237.8333333333333, 280, 10271, 460.0, 3669.5000000000105, 10271.0, 10271.0, 0.18444323759363057, 0.48698538415427656, 0.23358607287044914], "isController": false}, {"data": ["Dashboard_Current", 24, 0, 0.0, 2356.916666666667, 1153, 5003, 2279.5, 3343.5, 4610.75, 5003.0, 0.37835792659856227, 2.357516587645037, 0.47340927095157015], "isController": false}, {"data": ["Reports_PartiallyPaidInvoices", 24, 0, 0.0, 705.4583333333334, 259, 2555, 485.5, 1815.5, 2420.5, 2555.0, 0.5474452554744526, 4.591336215499544, 0.752870879904197], "isController": false}, {"data": ["Courses_DeactivateCourse", 18, 0, 0.0, 403.8888888888888, 279, 1297, 350.5, 510.4000000000012, 1297.0, 1297.0, 1.218439044202261, 2.101463607594937, 1.5668761211331483], "isController": false}, {"data": ["Courses_GetactiveCourses", 18, 0, 0.0, 1422.0555555555557, 1049, 1745, 1463.5, 1680.2, 1745.0, 1745.0, 1.1459858661743172, 13.275144541446489, 1.4446062066276182], "isController": false}, {"data": ["MyStudent_DeleteEnrollment", 18, 0, 0.0, 348.72222222222234, 267, 645, 306.5, 564.0000000000001, 645.0, 645.0, 0.18691394689567087, 0.11152775542310049, 0.23872293966313954], "isController": false}, {"data": ["Courses_CreateNewCourse", 18, 0, 0.0, 500.5, 301, 698, 485.0, 696.2, 698.0, 698.0, 1.220835594139989, 2.087448707948996, 1.9467002467105263], "isController": false}, {"data": ["Feedback_ActivateFeedback", 18, 0, 0.0, 478.55555555555554, 331, 1226, 388.5, 1100.0000000000002, 1226.0, 1226.0, 0.5636802054301193, 0.5752400533930417, 0.7347843042463909], "isController": false}, {"data": ["Invoice_PrintInvoice", 18, 0, 0.0, 363.2222222222222, 243, 816, 267.5, 628.8000000000003, 816.0, 816.0, 0.18512043112491516, 0.05513840966122961, 0.23335900700886522], "isController": false}, {"data": ["Reports_CancelledInvoices", 24, 0, 0.0, 1278.4166666666665, 280, 8433, 496.5, 3500.0, 7365.75, 8433.0, 0.45586643113567726, 5.76540448648546, 0.6247017280186905], "isController": false}, {"data": ["Courses_DeleteCourse", 18, 0, 0.0, 461.7222222222222, 265, 1418, 359.0, 1065.2000000000005, 1418.0, 1418.0, 1.2175324675324675, 2.099371575689935, 1.5538203251826297], "isController": false}, {"data": ["MyTeachers_NewTeacher", 13, 0, 0.0, 922.6153846153846, 426, 2332, 767.0, 2218.0, 2332.0, 2332.0, 0.4111582010247327, 0.6998522894395598, 0.7395720495445632], "isController": false}, {"data": ["MyClasses_activateOneonOneClass", 18, 0, 0.0, 633.0555555555555, 315, 1453, 592.5, 942.7000000000008, 1453.0, 1453.0, 0.3209814900674061, 0.7016594074325047, 0.41653408533649555], "isController": false}, {"data": ["MyStudent_activeStudent", 18, 0, 0.0, 694.4444444444443, 295, 1837, 427.0, 1772.2, 1837.0, 1837.0, 0.18683246317843538, 0.3202465734407274, 0.24135567386836615], "isController": false}, {"data": ["Dashboard_CourseTrends", 13, 0, 0.0, 334.8461538461538, 259, 458, 297.0, 439.59999999999997, 458.0, 458.0, 0.23122209771801575, 0.5332420673034167, 0.2892360555288761], "isController": false}, {"data": ["MyStudent_CreateNewEnrollment", 18, 0, 0.0, 755.5555555555555, 370, 2202, 560.5, 1806.0000000000007, 2202.0, 2202.0, 0.1823948443057343, 0.32479186088339906, 0.27778798119306497], "isController": false}, {"data": ["MyClasses_DeleteOneonOneClass", 18, 0, 0.0, 879.3333333333333, 393, 2504, 841.0, 1346.6000000000017, 2504.0, 2504.0, 0.3232584451268789, 0.7244377491783848, 0.41222817668767847], "isController": false}, {"data": ["MyStudent_CreateNewSchedule", 18, 0, 0.0, 600.8333333333333, 381, 1160, 482.5, 1060.1000000000001, 1160.0, 1160.0, 0.18389301513030862, 0.4172012919761348, 0.3255042052756863], "isController": false}, {"data": ["Invoice_CreateNewInvoice", 18, 0, 0.0, 745.5, 306, 2672, 420.0, 2185.100000000001, 2672.0, 2672.0, 0.18419786944464345, 0.9068187429007071, 0.2688917140379243], "isController": false}, {"data": ["Subscription_GetPaymentHistory", 18, 0, 0.0, 661.5, 514, 919, 635.5, 877.6, 919.0, 919.0, 0.7437401867614247, 1.3846673312122963, 0.9491645189447152], "isController": false}, {"data": ["MyTeachers_GetTeacherDetails", 13, 0, 0.0, 454.23076923076917, 278, 1465, 362.0, 1128.1999999999998, 1465.0, 1465.0, 0.4028384617768275, 0.6856908582783303, 0.5007640373710142], "isController": false}, {"data": ["MyTeachers_activateTeacher", 13, 0, 0.0, 655.8461538461537, 340, 1179, 653.0, 1083.3999999999999, 1179.0, 1179.0, 0.3994591937069813, 0.6799388424133481, 0.5086563095347837], "isController": false}, {"data": ["MyClasses_SearchGroupClass", 18, 0, 0.0, 1640.7777777777778, 622, 5588, 962.5, 4243.400000000002, 5588.0, 5588.0, 0.3039411029684914, 0.6641785886157171, 0.38521962383067104], "isController": false}, {"data": ["Feedback_GetactiveFeedbacks", 18, 0, 0.0, 1344.111111111111, 1097, 2650, 1231.5, 1754.5000000000014, 2650.0, 2650.0, 0.47768165171700017, 1.5220141994188205, 0.603555120813651], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 2113, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
