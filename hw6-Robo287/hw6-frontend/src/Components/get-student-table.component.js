import React, { useState, useEffect } from "react";
import axios from "axios";
import { Tab, Table } from "react-bootstrap";
import RowStudent from "./RowStudent";

/*
The constructor for the get-student-table component will use
the useEffect hook to perform an axios get request. The corresponding
data that is returned will be passed into setStudents to be
stored locally. Then the return will call StudentTable which will 
create a map of the get response and generate a <RowStudent> element
fer each entry and adds it to the table.
*/
const GetStudentList = () => {
    const [ students, setStudents ] = useState([]);
    useEffect(() => {
        axios.get("http://localhost:5678/students/")
            .then(({ data }) => { setStudents(data); })
            .catch((error) => { console.log(error); });
    }, []);
    const StudentTable = () => { return students.map((res, i) => { return <RowStudent obj={ res } key={ i } />; }); };
    return (
        <div className="table-wrapper">
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Record ID</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>GPA</th>
                        <th>Enrollment Status</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>{ StudentTable() }</tbody>
            </Table>
        </div>
    );
};

export default GetStudentList;