//scripts.js
function sendGetStudents() {
    $.ajax({
        url: "http://localhost:5678/students",
        type: "get",
        success: function(response) {
            $("#searchResults").empty();
            console.log(response);
            buildResults(response)
        },
        error: function(xhr) {
            console.log(xhr);
            buildResults(xhr);
        }
    });
}

function sendGetStudentsByInput() {
    var searchInput = $('#searchInput').val();
    console.log("Query: " + searchInput);
    if ($.isNumeric(searchInput)) {
        var idURL = "http://localhost:5678/students/" + searchInput;
        $.ajax({
            url: idURL ,
            type: "get",
            success: function(response) {
                $("#searchResults").empty();
                var res = JSON.parse(response);
                console.log(res);
                buildResults(res);
            },
            error: function(xhr) {
                console.log(xhr);
                buildResults(xhr);
            }
        });
    } else {
        var nameURL = "http://localhost:5678/search?last_name=" + searchInput;
        $.ajax({
            url: nameURL,
            type: "get",
            success: function(response) {
                $("#searchResults").empty();
                console.log(response);
                buildResults(response)
            },
            error: function(xhr) {
                console.log(xhr);
                buildResults(xhr);
            }
        });
    }
}

function sendPostStudents() {
    var cap_first_name = $("#newfname").val();
    var cap_last_name = $("#newlname").val();
    var cap_gpa = Number($("#newGPA").val());
    var cap_enrolled;
    console.log("GPA Type: " + $.type(cap_gpa));
    if($("#newIsEnrolled").is(":checked")) {
        cap_enrolled = "true";
    } else {
        cap_enrolled = "false";
    }
    console.log("Captured inputs: " + cap_first_name + ", " + cap_last_name + ", " + cap_gpa + ", " + cap_enrolled);
    if (cap_gpa > 4.0 || cap_gpa < 0.0) {
        var p1 = $("<p></p>").addClass("my-3 p-0 text-danger").text("Please enter a GPA within a range of 0.0 and 4.0");
        $("#response").empty();
        $("#response").append(p1);
    } else {
        $.ajax({
            url: "http://localhost:5678/students/",
            type: "post",
            data: {
                first_name: cap_first_name,
                last_name: cap_last_name,
                gpa: cap_gpa,
                enrolled: cap_enrolled
            },
            success: function(response) {
                console.log(response);
                displayResponse(response);
            },
            error: function(xhr) {
                console.log(xhr);
                buildResults(xhr);
            }
        });
    }
}

function sendPutStudents() {
    var urlParams = new URLSearchParams(window.location.search);
    var cap_record_id = urlParams.get('rid');
    var cap_first_name = $("#editfname").val();
    var cap_last_name = $("#editlname").val();
    var cap_gpa = $("#editGPA").val();
    var cap_enrolled;
    if($("#editIsEnrolled").is(":checked")) {
        cap_enrolled = "true";
    } else {
        cap_enrolled = "false";
    }
    console.log("Captured inputs: " + cap_record_id + ", " + cap_first_name + ", " + cap_last_name + ", " + cap_gpa + ", " + cap_enrolled);
    var putURL = "http://localhost:5678/students/" + cap_record_id;
    $.ajax({
        url: putURL,
        type: "put",
        data: {
            record_id: cap_record_id,
            first_name: cap_first_name,
            last_name: cap_last_name,
            gpa: cap_gpa,
            enrolled: cap_enrolled
        },
        success: function(response) {
            console.log(response);
            displayResponse(response);
        },
        error: function(xhr) {
            console.log(xhr);
            buildResults(xhr);
        }
    });
}

function sendDeleteStudents() {
    $("a").click(function(event) {
        event.stopImmediatePropagation(); //stops on.('click') event from firing more than once
        var divid = "#" + $(this).parent().parent().attr('id');
        var rid = $(divid).find("#rid").text().replace('Record ID: ', '');
        var url = "http://localhost:5678/students/" + rid;
        console.log(url);
        $.ajax({
            url: url,
            type: "delete",
            success: function(response) {
                console.log(response);
                displayResponse(response);
            },
            error: function(xhr) {
                console.log(xhr);
                buildResults(xhr);
            }
        });
    });
}

