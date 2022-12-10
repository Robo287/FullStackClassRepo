const { response } = require("express");

const studentList = document.querySelector("#studentList");
const searchForm = document.querySelector("#search-form");
const updateForm = document.querySelector("#update-form");
var recUpdateBtn;
var recDeleteBtn;
const messageDiv = document.querySelector('#message');

// finds which record update button was pressed and generates the form to do the PUT request
function selectupdbtn(id) {
    recUpdateBtn = document.querySelector("#" + id);
    var rid = recUpdateBtn.parentNode.parentNode.cells[0].innerHTML;
    document.querySelector('#edit-id').innerText = rid;
    var name = recUpdateBtn.parentNode.parentNode.cells[1].innerHTML;
    var nameArr = name.split(" ", 2);
    var fname = nameArr[0];
    document.querySelector("#input-fname").value = fname;
    var lname = nameArr[1];
    document.querySelector("#input-lname").value = lname;
    var gpa = recUpdateBtn.parentNode.parentNode.cells[2].innerHTML;
    document.querySelector("#input-gpa").value = gpa;
    var enrolled = recUpdateBtn.parentNode.parentNode.cells[3].innerHTML;
    document.querySelector("#input-enrolled").value = enrolled;
    document.querySelector('#put-form-div').style.display = "block";
    document.querySelector('#post-form-div').style.display = "none";
    console.log("ID: " + rid + " | First Name: " + fname + " | Last Name: " + lname + " | GPA: " + gpa + " | Enrolled: " + enrolled);
    
};

// finds which record delete button was pressed and sends a DELETE request for that record
function selectdelbtn(id) {
    recDeleteBtn = document.querySelector("#" + id);
    var rid = recDeleteBtn.parentNode.parentNode.cells[0].innerHTML;
    fetch('/students', {
        headers: { 'Content-Type': 'application/json' },
        method: 'delete',
        body: JSON.stringify({ _id: rid })
    })
        .then(res => { if (res.ok) return res.json(); })
        .then(response => {
            if (response === "404 - Unable to locate record") {
                messageDiv.textContent = 'There are no matching entries to delete'
            } else {
                window.location.reload(true);
            }
        })
        .catch(error => console.log(error));
}

// takes the search query and sends a GET to the query URL route
function search() {
    var query = document.querySelector("#input-query").value;
    location.href = "http://localhost:5678/students/" + query;
}

// used to show the add student form and hides the update student form if it's being shown
function showForm() {
    document.querySelector('#post-form-div').style.display = "block";
    document.querySelector('#put-form-div').style.display = "none";
}

// takes the from input from the update form and passes it to a PUT request
function update() {
    var rid = document.querySelector('#edit-id').innerText;
    var fname = document.querySelector('#input-fname').value;
    var lname = document.querySelector('#input-lname').value;
    var gpa = document.querySelector('#input-gpa').value;
    var enrolled = document.querySelector('#input-enrolled').value;
    fetch('/students', {
        method: 'put',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _id: rid, fname: fname, lname: lname, gpa: gpa, enrolled, enrolled })
    })
        .then(res => { if (res.ok) return res.json(); })
        .then(response => { window.location.reload(true); })
        .catch(error => console.log(error));
}

// clears the record ID text on the PUT form and closes either PUT or POST form if they are open
function cancel() {
    document.querySelector('#edit-id').innerText = "";
    document.querySelector('#put-form-div').style.display = "none";
    document.querySelector('#post-form-div').style.display = "none";
}

// added functionality to dynamically filter the shown list of search results
function filterList() {
    var td;
    var input = document.querySelector('#filter-query');
    var filter = input.value.toUpperCase();
    var table = document.querySelector('#studentList');
    var tr = table.getElementsByTagName("tr");

    for (var i = 0; i < tr.length; i++) {
        if (isNaN(filter)) {
            td = tr[i].getElementsByTagName("td")[1];
        } else {
            td = tr[i].getElementsByTagName("td")[0];
        }
        if (td) {
            var txtValue = td.textContent || td.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}