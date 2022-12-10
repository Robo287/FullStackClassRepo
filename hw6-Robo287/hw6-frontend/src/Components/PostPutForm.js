import React from "react";
import { FormGroup, Button, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

/*
Form prototype used to create a POST or PUT Form
*****Form does not work, switched to using dedicated
*****forms for both PUT and POST, but deleting this 
*****form breaks the project and there's not enough
*****time to troubleshoot what needs this file as a
*****dependeancy.
*/
const PostPutForm = (props) => {
    return (
        <div>
            <form>
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
                        <Button variant="primary" size="md" block="block" type="submit">{ props.children }</Button>
                        <Link className="cancel-link" to={ "/" }>Cancel</Link>
                    </Col>
                </Row>
            </form>
        </div>
    );
};

export default PostPutForm;