function buildResults(response) {
    $("#searchResults").show();
    $("#response").hide();
    if (Array.isArray(response.students) && !response.students.length || response.status == 404) {
        $("#searchResults").empty();
        var br = $("<br />");
        var p1 = $("<p></p>").addClass("m-0 p-0").addClass("m-0 p-0 text-danger").text("No matches found for your search");
        $("#searchResults").append(br, p1);
    } else if (Array.isArray(response.students)) {
        var count = 0;
        for (var student of response.students) {
            var recordID = student.record_id;
            var firstName = student.first_name;
            var lastName = student.last_name;
            var gpa = student.gpa;
            var enrolled
            if (student.enrolled == "true") {
                enrolled = "Enrolled";
            } else {
                enrolled = "Not Enrolled"
            }
            var url = "editStudent.html?rid=" + recordID + "&fname=" + firstName + "&lname=" + lastName + "&gpa=" + gpa + "&enroll=" + enrolled;
            var p1 = $("<p></p>").addClass("m-0 p-0").text("Student: " + lastName + ", " + firstName);
            var p2 = $("<footer></footer>").attr("id", "rid").addClass("m-0 p-0").text("Record ID: " + recordID);
            var p3 = $("<footer></footer>").addClass("m-0 p-0").text("GPA: " + gpa + " | Enrollment: " + enrolled);
            var divid = "itemDiv" + count;
            var divid2 = "deleteDiv" + count;
            var aid = "btn" + count;
            var div = $("<div></div>").attr("id", divid);
            var div2 = $("<div></div>").attr("id", divid2).addClass("row input-group-newsletter mb-2 mx-0");
            var a = $("<a></a>").attr({"href":url}).addClass("btn btn-primary col-auto").text("Update");
            var a2 = $("<a></a>").attr({"onclick":"sendDeleteStudents()", "id":aid}).addClass("btn btn-primary col-auto mx-2").text("Delete");
            var br = $("<br />");
            $("#searchResults").append(div);
            $("#" + divid).append(p1, p2, p3, div2, br, br);
            $("#" + divid2).append(a, a2);
            count = count + 1;
        }
    } else {
            var recordID = response.record_id;
            var firstName = response.first_name;
            var lastName = response.last_name;
            var gpa = response.gpa;
            var enrolled
            if (response.enrolled == "true") {
                enrolled = "Enrolled";
            } else {
                enrolled = "Not Enrolled"
            }
            var url = "editStudent.html?rid=" + recordID + "&fname=" + firstName + "&lname=" + lastName + "&gpa=" + gpa + "&enroll=" + enrolled;
            var p1 = $("<p></p>").addClass("m-0 p-0").text("Student: " + lastName + ", " + firstName);
            var p2 = $("<footer></footer>").attr("id", "rid").addClass("m-0 p-0").text("Record ID: " + recordID);
            var p3 = $("<footer></footer>").addClass("m-0 p-0").text("GPA: " + gpa + " | Enrollment: " + enrolled);
            var div = $("<div></div>").attr("id", "itemDiv");
            var div2 = $("<div></div>").attr("id", "deleteDiv").addClass("row input-group-newsletter mb-2 mx-0");
            var a = $("<a></a>").attr({"href":url}).addClass("btn btn-primary col-auto").text("Update");
            var a2 = $("<a></a>").attr({"onclick":"sendDeleteStudents()", "id":aid}).addClass("btn btn-primary col-auto mx-2").text("Delete");
            var br = $("<br />");
            $("#searchResults").append(div);
            $("#itemDiv").append(p1, p2, p3, div2, br, br);
            $("#deleteDiv").append(a, a2);
    }
}

function displayResponse(response) {
    $("#newStudentForm").hide();
    $("#searchResults").hide();
    $("#editStudentForm").hide();
    $("#response").show();
    $("#response").empty()
    var br = $("<br />");
    var a = $("<a></a>").attr("href", "index.html").addClass("btn btn-primary").text("Return Home");
    if(response.record_id == -1) {
        var p1 = $("<p></p>").addClass("m-0 p-0").text("Return Code: " + response.record_id);
        var p2 = $("<p></p>").addClass("m-0 p-0").addClass("m-0 p-0 text-danger").text(response.message);
        $("#response").append(br, p1, p2, a);
    } else {
        var p1 = $("<p></p>").addClass("m-0 p-0").text("Record ID: " + response.record_id);
        var p2 = $("<p></p>").addClass("m-0 p-0").addClass("m-0 p-0 text-success").text(response.message);
        $("#response").append(br, p1, p2, a);
    }
}

function passValues() {
    var urlParams = new URLSearchParams(window.location.search);
    var rid = urlParams.get('rid');
    var fname = urlParams.get('fname');
    var lname = urlParams.get('lname');
    var fullname = fname + " " + lname;
    var gpa = urlParams.get('gpa');
    var enroll = urlParams.get('enroll');
    var p1 = $("<p></p>").addClass("m-0 p-0").text(fullname);
    var p2 = $("<p></p>").addClass("m-0 p-0").attr("id", "rid").text("Record ID: " + rid);

    $("#header").append(p1, p2);
    $("#editfname").val(fname);
    $("#editlname").val(lname);
    $("#editGPA").val(gpa);
    if (enroll == "Enrolled") {
        $("#editIsEnrolled").prop("checked", true);
    } else {
        $("#editIsEnrolled").prop("checked", false);
    }
}