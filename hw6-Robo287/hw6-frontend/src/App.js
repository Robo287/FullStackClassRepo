// import React
import React from 'react';

// import Bootstrap
import { Nav, Navbar, Container, Row, Col } from 'react-bootstrap';
import "bootstrap/dist/css/bootstrap.css";

// import Custom CSS
import './App.css';

// import React router
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

// import React Components
import PostStudent from './Components/post-student.component';
import PutStudent from './Components/put-student.component';
import GetStudentList from './Components/get-student-table.component';
import SearchForm from './Components/SearchForm';

// App component
const App = () => {
  return (
    <Router>
      <div className='App'>
        <header className='App-header'>
          <Navbar bg='dark' variant='dark'>
            <Container>
              <Navbar.Brand>
                Student Database
              </Navbar.Brand>
              <Nav className='justify-content-end'>
                <Nav>
                  <Link to={ "/post-student" } className="nav-link">Create Student</Link>
                </Nav>
              </Nav>
            </Container>
          </Navbar>
        </header>
        <br />
        <Container>
          <Row>
              <Col md={ 12 }>
                <div className='wrapper'>
                  <Routes>
                    <Route path='/' element={<div />} />
                    <Route path='/post-student' element={ <PostStudent/> } />
                    <Route path='/put-student/:id' element={ <PutStudent/> }/>
                  </Routes>
                </div>
              </Col>
            </Row>
        </Container>
        <br />
        <Container>
          <SearchForm />
        </Container>
        <br />
        <Container>
          <GetStudentList />
        </Container>
        <footer className="fixed-bottom bg-secondary text-white">
          <h4 className="text-center">Anthony Robustelli - Z23478142</h4>
        </footer>
      </div>
    </Router>
  );
}

export default App;
