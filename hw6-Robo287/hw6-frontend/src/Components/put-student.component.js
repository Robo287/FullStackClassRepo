import React, { useState, useEffect } from "react";
import axios from "axios";
import { FormGroup, Button, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

/*
The constructor for the put-student component will use the useEffect
 hook to prefill the edit form for the entry that was clicked on, once 
 the form is filled out and "Save" is clicked the onClick event handle
 will call onSubmit() to take in the form values and perform the axios
 PUT request to perform the db update. 
*/
const PutStudent = (props) => {
    const [ fname, setfname ] = useState({ fname: ''});
    const [ lname, setlname ] = useState({ lname: ''});
    const [ gpa, setgpa ] = useState({ gpa: ''});
    const [ enrolled, setenrolled ] = useState({ enrolled: false});
    var url = window.location.href;
    var rid = url.split("/")[4];
    const onSubmit = (e) => { 
        var obj = {};
        if (e.target.form.enrolled.value == "Yes") { obj.enrolled = true } else { obj.enrolled = false };
        if (e.target.form.fname.value == "") { obj.fname = fname.fvalue } else { obj.fname = e.target.form.fname.value };
        if (e.target.form.lname.value == "") { obj.lname = lname.lvalue } else { obj.lname = e.target.form.lname.value };
        if (e.target.form.gpa.value == "") { obj.gpa = gpa.gvalue } else { obj.gpa = e.target.form.gpa.value };
        obj._id = rid;
        console.log(obj);
        axios.put('http://localhost:5678/students/', obj)
            .then(res => { if (res.ok) { console.log("Axios.put successful in put-student.component.js") } })
            .catch(err => console.log("Axios.put failed in put-student.component.js")); 
        window.location.href = "http://localhost:3000/"
    }
    useEffect(() => { 
        axios.get('http://localhost:5678/students/' + rid)
            .then((res) => { 
                const fvalue = res.data[0].fname; setfname({ fvalue }); 
                const lvalue = res.data[0].lname; setlname({ lvalue }); 
                const gvalue = res.data[0].gpa; setgpa({ gvalue }); 
            })
            .catch((err) => console.log(err));
    }, []);
    return (
        <div>
            <div>
                <h3>Record ID: <span>{rid}</span></h3>
            </div>
            <form>
                <Row>
                    <Col><label htmlFor="_id">Record ID:</label></Col>
                    <Col><label htmlFor="fname">First Name: </label></Col>
                    <Col><label htmlFor="lname">Last Name: </label></Col>
                    <Col><label htmlFor="gpa">GPA: </label></Col>
                    <Col><label htmlFor="enrolled">Is the student enrolled?</label></Col>
                    <Col></Col>
                </Row>
                <Row>
                    <Col>
                        <input type="text" name="_id" placeholder={rid} className="form-control" readOnly/>
                    </Col>
                    <Col>
                        <input type="text" name="fname" placeholder={fname.fvalue} className="form-control" />
                    </Col>
                    <Col>
                        <input type="text" name="lname" placeholder={lname.lvalue} className="form-control" />
                    </Col>
                    <Col>
                        <input type="text" name="gpa" placeholder={gpa.gvalue} className="form-control" />
                    </Col>
                    <Col>
                        <select name="enrolled" >
                            <option>Yes</option>
                            <option>No</option>
                        </select>
                    </Col>
                    <Col>
                        <Button variant="primary" size="md" block="block" onClick={ onSubmit }>Save</Button>
                        <Link className="cancel-link" to={ "/" }>Cancel</Link>
                    </Col>
                </Row>
            </form>
        </div>
    );
};

export default PutStudent;