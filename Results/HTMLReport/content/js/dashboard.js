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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9915682967959528, 2000, 2500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 2000, 2500, "MyStudent_AddGuardian"], "isController": false}, {"data": [1.0, 2000, 2500, "MyClasses_DeactivateGroupClass"], "isController": false}, {"data": [1.0, 2000, 2500, "Courses_SearchCourse"], "isController": false}, {"data": [1.0, 2000, 2500, "MyAccount_GetInvoiceconfig"], "isController": false}, {"data": [1.0, 2000, 2500, "MyAccount_GetCancellationfee"], "isController": false}, {"data": [1.0, 2000, 2500, "MyClasses_GetGroupClassDetails"], "isController": false}, {"data": [1.0, 2000, 2500, "MyStudent_DeleteGuardian"], "isController": false}, {"data": [1.0, 2000, 2500, "Dashboard_InvoiceSummary"], "isController": false}, {"data": [1.0, 2000, 2500, "MyAccount_GetLatefee"], "isController": false}, {"data": [1.0, 2000, 2500, "MyStudent_GetStudentDetails"], "isController": false}, {"data": [1.0, 2000, 2500, "MyAccount_PutInvoiceconfig"], "isController": false}, {"data": [1.0, 2000, 2500, "MyStudent_UpdateGuardian"], "isController": false}, {"data": [1.0, 2000, 2500, "MyClasses_GetOneonOneClassDetails"], "isController": false}, {"data": [1.0, 2000, 2500, "Dashboard_Contacts"], "isController": false}, {"data": [1.0, 2000, 2500, "MyClasses_DeleteGroupClass"], "isController": false}, {"data": [1.0, 2000, 2500, "MyCalender_weekschedules"], "isController": false}, {"data": [1.0, 2000, 2500, "MyStudent_InactiveEnrollment"], "isController": false}, {"data": [0.8888888888888888, 2000, 2500, "Reports_OpenInvoices"], "isController": false}, {"data": [1.0, 2000, 2500, "MyAccount_PutAttendanceSetup"], "isController": false}, {"data": [1.0, 2000, 2500, "MyAccount_ProfileUpdate"], "isController": false}, {"data": [1.0, 2000, 2500, "MyClasses_GetinactiveSchedules"], "isController": false}, {"data": [1.0, 2000, 2500, "MyClasses_activateGroupClass"], "isController": false}, {"data": [1.0, 2000, 2500, "MyTeachers_GetactiveTeachers"], "isController": false}, {"data": [1.0, 2000, 2500, "Feedback_CreateNewFeedbackKPI"], "isController": false}, {"data": [1.0, 2000, 2500, "MyStudent_DeleteStudent"], "isController": false}, {"data": [1.0, 2000, 2500, "MyTeachers_SearchTeacher"], "isController": false}, {"data": [1.0, 2000, 2500, "MyClasses_UpdateOneonOneClass"], "isController": false}, {"data": [1.0, 2000, 2500, "MyAccount_Subscriptiondetail"], "isController": false}, {"data": [1.0, 2000, 2500, "Dashboard_Basic"], "isController": false}, {"data": [1.0, 2000, 2500, "MyClasses_NewGroupClass"], "isController": false}, {"data": [1.0, 2000, 2500, "MyAccount_PutLatefee"], "isController": false}, {"data": [1.0, 2000, 2500, "MyAccount_PreferencesUpdate"], "isController": false}, {"data": [1.0, 2000, 2500, "Feedback_UpdateFeedback"], "isController": false}, {"data": [1.0, 2000, 2500, "Invoice_GetInvoiceDetails"], "isController": false}, {"data": [1.0, 2000, 2500, "Invoice_UpdateInvoice"], "isController": false}, {"data": [1.0, 2000, 2500, "MyStudent_InactiveStudent"], "isController": false}, {"data": [1.0, 2000, 2500, "MyStudent_CreateNewStudent"], "isController": false}, {"data": [1.0, 2000, 2500, "MyStudent_UpdateStudent"], "isController": false}, {"data": [1.0, 2000, 2500, "Feedback_DeactivateFeedbackKPI"], "isController": false}, {"data": [1.0, 2000, 2500, "Reports_PaidInvoices"], "isController": false}, {"data": [1.0, 2000, 2500, "MyTeachers_GetinactiveSchedules"], "isController": false}, {"data": [1.0, 2000, 2500, "MyClasses_UpdateGroupClass"], "isController": false}, {"data": [1.0, 2000, 2500, "Invoice_ReceivePaymentInvoice"], "isController": false}, {"data": [1.0, 2000, 2500, "MyStudent_activeEnrollment"], "isController": false}, {"data": [1.0, 2000, 2500, "Reports_OverdueInvoices"], "isController": false}, {"data": [1.0, 2000, 2500, "MyTeachers_DeleteAvailability"], "isController": false}, {"data": [1.0, 2000, 2500, "Dashboard_ClassSchedule"], "isController": false}, {"data": [1.0, 2000, 2500, "Courses_GetinactiveCourses"], "isController": false}, {"data": [1.0, 2000, 2500, "Feedback_DeleteFeedbackKPI"], "isController": false}, {"data": [1.0, 2000, 2500, "MyAccount_PutCancellationfee"], "isController": false}, {"data": [1.0, 2000, 2500, "Feedback_CreateNewFeedback"], "isController": false}, {"data": [1.0, 2000, 2500, "Courses_GetCourseDetails"], "isController": false}, {"data": [1.0, 2000, 2500, "MyTeachers_DeleteTeacher"], "isController": false}, {"data": [1.0, 2000, 2500, "Dashboard_Widget"], "isController": false}, {"data": [1.0, 2000, 2500, "MyAccount_SubscriptionReport"], "isController": false}, {"data": [1.0, 2000, 2500, "MyStudent_ReinviteStudent"], "isController": false}, {"data": [1.0, 2000, 2500, "Feedback_ActivateFeedbackKPI"], "isController": false}, {"data": [1.0, 2000, 2500, "Feedback_GetinactiveFeedbacks"], "isController": false}, {"data": [1.0, 2000, 2500, "MyStudent_DeleteSchedule"], "isController": false}, {"data": [1.0, 2000, 2500, "Dashboard_ClassTrends"], "isController": false}, {"data": [1.0, 2000, 2500, "Invoice_SendInvoice"], "isController": false}, {"data": [1.0, 2000, 2500, "MyTeachers_GetTeacherAvailabilityDetails"], "isController": false}, {"data": [1.0, 2000, 2500, "Feedback_SearchFeedback"], "isController": false}, {"data": [1.0, 2000, 2500, "GetAuthorizationToken"], "isController": false}, {"data": [1.0, 2000, 2500, "MyCalender_dayschedules"], "isController": false}, {"data": [1.0, 2000, 2500, "MyClasses_DeactivateOneononeClass"], "isController": false}, {"data": [1.0, 2000, 2500, "Feedback_UpdateFeedbackKPI"], "isController": false}, {"data": [1.0, 2000, 2500, "MyTeachers_DeactivateTeacher"], "isController": false}, {"data": [1.0, 2000, 2500, "InviteFriends"], "isController": false}, {"data": [1.0, 2000, 2500, "MyTeachers_SubscriptionValidation"], "isController": false}, {"data": [1.0, 2000, 2500, "MyClasses_GetactiveSchedules"], "isController": false}, {"data": [1.0, 2000, 2500, "MyStudent_GetGuardianDetails"], "isController": false}, {"data": [1.0, 2000, 2500, "MyAccount_GetAttendanceSetup"], "isController": false}, {"data": [1.0, 2000, 2500, "Courses_ActivateCourse"], "isController": false}, {"data": [1.0, 2000, 2500, "MyTeachers_UpdateTeacher"], "isController": false}, {"data": [1.0, 2000, 2500, "MyStudent_GetinactiveStudentDetails"], "isController": false}, {"data": [1.0, 2000, 2500, "MyTeachers_NewTeacherAvailabilty"], "isController": false}, {"data": [1.0, 2000, 2500, "Dashboard_Notifications"], "isController": false}, {"data": [1.0, 2000, 2500, "Dashboard_ApplicationUser"], "isController": false}, {"data": [1.0, 2000, 2500, "Feedback_GetFeedbackDetails"], "isController": false}, {"data": [1.0, 2000, 2500, "MyCalender_monthschedules"], "isController": false}, {"data": [1.0, 2000, 2500, "Feedback_DeactivateFeedback"], "isController": false}, {"data": [1.0, 2000, 2500, "Dashboard_FeesCollection"], "isController": false}, {"data": [1.0, 2000, 2500, "Courses_UpdateCourse"], "isController": false}, {"data": [1.0, 2000, 2500, "MyClasses_NewOneonOneClass"], "isController": false}, {"data": [1.0, 2000, 2500, "Feedback_DeleteFeedback"], "isController": false}, {"data": [1.0, 2000, 2500, "MyStudent_GetactiveStudentDetails"], "isController": false}, {"data": [0.8888888888888888, 2000, 2500, "Dashboard_ChatroomUsers"], "isController": false}, {"data": [1.0, 2000, 2500, "MyStudent_SearchStudentDetails"], "isController": false}, {"data": [0.7777777777777778, 2000, 2500, "Dashboard_Current"], "isController": false}, {"data": [1.0, 2000, 2500, "Reports_PartiallyPaidInvoices"], "isController": false}, {"data": [1.0, 2000, 2500, "Courses_DeactivateCourse"], "isController": false}, {"data": [1.0, 2000, 2500, "Courses_GetactiveCourses"], "isController": false}, {"data": [1.0, 2000, 2500, "MyStudent_DeleteEnrollment"], "isController": false}, {"data": [1.0, 2000, 2500, "Courses_CreateNewCourse"], "isController": false}, {"data": [1.0, 2000, 2500, "Feedback_ActivateFeedback"], "isController": false}, {"data": [1.0, 2000, 2500, "Invoice_PrintInvoice"], "isController": false}, {"data": [0.8888888888888888, 2000, 2500, "Reports_CancelledInvoices"], "isController": false}, {"data": [1.0, 2000, 2500, "Courses_DeleteCourse"], "isController": false}, {"data": [1.0, 2000, 2500, "MyTeachers_NewTeacher"], "isController": false}, {"data": [1.0, 2000, 2500, "MyClasses_activateOneonOneClass"], "isController": false}, {"data": [1.0, 2000, 2500, "MyStudent_activeStudent"], "isController": false}, {"data": [1.0, 2000, 2500, "Dashboard_CourseTrends"], "isController": false}, {"data": [1.0, 2000, 2500, "MyStudent_CreateNewEnrollment"], "isController": false}, {"data": [1.0, 2000, 2500, "MyClasses_DeleteOneonOneClass"], "isController": false}, {"data": [1.0, 2000, 2500, "MyStudent_CreateNewSchedule"], "isController": false}, {"data": [1.0, 2000, 2500, "Invoice_CreateNewInvoice"], "isController": false}, {"data": [1.0, 2000, 2500, "MyTeachers_GetTeacherDetails"], "isController": false}, {"data": [1.0, 2000, 2500, "MyTeachers_activateTeacher"], "isController": false}, {"data": [1.0, 2000, 2500, "MyClasses_SearchGroupClass"], "isController": false}, {"data": [1.0, 2000, 2500, "Feedback_GetactiveFeedbacks"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 593, 0, 0.0, 475.0472175379428, 236, 6943, 307.0, 997.8000000000001, 1214.6999999999991, 2021.8199999999838, 4.964212464944958, 19.010501143212927, 6.768786820873969], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["MyStudent_AddGuardian", 5, 0, 0.0, 298.2, 288, 317, 292.0, 317.0, 317.0, 317.0, 0.05656044614879922, 0.0337484693329261, 0.09238574436375155], "isController": false}, {"data": ["MyClasses_DeactivateGroupClass", 5, 0, 0.0, 430.0, 385, 497, 419.0, 497.0, 497.0, 497.0, 0.12454851164528583, 0.23267705349358572, 0.161353569871715], "isController": false}, {"data": ["Courses_SearchCourse", 5, 0, 0.0, 270.8, 260, 286, 262.0, 286.0, 286.0, 286.0, 0.36531014831592024, 0.6863835208592095, 0.46006246803536205], "isController": false}, {"data": ["MyAccount_GetInvoiceconfig", 3, 0, 0.0, 252.66666666666666, 250, 256, 252.0, 256.0, 256.0, 256.0, 0.12595515996305315, 0.21833047747501888, 0.1584689756696616], "isController": false}, {"data": ["MyAccount_GetCancellationfee", 3, 0, 0.0, 265.3333333333333, 254, 275, 267.0, 275.0, 275.0, 275.0, 0.12627857052658165, 0.11875611661825987, 0.15862923296291617], "isController": false}, {"data": ["MyClasses_GetGroupClassDetails", 5, 0, 0.0, 274.6, 266, 287, 270.0, 287.0, 287.0, 287.0, 0.12477851813031868, 0.23079151693244493, 0.1567773842055352], "isController": false}, {"data": ["MyStudent_DeleteGuardian", 5, 0, 0.0, 281.0, 273, 307, 275.0, 307.0, 307.0, 307.0, 0.056661718209943, 0.038235593049873645, 0.07263102668200311], "isController": false}, {"data": ["Dashboard_InvoiceSummary", 9, 0, 0.0, 255.0, 245, 267, 253.0, 267.0, 267.0, 267.0, 0.15780337699226762, 0.13533831290656287, 0.19995961767748496], "isController": false}, {"data": ["MyAccount_GetLatefee", 3, 0, 0.0, 254.66666666666666, 248, 267, 249.0, 267.0, 267.0, 267.0, 0.12625199898998402, 0.13710178015318575, 0.15797938936116487], "isController": false}, {"data": ["MyStudent_GetStudentDetails", 5, 0, 0.0, 264.0, 254, 278, 262.0, 278.0, 278.0, 278.0, 0.05665658179510714, 0.13729261920544808, 0.07052195230082378], "isController": false}, {"data": ["MyAccount_PutInvoiceconfig", 3, 0, 0.0, 289.6666666666667, 283, 294, 292.0, 294.0, 294.0, 294.0, 0.12574925598356876, 0.21797356383870561, 0.2535042780944796], "isController": false}, {"data": ["MyStudent_UpdateGuardian", 5, 0, 0.0, 285.6, 267, 320, 283.0, 320.0, 320.0, 320.0, 0.05665337200870196, 0.07752217271346991, 0.09198427373209754], "isController": false}, {"data": ["MyClasses_GetOneonOneClassDetails", 5, 0, 0.0, 285.8, 266, 305, 285.0, 305.0, 305.0, 305.0, 0.12542959636755888, 0.2523290708175501, 0.1577179182449891], "isController": false}, {"data": ["Dashboard_Contacts", 9, 0, 0.0, 345.4444444444445, 257, 738, 271.0, 738.0, 738.0, 738.0, 0.15771488653290108, 0.2977347651800578, 0.19676711863664242], "isController": false}, {"data": ["MyClasses_DeleteGroupClass", 5, 0, 0.0, 405.6, 375, 464, 392.0, 464.0, 464.0, 464.0, 0.12463233461289196, 0.23765341461438755, 0.15854109283862605], "isController": false}, {"data": ["MyCalender_weekschedules", 9, 0, 0.0, 608.7777777777778, 248, 1250, 477.0, 1250.0, 1250.0, 1250.0, 0.31738195154635535, 7.047077771802377, 0.4247945282469937], "isController": false}, {"data": ["MyStudent_InactiveEnrollment", 5, 0, 0.0, 298.2, 286, 311, 298.0, 311.0, 311.0, 311.0, 0.05745211366326167, 0.08544879795815188, 0.07442966209539349], "isController": false}, {"data": ["Reports_OpenInvoices", 9, 0, 0.0, 1285.111111111111, 972, 2902, 1003.0, 2902.0, 2902.0, 2902.0, 0.2779064381658175, 2.5230804674231897, 0.38604147367608466], "isController": false}, {"data": ["MyAccount_PutAttendanceSetup", 3, 0, 0.0, 268.6666666666667, 255, 294, 257.0, 294.0, 294.0, 294.0, 0.12640094379371367, 0.09282569309850847, 0.17347212859189348], "isController": false}, {"data": ["MyAccount_ProfileUpdate", 9, 0, 0.0, 298.6666666666667, 261, 352, 293.0, 352.0, 352.0, 352.0, 0.3270111183780249, 1.7761004264770004, 1.085104927421699], "isController": false}, {"data": ["MyClasses_GetinactiveSchedules", 5, 0, 0.0, 669.6, 427, 1236, 498.0, 1236.0, 1236.0, 1236.0, 0.10822979349755402, 0.6815517581929954, 0.13683036197454435], "isController": false}, {"data": ["MyClasses_activateGroupClass", 5, 0, 0.0, 394.8, 386, 415, 392.0, 415.0, 415.0, 415.0, 0.12464786976790568, 0.23261921789694115, 0.16136056266048412], "isController": false}, {"data": ["MyTeachers_GetactiveTeachers", 3, 0, 0.0, 1343.0, 1128, 1673, 1228.0, 1673.0, 1673.0, 1673.0, 1.3049151805132666, 2.5996357111787733, 1.6264714277946934], "isController": false}, {"data": ["Feedback_CreateNewFeedbackKPI", 5, 0, 0.0, 268.0, 257, 282, 266.0, 282.0, 282.0, 282.0, 0.14364513904849457, 0.14350486059239256, 0.18974063972362676], "isController": false}, {"data": ["MyStudent_DeleteStudent", 5, 0, 0.0, 280.4, 274, 290, 280.0, 290.0, 290.0, 290.0, 0.05765682656826568, 0.09871479330027676, 0.0730057044222786], "isController": false}, {"data": ["MyTeachers_SearchTeacher", 3, 0, 0.0, 269.0, 268, 270, 269.0, 270.0, 270.0, 270.0, 2.6019080659150045, 4.939559843885516, 3.2659366869037294], "isController": false}, {"data": ["MyClasses_UpdateOneonOneClass", 5, 0, 0.0, 471.8, 420, 565, 450.0, 565.0, 565.0, 565.0, 0.12491256120715499, 0.25048384099880083, 0.22098788660437693], "isController": false}, {"data": ["MyAccount_Subscriptiondetail", 3, 0, 0.0, 1219.0, 1162, 1266, 1229.0, 1266.0, 1266.0, 1266.0, 0.121246413126945, 0.17097638726104353, 0.15195269874307885], "isController": false}, {"data": ["Dashboard_Basic", 9, 0, 0.0, 248.44444444444446, 240, 259, 247.0, 259.0, 259.0, 259.0, 0.15681354869060687, 0.12480765838168417, 0.19702084204519715], "isController": false}, {"data": ["MyClasses_NewGroupClass", 5, 0, 0.0, 386.2, 369, 400, 391.0, 400.0, 400.0, 400.0, 0.12411875682653162, 0.23444384712292723, 0.19691731673865556], "isController": false}, {"data": ["MyAccount_PutLatefee", 3, 0, 0.0, 267.6666666666667, 259, 273, 271.0, 273.0, 273.0, 273.0, 0.12612991381122554, 0.13696920327937775, 0.17482460058860627], "isController": false}, {"data": ["MyAccount_PreferencesUpdate", 9, 0, 0.0, 1033.3333333333333, 973, 1270, 990.0, 1270.0, 1270.0, 1270.0, 0.2285308008734955, 0.28120000888730895, 0.36858526738103703], "isController": false}, {"data": ["Feedback_UpdateFeedback", 5, 0, 0.0, 286.6, 265, 306, 288.0, 306.0, 306.0, 306.0, 0.14364513904849457, 0.14350486059239256, 0.19128370274074927], "isController": false}, {"data": ["Invoice_GetInvoiceDetails", 5, 0, 0.0, 351.4, 305, 425, 310.0, 425.0, 425.0, 425.0, 0.05695539253656536, 0.2720732403631476, 0.0711719924704971], "isController": false}, {"data": ["Invoice_UpdateInvoice", 5, 0, 0.0, 409.2, 339, 681, 342.0, 681.0, 681.0, 681.0, 0.05700214328058735, 0.2724412984803229, 0.08520261768092481], "isController": false}, {"data": ["MyStudent_InactiveStudent", 5, 0, 0.0, 396.6, 367, 462, 390.0, 462.0, 462.0, 462.0, 0.057449473188330866, 0.09796706062642906, 0.07408962333252904], "isController": false}, {"data": ["MyStudent_CreateNewStudent", 5, 0, 0.0, 447.4, 402, 534, 433.0, 534.0, 534.0, 534.0, 0.056392037444312856, 0.09605370284215868, 0.09982051471832176], "isController": false}, {"data": ["MyStudent_UpdateStudent", 5, 0, 0.0, 433.2, 387, 516, 396.0, 516.0, 516.0, 516.0, 0.05752548378931867, 0.09854609732736602, 0.10407393678524586], "isController": false}, {"data": ["Feedback_DeactivateFeedbackKPI", 5, 0, 0.0, 274.6, 255, 293, 271.0, 293.0, 293.0, 293.0, 0.16820292000269124, 0.1328868772286887, 0.2195508035894503], "isController": false}, {"data": ["Reports_PaidInvoices", 9, 0, 0.0, 407.8888888888889, 250, 608, 360.0, 608.0, 608.0, 608.0, 0.2942426521071043, 2.4415818505410796, 0.4018378927322065], "isController": false}, {"data": ["MyTeachers_GetinactiveSchedules", 3, 0, 0.0, 454.0, 249, 847, 266.0, 847.0, 847.0, 847.0, 2.242152466367713, 1.8918161434977578, 2.799041246263079], "isController": false}, {"data": ["MyClasses_UpdateGroupClass", 5, 0, 0.0, 415.4, 385, 442, 413.0, 442.0, 442.0, 442.0, 0.12446170313394568, 0.2345811396958156, 0.19843376614890598], "isController": false}, {"data": ["Invoice_ReceivePaymentInvoice", 5, 0, 0.0, 346.2, 333, 372, 341.0, 372.0, 372.0, 372.0, 0.05722788142382969, 0.28156788299759644, 0.07911307514020831], "isController": false}, {"data": ["MyStudent_activeEnrollment", 5, 0, 0.0, 309.8, 285, 353, 296.0, 353.0, 353.0, 353.0, 0.05744419296653301, 0.0862223872944934, 0.07436330292620719], "isController": false}, {"data": ["Reports_OverdueInvoices", 9, 0, 0.0, 360.0, 253, 825, 277.0, 825.0, 825.0, 825.0, 0.2866150759529951, 0.9006169688067259, 0.39254074312919973], "isController": false}, {"data": ["MyTeachers_DeleteAvailability", 3, 0, 0.0, 406.3333333333333, 353, 506, 360.0, 506.0, 506.0, 506.0, 2.643171806167401, 2.78513904185022, 3.340962279735683], "isController": false}, {"data": ["Dashboard_ClassSchedule", 3, 0, 0.0, 444.3333333333333, 429, 472, 432.0, 472.0, 472.0, 472.0, 0.06974149153803236, 0.06138704203087224, 0.09183083765343128], "isController": false}, {"data": ["Courses_GetinactiveCourses", 5, 0, 0.0, 274.0, 255, 317, 271.0, 317.0, 317.0, 317.0, 0.35615072298596767, 0.29528512091317044, 0.44852731676045304], "isController": false}, {"data": ["Feedback_DeleteFeedbackKPI", 5, 0, 0.0, 269.8, 261, 281, 268.0, 281.0, 281.0, 281.0, 0.16740324092674436, 0.10904097822083836, 0.21425653081893667], "isController": false}, {"data": ["MyAccount_PutCancellationfee", 3, 0, 0.0, 271.6666666666667, 255, 296, 264.0, 296.0, 296.0, 296.0, 0.12626262626262627, 0.1187411221590909, 0.19362735427188552], "isController": false}, {"data": ["Feedback_CreateNewFeedback", 5, 0, 0.0, 322.6, 253, 545, 277.0, 545.0, 545.0, 545.0, 0.14194464158977999, 0.12489465046132008, 0.18846477998580552], "isController": false}, {"data": ["Courses_GetCourseDetails", 5, 0, 0.0, 260.0, 253, 268, 262.0, 268.0, 268.0, 268.0, 0.3652834599649328, 0.6243350699517826, 0.45717508036236115], "isController": false}, {"data": ["MyTeachers_DeleteTeacher", 3, 0, 0.0, 280.0, 274, 287, 279.0, 287.0, 287.0, 287.0, 3.2085561497326203, 5.458305481283422, 4.036806483957219], "isController": false}, {"data": ["Dashboard_Widget", 9, 0, 0.0, 405.3333333333333, 346, 851, 350.0, 851.0, 851.0, 851.0, 0.15652446129497904, 0.4877632382737091, 0.20292472477782222], "isController": false}, {"data": ["MyAccount_SubscriptionReport", 3, 0, 0.0, 306.6666666666667, 298, 313, 309.0, 313.0, 313.0, 313.0, 0.12562288011389808, 0.0922543025836439, 0.15940038629035636], "isController": false}, {"data": ["MyStudent_ReinviteStudent", 5, 0, 0.0, 257.2, 251, 267, 253.0, 267.0, 267.0, 267.0, 0.05657452562260266, 0.03375687026895529, 0.07080655472453863], "isController": false}, {"data": ["Feedback_ActivateFeedbackKPI", 5, 0, 0.0, 272.2, 252, 307, 269.0, 307.0, 307.0, 307.0, 0.16814070013787538, 0.1326735212025423, 0.21930538975014294], "isController": false}, {"data": ["Feedback_GetinactiveFeedbacks", 5, 0, 0.0, 254.0, 248, 258, 255.0, 258.0, 258.0, 258.0, 0.14204545454545453, 0.11860240589488635, 0.17930464311079544], "isController": false}, {"data": ["MyStudent_DeleteSchedule", 5, 0, 0.0, 441.0, 404, 545, 412.0, 545.0, 545.0, 545.0, 0.057278361380637625, 0.12181720255346934, 0.07286210306095563], "isController": false}, {"data": ["Dashboard_ClassTrends", 9, 0, 0.0, 943.4444444444442, 246, 1950, 893.0, 1950.0, 1950.0, 1950.0, 0.15800839200126407, 0.12196958557910074, 0.19883065560315313], "isController": false}, {"data": ["Invoice_SendInvoice", 5, 0, 0.0, 285.8, 265, 345, 274.0, 345.0, 345.0, 345.0, 0.05730067958605989, 0.03743569789362702, 0.0734500703365842], "isController": false}, {"data": ["MyTeachers_GetTeacherAvailabilityDetails", 3, 0, 0.0, 266.0, 253, 273, 272.0, 273.0, 273.0, 273.0, 3.401360544217687, 3.5973373724489797, 4.256129535147393], "isController": false}, {"data": ["Feedback_SearchFeedback", 5, 0, 0.0, 302.8, 267, 409, 277.0, 409.0, 409.0, 409.0, 0.1430737974647323, 0.15257479182762468, 0.1806027251981572], "isController": false}, {"data": ["GetAuthorizationToken", 9, 0, 0.0, 406.3333333333333, 267, 1234, 316.0, 1234.0, 1234.0, 1234.0, 2.4089935760171306, 4.861639704898287, 0.842206738490364], "isController": false}, {"data": ["MyCalender_dayschedules", 9, 0, 0.0, 1241.3333333333333, 957, 1751, 1204.0, 1751.0, 1751.0, 1751.0, 0.3070100631076241, 1.849888868753198, 0.4109124488316561], "isController": false}, {"data": ["MyClasses_DeactivateOneononeClass", 5, 0, 0.0, 445.8, 388, 620, 406.0, 620.0, 620.0, 620.0, 0.125464217605139, 0.2546041447104286, 0.16253987409665765], "isController": false}, {"data": ["Feedback_UpdateFeedbackKPI", 5, 0, 0.0, 280.4, 258, 300, 287.0, 300.0, 300.0, 300.0, 0.14368641875969884, 0.11337756480257485, 0.19344345400597734], "isController": false}, {"data": ["MyTeachers_DeactivateTeacher", 3, 0, 0.0, 400.6666666666667, 355, 478, 369.0, 478.0, 478.0, 478.0, 2.5906735751295336, 4.412240932642487, 3.2872544257340244], "isController": false}, {"data": ["InviteFriends", 9, 0, 0.0, 353.22222222222223, 309, 394, 354.0, 394.0, 394.0, 394.0, 0.23404587299110627, 0.13965041835699796, 0.3098263509647891], "isController": false}, {"data": ["MyTeachers_SubscriptionValidation", 3, 0, 0.0, 1252.6666666666667, 1192, 1371, 1195.0, 1371.0, 1371.0, 1371.0, 1.3134851138353765, 0.38224469133099825, 1.6833303688704029], "isController": false}, {"data": ["MyClasses_GetactiveSchedules", 5, 0, 0.0, 1250.6, 1104, 1544, 1120.0, 1544.0, 1544.0, 1544.0, 0.1060535358248844, 0.4461291122258516, 0.13387187539770076], "isController": false}, {"data": ["MyStudent_GetGuardianDetails", 5, 0, 0.0, 260.6, 251, 287, 254.0, 287.0, 287.0, 287.0, 0.056672636184344746, 0.07754853302881237, 0.0706526243681001], "isController": false}, {"data": ["MyAccount_GetAttendanceSetup", 3, 0, 0.0, 279.3333333333333, 255, 292, 291.0, 292.0, 292.0, 292.0, 0.12615112905260503, 0.09264223539800681, 0.15736039275051514], "isController": false}, {"data": ["Courses_ActivateCourse", 5, 0, 0.0, 274.4, 263, 281, 278.0, 281.0, 281.0, 281.0, 0.364590928977687, 0.6236498742161295, 0.4669897094210296], "isController": false}, {"data": ["MyTeachers_UpdateTeacher", 3, 0, 0.0, 360.3333333333333, 302, 454, 325.0, 454.0, 454.0, 454.0, 2.7124773960216997, 4.6170391613924044, 4.9490350926763105], "isController": false}, {"data": ["MyStudent_GetinactiveStudentDetails", 5, 0, 0.0, 284.0, 271, 303, 275.0, 303.0, 303.0, 303.0, 0.056450611360121035, 0.04763020333510212, 0.07092710603118332], "isController": false}, {"data": ["MyTeachers_NewTeacherAvailabilty", 3, 0, 0.0, 436.0, 327, 624, 357.0, 624.0, 624.0, 624.0, 2.444987775061125, 2.5810857273838628, 3.828252343113284], "isController": false}, {"data": ["Dashboard_Notifications", 9, 0, 0.0, 270.3333333333333, 245, 304, 272.0, 304.0, 304.0, 304.0, 0.15816945220646386, 0.8169170741726859, 0.1990333265232597], "isController": false}, {"data": ["Dashboard_ApplicationUser", 9, 0, 0.0, 543.0, 323, 733, 695.0, 733.0, 733.0, 733.0, 0.15978127718500898, 1.067566397997408, 0.20059346538960002], "isController": false}, {"data": ["Feedback_GetFeedbackDetails", 5, 0, 0.0, 260.2, 247, 295, 255.0, 295.0, 295.0, 295.0, 0.16751541141785045, 0.1709507860660681, 0.20932882856472795], "isController": false}, {"data": ["MyCalender_monthschedules", 9, 0, 0.0, 835.5555555555554, 248, 1935, 602.0, 1935.0, 1935.0, 1935.0, 0.3197271661515507, 24.358068614782052, 0.4279334412412519], "isController": false}, {"data": ["Feedback_DeactivateFeedback", 5, 0, 0.0, 273.0, 256, 312, 264.0, 312.0, 312.0, 312.0, 0.16803898504453033, 0.17164919761384642, 0.218680421357755], "isController": false}, {"data": ["Dashboard_FeesCollection", 9, 0, 0.0, 296.0, 245, 454, 259.0, 454.0, 454.0, 454.0, 0.15781721259732062, 0.12161651951672862, 0.19997714938275934], "isController": false}, {"data": ["Courses_UpdateCourse", 5, 0, 0.0, 311.0, 277, 336, 317.0, 336.0, 336.0, 336.0, 0.36398049064570137, 0.6231033204120259, 0.6140748980854626], "isController": false}, {"data": ["MyClasses_NewOneonOneClass", 5, 0, 0.0, 461.8, 395, 544, 452.0, 544.0, 544.0, 544.0, 0.12459817089885121, 0.25975798362780034, 0.21811980581375068], "isController": false}, {"data": ["Feedback_DeleteFeedback", 5, 0, 0.0, 264.0, 258, 271, 264.0, 271.0, 271.0, 271.0, 0.16738082485270486, 0.1467851374196572, 0.21275672034011783], "isController": false}, {"data": ["MyStudent_GetactiveStudentDetails", 5, 0, 0.0, 1049.4, 1001, 1139, 1042.0, 1139.0, 1139.0, 1139.0, 0.05590089888645409, 0.1987648172320111, 0.0701272409272841], "isController": false}, {"data": ["Dashboard_ChatroomUsers", 9, 0, 0.0, 1104.6666666666667, 245, 6943, 307.0, 6943.0, 6943.0, 6943.0, 0.1598266768482179, 0.256856869661345, 0.20049438053843832], "isController": false}, {"data": ["MyStudent_SearchStudentDetails", 5, 0, 0.0, 311.0, 287, 374, 291.0, 374.0, 374.0, 374.0, 0.05657964716932025, 0.14821215387400846, 0.07147600740061785], "isController": false}, {"data": ["Dashboard_Current", 9, 0, 0.0, 1741.0, 980, 3390, 1969.0, 3390.0, 3390.0, 3390.0, 0.1486546751895347, 0.8075032931139852, 0.1864796766347885], "isController": false}, {"data": ["Reports_PartiallyPaidInvoices", 9, 0, 0.0, 357.8888888888889, 251, 735, 281.0, 735.0, 735.0, 735.0, 0.28907303912121796, 1.9961911114055373, 0.39760089452045994], "isController": false}, {"data": ["Courses_DeactivateCourse", 5, 0, 0.0, 292.6, 274, 331, 282.0, 331.0, 331.0, 331.0, 0.3644846187490888, 0.6248206052267095, 0.46756542498906545], "isController": false}, {"data": ["Courses_GetactiveCourses", 5, 0, 0.0, 1046.6, 974, 1240, 983.0, 1240.0, 1240.0, 1240.0, 0.3341575887188398, 0.7841608258704805, 0.42017706175232244], "isController": false}, {"data": ["MyStudent_DeleteEnrollment", 5, 0, 0.0, 274.6, 268, 286, 274.0, 286.0, 286.0, 286.0, 0.0575016675483589, 0.03431007702348368, 0.07325847215194241], "isController": false}, {"data": ["Courses_CreateNewCourse", 5, 0, 0.0, 483.6, 294, 813, 454.0, 813.0, 813.0, 813.0, 0.3511482547931737, 0.5964719476437952, 0.5588195273544491], "isController": false}, {"data": ["Feedback_ActivateFeedback", 5, 0, 0.0, 304.6, 255, 383, 276.0, 383.0, 383.0, 383.0, 0.1675266367352409, 0.17096224159016282, 0.21785006784828786], "isController": false}, {"data": ["Invoice_PrintInvoice", 5, 0, 0.0, 241.4, 236, 253, 237.0, 253.0, 253.0, 253.0, 0.05737432154864769, 0.017089031320642132, 0.07214372697855348], "isController": false}, {"data": ["Reports_CancelledInvoices", 9, 0, 0.0, 653.1111111111111, 248, 2624, 279.0, 2624.0, 2624.0, 2624.0, 0.291762570104062, 2.6739836937141375, 0.39987554502869], "isController": false}, {"data": ["Courses_DeleteCourse", 5, 0, 0.0, 275.2, 268, 285, 276.0, 285.0, 285.0, 285.0, 0.36485697606538237, 0.6242474824868651, 0.4644800332019848], "isController": false}, {"data": ["MyTeachers_NewTeacher", 3, 0, 0.0, 471.3333333333333, 452, 482, 480.0, 482.0, 482.0, 482.0, 2.1994134897360706, 3.7437282349706744, 3.942047745601173], "isController": false}, {"data": ["MyClasses_activateOneonOneClass", 5, 0, 0.0, 358.6, 308, 497, 332.0, 497.0, 497.0, 497.0, 0.12645422357106728, 0.25636617981790594, 0.16369894410723318], "isController": false}, {"data": ["MyStudent_activeStudent", 5, 0, 0.0, 300.0, 284, 327, 294.0, 327.0, 327.0, 327.0, 0.05756787252170309, 0.09805652661362747, 0.0741860982223041], "isController": false}, {"data": ["Dashboard_CourseTrends", 3, 0, 0.0, 249.33333333333334, 245, 253, 250.0, 253.0, 253.0, 253.0, 0.0701049237024747, 0.05419895631294838, 0.08724320420395859], "isController": false}, {"data": ["MyStudent_CreateNewEnrollment", 5, 0, 0.0, 484.2, 393, 786, 407.0, 786.0, 786.0, 786.0, 0.05659950192438306, 0.09299121292732623, 0.08609314863029205], "isController": false}, {"data": ["MyClasses_DeleteOneonOneClass", 5, 0, 0.0, 445.2, 403, 548, 423.0, 548.0, 548.0, 548.0, 0.12675877804537966, 0.2638414643807834, 0.16124607840030422], "isController": false}, {"data": ["MyStudent_CreateNewSchedule", 5, 0, 0.0, 412.2, 393, 439, 397.0, 439.0, 439.0, 439.0, 0.05685242248172195, 0.12086691771748893, 0.10052441029824781], "isController": false}, {"data": ["Invoice_CreateNewInvoice", 5, 0, 0.0, 333.8, 323, 350, 332.0, 350.0, 350.0, 350.0, 0.05692556413234055, 0.2717750956349477, 0.08292008931621012], "isController": false}, {"data": ["MyTeachers_GetTeacherDetails", 3, 0, 0.0, 256.3333333333333, 253, 258, 258.0, 258.0, 258.0, 258.0, 3.480278422273782, 5.923950478538283, 4.303898999419953], "isController": false}, {"data": ["MyTeachers_activateTeacher", 3, 0, 0.0, 270.6666666666667, 262, 287, 263.0, 287.0, 287.0, 287.0, 3.181336161187699, 5.41510637592789, 4.030520943796395], "isController": false}, {"data": ["MyClasses_SearchGroupClass", 5, 0, 0.0, 481.4, 395, 630, 477.0, 630.0, 630.0, 630.0, 0.12413108242303872, 0.25449296331926513, 0.15693369072740815], "isController": false}, {"data": ["Feedback_GetactiveFeedbacks", 5, 0, 0.0, 1015.8, 949, 1178, 981.0, 1178.0, 1178.0, 1178.0, 0.13841596766602995, 0.11557192612739807, 0.17445278112283033], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 593, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
