import React, { useState, useEffect } from "react";
import { FormGroup, Button, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

/*
The constructor for the post-student component will use
its return to generate a form that the user can fill out.
When the form is submitted, it performs a POST request
*/
const PostStudent = () => {
    const [ formValues, setFormValues ] = useState({ fname: '', lname: '', gpa: '', enrolled: false });
    return (
        <div>
            <form action="http://localhost:5678/students/" method="POST">
                <Row>
                    <Col><label htmlFor="fname">First Name:</label></Col>
                    <Col><label htmlFor="lname">Last Name:</label></Col>
                    <Col><label htmlFor="gpa">GPA:</label></Col>
                    <Col><label htmlFor="enrolled">Is the student enrolled?</label></Col>
                    <Col></Col>
                </Row>
                <Row>
                    <Col>
                        <input type="text" name="fname" placeholder="First name" className="form-control" />
                    </Col>
                    <Col>
                        <input type="text" name="lname" placeholder="Last name" className="form-control" />
                    </Col>
                    <Col>
                        <input type="text" name="gpa" placeholder="GPA" className="form-control" />
                    </Col>
                    <Col>
                        <select name="enrolled">
                            <option>Yes</option>
                            <option>No</option>
                        </select>
                    </Col>
                    <Col>
                        <Button variant="primary" size="md" block="block" type="submit">Submit</Button>
                        <Link className="cancel-link" to={ "/" }>Cancel</Link>
                    </Col>
                </Row>
            </form>
        </div>
    );
};

export default PostStudent;