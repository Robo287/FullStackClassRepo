import React from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";

/*
Table Row prototype used to create a row for each student entry
found during a GET request. 
*/
const RowStudent = (props) => {
    const{ _id, fname, lname, gpa, enrolled } = props.obj;
    const deleteStudent = () => {
        axios.delete("http://localhost:5678/students/" + _id)
            .then((res) => { if (res.ok) { console.log("Axios.delete successful in RowStudent.js"); window.location.reload(); } })
            .catch((err) => console.log("Axios.delete failed in RowStudent.js"));
    };
    return (
        <tr>
            <td>{ _id }</td>
            <td>{ fname }</td>
            <td>{ lname }</td>
            <td>{ gpa }</td>
            <td>{ enrolled }</td>
            <td>
                <Link className="edit-link" to={ "/put-student/" + _id }>Edit</Link>
                <Button onClick={ deleteStudent } size="sm" variant="danger">Delete</Button>
            </td>
        </tr>
    )
}

export default RowStudent;