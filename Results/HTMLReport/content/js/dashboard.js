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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6897321428571429, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "MyClasses_DeactivateGroupClass"], "isController": false}, {"data": [1.0, 500, 1500, "MyAccount_GetInvoiceconfig"], "isController": false}, {"data": [1.0, 500, 1500, "MyAccount_GetCancellationfee"], "isController": false}, {"data": [1.0, 500, 1500, "MyClasses_GetGroupClassDetails"], "isController": false}, {"data": [1.0, 500, 1500, "Dashboard_InvoiceSummary"], "isController": false}, {"data": [1.0, 500, 1500, "MyAccount_GetLatefee"], "isController": false}, {"data": [1.0, 500, 1500, "MyStudent_GetStudentDetails"], "isController": false}, {"data": [1.0, 500, 1500, "MyAccount_PutInvoiceconfig"], "isController": false}, {"data": [1.0, 500, 1500, "MyClasses_GetOneonOneClassDetails"], "isController": false}, {"data": [0.875, 500, 1500, "Dashboard_Contacts"], "isController": false}, {"data": [0.5, 500, 1500, "MyClasses_DeleteGroupClass"], "isController": false}, {"data": [0.5, 500, 1500, "MyCalender_weekschedules"], "isController": false}, {"data": [1.0, 500, 1500, "MyStudent_InactiveEnrollment"], "isController": false}, {"data": [0.375, 500, 1500, "Reports_OpenInvoices"], "isController": false}, {"data": [1.0, 500, 1500, "MyAccount_PutAttendanceSetup"], "isController": false}, {"data": [0.875, 500, 1500, "MyAccount_ProfileUpdate"], "isController": false}, {"data": [0.25, 500, 1500, "MyClasses_GetinactiveSchedules"], "isController": false}, {"data": [0.75, 500, 1500, "MyClasses_activateGroupClass"], "isController": false}, {"data": [0.5, 500, 1500, "MyTeachers_GetactiveTeachers"], "isController": false}, {"data": [1.0, 500, 1500, "Feedback_CreateNewFeedbackKPI"], "isController": false}, {"data": [0.75, 500, 1500, "MyStudent_DeleteStudent"], "isController": false}, {"data": [0.5, 500, 1500, "MyClasses_UpdateOneonOneClass"], "isController": false}, {"data": [0.5, 500, 1500, "MyAccount_Subscriptiondetail"], "isController": false}, {"data": [1.0, 500, 1500, "Dashboard_Basic"], "isController": false}, {"data": [0.5, 500, 1500, "MyClasses_NewGroupClass"], "isController": false}, {"data": [1.0, 500, 1500, "MyAccount_PutLatefee"], "isController": false}, {"data": [0.875, 500, 1500, "MyAccount_PreferencesUpdate"], "isController": false}, {"data": [1.0, 500, 1500, "Feedback_UpdateFeedback"], "isController": false}, {"data": [0.75, 500, 1500, "Invoice_GetInvoiceDetails"], "isController": false}, {"data": [0.75, 500, 1500, "Invoice_UpdateInvoice"], "isController": false}, {"data": [0.25, 500, 1500, "MyStudent_InactiveStudent"], "isController": false}, {"data": [0.5, 500, 1500, "MyTeacher_SubscriptionValidation"], "isController": false}, {"data": [0.25, 500, 1500, "MyStudent_CreateNewStudent"], "isController": false}, {"data": [0.25, 500, 1500, "MyStudent_UpdateStudent"], "isController": false}, {"data": [1.0, 500, 1500, "Feedback_DeactivateFeedbackKPI"], "isController": false}, {"data": [0.5, 500, 1500, "Reports_PaidInvoices"], "isController": false}, {"data": [1.0, 500, 1500, "MyTeachers_GetinactiveSchedules"], "isController": false}, {"data": [0.5, 500, 1500, "MyClasses_UpdateGroupClass"], "isController": false}, {"data": [0.5, 500, 1500, "Invoice_ReceivePaymentInvoice"], "isController": false}, {"data": [1.0, 500, 1500, "MyStudent_activeEnrollment"], "isController": false}, {"data": [0.5, 500, 1500, "Reports_OverdueInvoices"], "isController": false}, {"data": [1.0, 500, 1500, "MyTeachers_DeleteAvailability"], "isController": false}, {"data": [0.0, 500, 1500, "Dashboard_ClassSchedule"], "isController": false}, {"data": [1.0, 500, 1500, "Courses_GetinactiveCourses"], "isController": false}, {"data": [0.75, 500, 1500, "Feedback_DeleteFeedbackKPI"], "isController": false}, {"data": [1.0, 500, 1500, "MyAccount_PutCancellationfee"], "isController": false}, {"data": [1.0, 500, 1500, "Feedback_CreateNewFeedback"], "isController": false}, {"data": [1.0, 500, 1500, "Courses_GetCourseDetails"], "isController": false}, {"data": [1.0, 500, 1500, "MyTeachers_DeleteTeacher"], "isController": false}, {"data": [0.875, 500, 1500, "Dashboard_Widget"], "isController": false}, {"data": [0.5, 500, 1500, "MyAccount_SubscriptionReport"], "isController": false}, {"data": [1.0, 500, 1500, "Feedback_ActivateFeedbackKPI"], "isController": false}, {"data": [1.0, 500, 1500, "Feedback_GetinactiveFeedbacks"], "isController": false}, {"data": [0.5, 500, 1500, "MyStudent_DeleteSchedule"], "isController": false}, {"data": [0.375, 500, 1500, "Dashboard_ClassTrends"], "isController": false}, {"data": [0.75, 500, 1500, "Invoice_SendInvoice"], "isController": false}, {"data": [1.0, 500, 1500, "MyTeachers_GetTeacherAvailabilityDetails"], "isController": false}, {"data": [0.875, 500, 1500, "GetAuthorizationToken"], "isController": false}, {"data": [0.375, 500, 1500, "MyCalender_dayschedules"], "isController": false}, {"data": [0.5, 500, 1500, "MyClasses_DeactivateOneononeClass"], "isController": false}, {"data": [1.0, 500, 1500, "Feedback_UpdateFeedbackKPI"], "isController": false}, {"data": [0.5, 500, 1500, "MyTeachers_DeactivateTeacher"], "isController": false}, {"data": [0.75, 500, 1500, "InviteFriends"], "isController": false}, {"data": [0.0, 500, 1500, "MyClasses_GetactiveSchedules"], "isController": false}, {"data": [1.0, 500, 1500, "MyAccount_GetAttendanceSetup"], "isController": false}, {"data": [1.0, 500, 1500, "Courses_ActivateCourse"], "isController": false}, {"data": [0.25, 500, 1500, "MyStudent_GetinactiveStudentDetails"], "isController": false}, {"data": [1.0, 500, 1500, "MyTeachers_UpdateTeacher"], "isController": false}, {"data": [1.0, 500, 1500, "MyTeachers_NewTeacherAvailabilty"], "isController": false}, {"data": [0.75, 500, 1500, "Dashboard_Notifications"], "isController": false}, {"data": [1.0, 500, 1500, "Dashboard_ApplicationUser"], "isController": false}, {"data": [1.0, 500, 1500, "Feedback_GetFeedbackDetails"], "isController": false}, {"data": [0.0, 500, 1500, "MyCalender_monthschedules"], "isController": false}, {"data": [1.0, 500, 1500, "Feedback_DeactivateFeedback"], "isController": false}, {"data": [0.75, 500, 1500, "Dashboard_FeesCollection"], "isController": false}, {"data": [0.75, 500, 1500, "Courses_UpdateCourse"], "isController": false}, {"data": [0.5, 500, 1500, "MyClasses_NewOneonOneClass"], "isController": false}, {"data": [1.0, 500, 1500, "Feedback_DeleteFeedback"], "isController": false}, {"data": [0.0, 500, 1500, "MyStudent_GetactiveStudentDetails"], "isController": false}, {"data": [0.125, 500, 1500, "Dashboard_ChatroomUsers"], "isController": false}, {"data": [0.625, 500, 1500, "Dashboard_Current"], "isController": false}, {"data": [0.625, 500, 1500, "Reports_PartiallyPaidInvoices"], "isController": false}, {"data": [1.0, 500, 1500, "Courses_DeactivateCourse"], "isController": false}, {"data": [0.75, 500, 1500, "Courses_GetactiveCourses"], "isController": false}, {"data": [1.0, 500, 1500, "MyStudent_DeleteEnrollment"], "isController": false}, {"data": [0.75, 500, 1500, "Courses_CreateNewCourse"], "isController": false}, {"data": [0.75, 500, 1500, "Feedback_ActivateFeedback"], "isController": false}, {"data": [1.0, 500, 1500, "Invoice_PrintInvoice"], "isController": false}, {"data": [0.25, 500, 1500, "Reports_CancelledInvoices"], "isController": false}, {"data": [1.0, 500, 1500, "Courses_DeleteCourse"], "isController": false}, {"data": [0.5, 500, 1500, "MyTeachers_NewTeacher"], "isController": false}, {"data": [0.75, 500, 1500, "MyClasses_activateOneonOneClass"], "isController": false}, {"data": [0.25, 500, 1500, "MyStudent_activeStudent"], "isController": false}, {"data": [1.0, 500, 1500, "Dashboard_CourseTrends"], "isController": false}, {"data": [0.5, 500, 1500, "MyStudent_CreateNewEnrollment"], "isController": false}, {"data": [0.5, 500, 1500, "MyClasses_DeleteOneonOneClass"], "isController": false}, {"data": [0.5, 500, 1500, "MyStudent_CreateNewSchedule"], "isController": false}, {"data": [0.5, 500, 1500, "Invoice_CreateNewInvoice"], "isController": false}, {"data": [1.0, 500, 1500, "MyTeachers_GetTeacherDetails"], "isController": false}, {"data": [1.0, 500, 1500, "MyTeachers_activateTeacher"], "isController": false}, {"data": [0.75, 500, 1500, "Feedback_GetactiveFeedbacks"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 224, 0, 0.0, 998.2633928571428, 240, 20399, 486.0, 1955.5, 3308.0, 13343.25, 3.1589338598223096, 70.2665983949725, 4.345462117472853], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["MyClasses_DeactivateGroupClass", 2, 0, 0.0, 606.5, 600, 613, 606.5, 613.0, 613.0, 613.0, 0.09797198001371608, 0.18484557166650337, 0.12973633290878808], "isController": false}, {"data": ["MyAccount_GetInvoiceconfig", 1, 0, 0.0, 350.0, 350, 350, 350.0, 350.0, 350.0, 350.0, 2.857142857142857, 4.952566964285714, 3.6914062500000004], "isController": false}, {"data": ["MyAccount_GetCancellationfee", 1, 0, 0.0, 277.0, 277, 277, 277.0, 277.0, 277.0, 277.0, 3.6101083032490977, 3.3950530234657035, 4.657180731046931], "isController": false}, {"data": ["MyClasses_GetGroupClassDetails", 2, 0, 0.0, 394.5, 391, 398, 394.5, 398.0, 398.0, 398.0, 0.0962741888899586, 0.17994999759314528, 0.12372737556561085], "isController": false}, {"data": ["Dashboard_InvoiceSummary", 4, 0, 0.0, 343.75, 257, 397, 360.5, 397.0, 397.0, 397.0, 0.08809020436927414, 0.07600360894556026, 0.11230640801180408], "isController": false}, {"data": ["MyAccount_GetLatefee", 1, 0, 0.0, 265.0, 265, 265, 265.0, 265.0, 265.0, 265.0, 3.7735849056603774, 4.094192216981132, 4.849646226415094], "isController": false}, {"data": ["MyStudent_GetStudentDetails", 2, 0, 0.0, 335.5, 311, 360, 335.5, 360.0, 360.0, 360.0, 0.058322640849177654, 0.0988181463606672, 0.07427023795637466], "isController": false}, {"data": ["MyAccount_PutInvoiceconfig", 1, 0, 0.0, 459.0, 459, 459, 459.0, 459.0, 459.0, 459.0, 2.1786492374727673, 3.7764671840958606, 4.465805419389978], "isController": false}, {"data": ["MyClasses_GetOneonOneClassDetails", 2, 0, 0.0, 364.5, 350, 379, 364.5, 379.0, 379.0, 379.0, 0.10240655401945725, 0.2064132104454685, 0.1317084293394777], "isController": false}, {"data": ["Dashboard_Contacts", 4, 0, 0.0, 450.5, 372, 592, 419.0, 592.0, 592.0, 592.0, 0.08786767128704172, 0.49708732399007094, 0.11030653460887901], "isController": false}, {"data": ["MyClasses_DeleteGroupClass", 2, 0, 0.0, 758.5, 587, 930, 758.5, 930.0, 930.0, 930.0, 0.10013016921998598, 0.19224210223290278, 0.1302474466806849], "isController": false}, {"data": ["MyCalender_weekschedules", 4, 0, 0.0, 2601.5, 490, 7515, 1200.5, 7515.0, 7515.0, 7515.0, 0.09683119901232176, 14.630825380062458, 0.12720915085090417], "isController": false}, {"data": ["MyStudent_InactiveEnrollment", 2, 0, 0.0, 395.5, 351, 440, 395.5, 440.0, 440.0, 440.0, 0.06198475175106924, 0.09334031953139528, 0.08208137048286122], "isController": false}, {"data": ["Reports_OpenInvoices", 4, 0, 0.0, 1743.5, 1000, 3131, 1421.5, 3131.0, 3131.0, 3131.0, 0.15346249760214847, 4.268700244580855, 0.20943734413965087], "isController": false}, {"data": ["MyAccount_PutAttendanceSetup", 1, 0, 0.0, 425.0, 425, 425, 425.0, 425.0, 425.0, 425.0, 2.352941176470588, 1.7279411764705883, 3.308823529411765], "isController": false}, {"data": ["MyAccount_ProfileUpdate", 4, 0, 0.0, 417.0, 356, 558, 377.0, 558.0, 558.0, 558.0, 0.8324661810613944, 4.2661859391259105, 2.6179191597294484], "isController": false}, {"data": ["MyClasses_GetinactiveSchedules", 2, 0, 0.0, 2045.5, 576, 3515, 2045.5, 3515.0, 3515.0, 3515.0, 0.07706535141800247, 2.674069857332768, 0.09723479885943279], "isController": false}, {"data": ["MyClasses_activateGroupClass", 2, 0, 0.0, 671.0, 465, 877, 671.0, 877.0, 877.0, 877.0, 0.0986971969996052, 0.18602108418870905, 0.13060029485787605], "isController": false}, {"data": ["MyTeachers_GetactiveTeachers", 1, 0, 0.0, 1240.0, 1240, 1240, 1240.0, 1240.0, 1240.0, 1240.0, 0.8064516129032258, 2.2311302923387095, 1.0072769657258065], "isController": false}, {"data": ["Feedback_CreateNewFeedbackKPI", 2, 0, 0.0, 284.0, 279, 289, 284.0, 289.0, 289.0, 289.0, 0.1563721657544957, 0.1562194585613761, 0.21104134089132137], "isController": false}, {"data": ["MyStudent_DeleteStudent", 2, 0, 0.0, 942.0, 407, 1477, 942.0, 1477.0, 1477.0, 1477.0, 0.050793650793650794, 0.0865079365079365, 0.06577380952380953], "isController": false}, {"data": ["MyClasses_UpdateOneonOneClass", 2, 0, 0.0, 734.5, 709, 760, 734.5, 760.0, 760.0, 760.0, 0.10054293183189222, 0.20162588917655339, 0.18066308063543132], "isController": false}, {"data": ["MyAccount_Subscriptiondetail", 1, 0, 0.0, 1083.0, 1083, 1083, 1083.0, 1083.0, 1083.0, 1083.0, 0.9233610341643582, 0.577100646352724, 1.1884666435826408], "isController": false}, {"data": ["Dashboard_Basic", 4, 0, 0.0, 254.5, 249, 261, 254.0, 261.0, 261.0, 261.0, 0.08641548565502938, 0.06877795000864155, 0.10924301384808158], "isController": false}, {"data": ["MyClasses_NewGroupClass", 2, 0, 0.0, 544.5, 524, 565, 544.5, 565.0, 565.0, 565.0, 0.09546995083297533, 0.18245575564466082, 0.1541131139911213], "isController": false}, {"data": ["MyAccount_PutLatefee", 1, 0, 0.0, 266.0, 266, 266, 266.0, 266.0, 266.0, 266.0, 3.7593984962406015, 4.078800516917293, 5.33438087406015], "isController": false}, {"data": ["MyAccount_PreferencesUpdate", 4, 0, 0.0, 539.25, 269, 1184, 352.0, 1184.0, 1184.0, 1184.0, 0.2255554302469832, 0.27753890831171757, 0.3655363637645201], "isController": false}, {"data": ["Feedback_UpdateFeedback", 2, 0, 0.0, 362.5, 320, 405, 362.5, 405.0, 405.0, 405.0, 0.1549666821633349, 0.15481534751278475, 0.21080916821633347], "isController": false}, {"data": ["Invoice_GetInvoiceDetails", 2, 0, 0.0, 498.0, 453, 543, 498.0, 543.0, 543.0, 543.0, 0.06052352852171281, 0.28955543576940534, 0.07736845589347859], "isController": false}, {"data": ["Invoice_UpdateInvoice", 2, 0, 0.0, 491.0, 445, 537, 491.0, 537.0, 537.0, 537.0, 0.06053635207942369, 0.28964634473939105, 0.09222334887099705], "isController": false}, {"data": ["MyStudent_InactiveStudent", 2, 0, 0.0, 1914.0, 808, 3020, 1914.0, 3020.0, 3020.0, 3020.0, 0.057602027591371216, 0.09770968938106622, 0.07594017309409291], "isController": false}, {"data": ["MyTeacher_SubscriptionValidation", 1, 0, 0.0, 1119.0, 1119, 1119, 1119.0, 1119.0, 1119.0, 1119.0, 0.8936550491510277, 0.26006758266309205, 1.1755403820375334], "isController": false}, {"data": ["MyStudent_CreateNewStudent", 2, 0, 0.0, 2041.5, 641, 3442, 2041.5, 3442.0, 3442.0, 3442.0, 0.057748390263621406, 0.09784517295642883, 0.10387942857967833], "isController": false}, {"data": ["MyStudent_UpdateStudent", 2, 0, 0.0, 1865.5, 924, 2807, 1865.5, 2807.0, 2807.0, 2807.0, 0.05151850802400763, 0.08779277002138018, 0.0946853829113109], "isController": false}, {"data": ["Feedback_DeactivateFeedbackKPI", 2, 0, 0.0, 387.5, 295, 480, 387.5, 480.0, 480.0, 480.0, 0.26085822355549754, 0.20608818638320073, 0.3479807943132907], "isController": false}, {"data": ["Reports_PaidInvoices", 4, 0, 0.0, 1061.25, 842, 1408, 997.5, 1408.0, 1408.0, 1408.0, 0.1360266612256002, 3.1017798238454737, 0.18245372968101747], "isController": false}, {"data": ["MyTeachers_GetinactiveSchedules", 1, 0, 0.0, 266.0, 266, 266, 266.0, 266.0, 266.0, 266.0, 3.7593984962406015, 3.171992481203007, 4.702919407894736], "isController": false}, {"data": ["MyClasses_UpdateGroupClass", 2, 0, 0.0, 1058.0, 775, 1341, 1058.0, 1341.0, 1341.0, 1341.0, 0.09455370650529502, 0.18005832781770045, 0.15337276025907715], "isController": false}, {"data": ["Invoice_ReceivePaymentInvoice", 2, 0, 0.0, 607.0, 509, 705, 607.0, 705.0, 705.0, 705.0, 0.06041931001147967, 0.29837934641411396, 0.08514166440094255], "isController": false}, {"data": ["MyStudent_activeEnrollment", 2, 0, 0.0, 387.0, 333, 441, 387.0, 441.0, 441.0, 441.0, 0.062192922445425715, 0.09450408918465078, 0.08229629874370296], "isController": false}, {"data": ["Reports_OverdueInvoices", 4, 0, 0.0, 1162.0, 279, 2429, 970.0, 2429.0, 2429.0, 2429.0, 0.15123445120798518, 2.034391364040228, 0.20344282865136676], "isController": false}, {"data": ["MyTeachers_DeleteAvailability", 1, 0, 0.0, 391.0, 391, 391, 391.0, 391.0, 391.0, 391.0, 2.557544757033248, 2.6924152813299234, 3.3193134590792837], "isController": false}, {"data": ["Dashboard_ClassSchedule", 2, 0, 0.0, 2053.0, 1630, 2476, 2053.0, 2476.0, 2476.0, 2476.0, 0.12104339405676935, 6.234916858318708, 0.16383412515886947], "isController": false}, {"data": ["Courses_GetinactiveCourses", 2, 0, 0.0, 282.5, 274, 291, 282.5, 291.0, 291.0, 291.0, 0.19938191606021333, 0.17212266972385604, 0.2505903573920845], "isController": false}, {"data": ["Feedback_DeleteFeedbackKPI", 2, 0, 0.0, 501.0, 393, 609, 501.0, 609.0, 609.0, 609.0, 0.26140373807345446, 0.1702698176708927, 0.34207129786955953], "isController": false}, {"data": ["MyAccount_PutCancellationfee", 1, 0, 0.0, 274.0, 274, 274, 274.0, 274.0, 274.0, 274.0, 3.6496350364963503, 3.4322251368613137, 5.720375228102189], "isController": false}, {"data": ["Feedback_CreateNewFeedback", 2, 0, 0.0, 268.0, 268, 268, 268.0, 268.0, 268.0, 268.0, 0.1565067689177557, 0.13770761601064246, 0.2122928730730104], "isController": false}, {"data": ["Courses_GetCourseDetails", 2, 0, 0.0, 287.5, 270, 305, 287.5, 305.0, 305.0, 305.0, 0.393623302499508, 0.6719272780948632, 0.5039454585711474], "isController": false}, {"data": ["MyTeachers_DeleteTeacher", 1, 0, 0.0, 336.0, 336, 336, 336.0, 336.0, 336.0, 336.0, 2.976190476190476, 5.06010509672619, 3.842308407738095], "isController": false}, {"data": ["Dashboard_Widget", 4, 0, 0.0, 410.25, 264, 663, 357.0, 663.0, 663.0, 663.0, 0.08640988529087727, 0.2725624311421227, 0.11269570488863927], "isController": false}, {"data": ["MyAccount_SubscriptionReport", 1, 0, 0.0, 570.0, 570, 570, 570.0, 570.0, 570.0, 570.0, 1.7543859649122808, 1.2438322368421053, 2.2854989035087723], "isController": false}, {"data": ["Feedback_ActivateFeedbackKPI", 2, 0, 0.0, 314.0, 307, 321, 314.0, 321.0, 321.0, 321.0, 0.2598752598752599, 0.20505782224532226, 0.3464157516891892], "isController": false}, {"data": ["Feedback_GetinactiveFeedbacks", 2, 0, 0.0, 279.0, 265, 293, 279.0, 293.0, 293.0, 293.0, 0.15655577299412915, 0.13071795499021527, 0.19722358121330724], "isController": false}, {"data": ["MyStudent_DeleteSchedule", 2, 0, 0.0, 602.5, 562, 643, 602.5, 643.0, 643.0, 643.0, 0.06142694800208851, 0.13191197134432878, 0.07990302220584171], "isController": false}, {"data": ["Dashboard_ClassTrends", 4, 0, 0.0, 1137.75, 724, 1567, 1130.0, 1567.0, 1567.0, 1567.0, 0.08515530198198966, 0.08234866971451685, 0.10781625880825155], "isController": false}, {"data": ["Invoice_SendInvoice", 2, 0, 0.0, 488.0, 310, 666, 488.0, 666.0, 666.0, 666.0, 0.061218243036424855, 0.03999512167125803, 0.0802293771043771], "isController": false}, {"data": ["MyTeachers_GetTeacherAvailabilityDetails", 1, 0, 0.0, 292.0, 292, 292, 292.0, 292.0, 292.0, 292.0, 3.4246575342465753, 3.6186322773972606, 4.397875642123288], "isController": false}, {"data": ["GetAuthorizationToken", 4, 0, 0.0, 526.25, 265, 1160, 340.0, 1160.0, 1160.0, 1160.0, 1.8656716417910448, 3.805587540811567, 0.6563556728078358], "isController": false}, {"data": ["MyCalender_dayschedules", 4, 0, 0.0, 1119.25, 764, 1748, 982.5, 1748.0, 1748.0, 1748.0, 0.09664637092877162, 3.2397770036000773, 0.12696633837102542], "isController": false}, {"data": ["MyClasses_DeactivateOneononeClass", 2, 0, 0.0, 610.0, 527, 693, 610.0, 693.0, 693.0, 693.0, 0.10172939979654119, 0.20713456892166837, 0.13471197863682605], "isController": false}, {"data": ["Feedback_UpdateFeedbackKPI", 2, 0, 0.0, 309.5, 275, 344, 309.5, 344.0, 344.0, 344.0, 0.15469100471807565, 0.12206087091035656, 0.212700131487354], "isController": false}, {"data": ["MyTeachers_DeactivateTeacher", 1, 0, 0.0, 1154.0, 1154, 1154, 1154.0, 1154.0, 1154.0, 1154.0, 0.8665511265164644, 1.4749986460138649, 1.1280396988734835], "isController": false}, {"data": ["InviteFriends", 4, 0, 0.0, 596.75, 379, 922, 543.0, 922.0, 922.0, 922.0, 0.23630885567436638, 0.14100069415726355, 0.3146553952265611], "isController": false}, {"data": ["MyClasses_GetactiveSchedules", 2, 0, 0.0, 3328.0, 2961, 3695, 3328.0, 3695.0, 3695.0, 3695.0, 0.07653158841311751, 4.436627360521181, 0.09641186430949375], "isController": false}, {"data": ["MyAccount_GetAttendanceSetup", 1, 0, 0.0, 260.0, 260, 260, 260.0, 260.0, 260.0, 260.0, 3.8461538461538463, 2.824519230769231, 4.927884615384615], "isController": false}, {"data": ["Courses_ActivateCourse", 2, 0, 0.0, 396.5, 396, 397, 396.5, 397.0, 397.0, 397.0, 0.3867723844517501, 0.6589105709727325, 0.5065056323728485], "isController": false}, {"data": ["MyStudent_GetinactiveStudentDetails", 2, 0, 0.0, 2252.5, 503, 4002, 2252.5, 4002.0, 4002.0, 4002.0, 0.06309944472488642, 0.5295362092219839, 0.0791207881120646], "isController": false}, {"data": ["MyTeachers_UpdateTeacher", 1, 0, 0.0, 482.0, 482, 482, 482.0, 482.0, 482.0, 482.0, 2.074688796680498, 3.5294022302904566, 3.853572354771784], "isController": false}, {"data": ["MyTeachers_NewTeacherAvailabilty", 1, 0, 0.0, 476.0, 476, 476, 476.0, 476.0, 476.0, 476.0, 2.100840336134454, 2.2157300420168067, 3.3584722951680672], "isController": false}, {"data": ["Dashboard_Notifications", 4, 0, 0.0, 530.75, 270, 1001, 426.0, 1001.0, 1001.0, 1001.0, 0.08671334735199115, 1.7158488288278524, 0.10978892074400053], "isController": false}, {"data": ["Dashboard_ApplicationUser", 4, 0, 0.0, 390.0, 372, 420, 384.0, 420.0, 420.0, 420.0, 0.08381702742912223, 0.551297494132808, 0.10587629392536094], "isController": false}, {"data": ["Feedback_GetFeedbackDetails", 2, 0, 0.0, 324.0, 260, 388, 324.0, 388.0, 388.0, 388.0, 0.269179004037685, 0.2746992765814267, 0.34409698855989235], "isController": false}, {"data": ["MyCalender_monthschedules", 4, 0, 0.0, 6941.75, 1666, 20399, 2851.0, 20399.0, 20399.0, 20399.0, 0.09269343962181077, 68.35794929524019, 0.12177329067503997], "isController": false}, {"data": ["Feedback_DeactivateFeedback", 2, 0, 0.0, 326.0, 318, 334, 326.0, 334.0, 334.0, 334.0, 0.2597065316192702, 0.265286164134528, 0.34542997662641217], "isController": false}, {"data": ["Dashboard_FeesCollection", 4, 0, 0.0, 410.25, 273, 529, 419.5, 529.0, 529.0, 529.0, 0.08756567425569177, 0.08737326920971979, 0.11163768334063047], "isController": false}, {"data": ["Courses_UpdateCourse", 2, 0, 0.0, 480.5, 324, 637, 480.5, 637.0, 637.0, 637.0, 0.18880392712168415, 0.32229420371943734, 0.3239536132351553], "isController": false}, {"data": ["MyClasses_NewOneonOneClass", 2, 0, 0.0, 582.5, 527, 638, 582.5, 638.0, 638.0, 638.0, 0.10164151039284444, 0.21201783808507396, 0.18075116252477513], "isController": false}, {"data": ["Feedback_DeleteFeedback", 2, 0, 0.0, 305.5, 305, 306, 305.5, 306.0, 306.0, 306.0, 0.2644453259288642, 0.231906154964961, 0.343727274229803], "isController": false}, {"data": ["MyStudent_GetactiveStudentDetails", 2, 0, 0.0, 3573.0, 1869, 5277, 3573.0, 5277.0, 5277.0, 5277.0, 0.06764755623203113, 2.668709305766954, 0.08469156942330458], "isController": false}, {"data": ["Dashboard_ChatroomUsers", 4, 0, 0.0, 6146.25, 516, 15286, 4391.5, 15286.0, 15286.0, 15286.0, 0.08357360745476579, 0.23831536500773054, 0.10548719495633278], "isController": false}, {"data": ["Dashboard_Current", 4, 0, 0.0, 872.5, 361, 2042, 543.5, 2042.0, 2042.0, 2042.0, 0.08320159747067143, 0.4263878741471836, 0.1050176413387137], "isController": false}, {"data": ["Reports_PartiallyPaidInvoices", 4, 0, 0.0, 836.25, 281, 2065, 499.5, 2065.0, 2065.0, 2065.0, 0.14910907328710954, 2.1534903172295534, 0.20145742469991798], "isController": false}, {"data": ["Courses_DeactivateCourse", 2, 0, 0.0, 388.5, 349, 428, 388.5, 428.0, 428.0, 428.0, 0.3905487209529389, 0.667060266549502, 0.5122138010154267], "isController": false}, {"data": ["Courses_GetactiveCourses", 2, 0, 0.0, 897.0, 338, 1456, 897.0, 1456.0, 1456.0, 1456.0, 0.1786352268667381, 3.9513449278760273, 0.22416627590210791], "isController": false}, {"data": ["MyStudent_DeleteEnrollment", 2, 0, 0.0, 312.0, 306, 318, 312.0, 318.0, 318.0, 318.0, 0.06246096189881324, 0.03726918722673329, 0.08137004216114928], "isController": false}, {"data": ["Courses_CreateNewCourse", 2, 0, 0.0, 482.0, 383, 581, 482.0, 581.0, 581.0, 581.0, 0.19344230583228553, 0.32605607408840315, 0.31339920446851727], "isController": false}, {"data": ["Feedback_ActivateFeedback", 2, 0, 0.0, 425.5, 331, 520, 425.5, 520.0, 520.0, 520.0, 0.2600780234070221, 0.2654116547464239, 0.3456701072821846], "isController": false}, {"data": ["Invoice_PrintInvoice", 2, 0, 0.0, 243.0, 240, 246, 243.0, 246.0, 246.0, 246.0, 0.06202512017367033, 0.018474278957977982, 0.07977254225461312], "isController": false}, {"data": ["Reports_CancelledInvoices", 4, 0, 0.0, 2137.25, 277, 4151, 2060.5, 4151.0, 4151.0, 4151.0, 0.13871068419044977, 3.740379655477338, 0.18673113101224123], "isController": false}, {"data": ["Courses_DeleteCourse", 2, 0, 0.0, 369.5, 369, 370, 369.5, 370.0, 370.0, 370.0, 0.38595137012736397, 0.6584541441528367, 0.5024152113083751], "isController": false}, {"data": ["MyTeachers_NewTeacher", 1, 0, 0.0, 549.0, 549, 549, 549.0, 549.0, 549.0, 549.0, 1.8214936247723132, 3.0986737249544625, 3.3263604280510015], "isController": false}, {"data": ["MyClasses_activateOneonOneClass", 2, 0, 0.0, 459.0, 408, 510, 459.0, 510.0, 510.0, 510.0, 0.10269576379974327, 0.20890163671373554, 0.13589136713735558], "isController": false}, {"data": ["MyStudent_activeStudent", 2, 0, 0.0, 1836.0, 786, 2886, 1836.0, 2886.0, 2886.0, 2886.0, 0.05434930297018941, 0.0920859772004674, 0.07159883760428272], "isController": false}, {"data": ["Dashboard_CourseTrends", 2, 0, 0.0, 302.5, 285, 320, 302.5, 320.0, 320.0, 320.0, 0.131466508906856, 1.303367185959377, 0.16844146453690922], "isController": false}, {"data": ["MyStudent_CreateNewEnrollment", 2, 0, 0.0, 779.5, 612, 947, 779.5, 947.0, 947.0, 947.0, 0.057902203178830956, 0.09632461241712748, 0.0896805607828378], "isController": false}, {"data": ["MyClasses_DeleteOneonOneClass", 2, 0, 0.0, 705.0, 667, 743, 705.0, 743.0, 743.0, 743.0, 0.10134792743488395, 0.21120749721293197, 0.13183148373365763], "isController": false}, {"data": ["MyStudent_CreateNewSchedule", 2, 0, 0.0, 747.5, 688, 807, 747.5, 807.0, 807.0, 807.0, 0.05835667600373483, 0.12563212133811857, 0.10480266325280113], "isController": false}, {"data": ["Invoice_CreateNewInvoice", 2, 0, 0.0, 982.0, 547, 1417, 982.0, 1417.0, 1417.0, 1417.0, 0.05880623346074684, 0.2813683016024699, 0.08734793075566011], "isController": false}, {"data": ["MyTeachers_GetTeacherDetails", 1, 0, 0.0, 276.0, 276, 276, 276.0, 276.0, 276.0, 276.0, 3.6231884057971016, 6.163666213768115, 4.599750905797101], "isController": false}, {"data": ["MyTeachers_activateTeacher", 1, 0, 0.0, 496.0, 496, 496, 496.0, 496.0, 496.0, 496.0, 2.0161290322580645, 3.429782006048387, 2.620573966733871], "isController": false}, {"data": ["Feedback_GetactiveFeedbacks", 2, 0, 0.0, 714.5, 302, 1127, 714.5, 1127.0, 1127.0, 1127.0, 0.1469615695495628, 0.20436843265486077, 0.18485009919905945], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 224, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
