import axios from "axios";
import React, { useState, useEffect } from "react";
import { Table } from "react-bootstrap";
import RowStudent from "./RowStudent";

/*
Form prototype used to create a form that can run the specific
GET request. The form will use the handleSubmit() handle to perform
an axios GET request for specific search, but if the user clicks
"Reset" the handleClick() handler will "Clear" the search results
buy doing a GET request that will return nothing.
*/
const SearchForm = () => {
    const [ students, setStudents ] = useState([]);
    function handleSubmit(e) {
        e.preventDefault();
        var getURL = "http://localhost:5678/students/" + e.target.query.value;
        axios.get(getURL).then(({ data }) => { setStudents(data); }).catch((error) => { console.log(error); });
    }
    function handleClick(e) {
        e.preventDefault();
        var getURL = "http://localhost:5678/students/0";
        axios.get(getURL).then(({ data }) => { setStudents(data); }).catch((error) => { console.log(error); });
    }
    const SearchTable = () => {
        return students.map((res, i) => { return <RowStudent obj={ res } key={ i } />; });
    };
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <input className="container-fluid form-control" autoComplete="off" type="text" name="query" placeholder="Search here by record ID or last name" />
                    <button className="btn btn-primary rounded-0" type="submit">Search</button>
                    <button className="cancel-link" onClick={handleClick}>Reset</button>
                </div>
            </form>
            <br />
            <div className="table-wrapper">
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Search Results:</th>
                        </tr>
                    </thead>
                    <tbody>{ SearchTable() }</tbody>
                </Table>
            </div>
        </div>
    )
}

export default SearchForm;