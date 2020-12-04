import React, {useEffect, useState} from 'react';
import { Card, CardColumns, Button , ListGroup, ListGroupItem, Container, Row, Col, Form} from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';

import './App.css';

var stats = {
  
  firstName: "",
  lastName: "",
  email: "",
  company: "Facebook", //had to hard code because api didn't contain company
  title: "Software Engineer", 
  address: "",
  set setEmail(m){
    this.email = m;
  }
}

function UpdateEmail(props){
  const emailInput = React.createRef();
  const onSubmitHandler = (parameter) => {
     
    parameter.preventDefault();
    props.setEmail(emailInput.current.value)
    var temp = props.person;
    temp.email = emailInput.current.value;
    props.setPerson(temp)
  };
  
  return(
    <Container>
      <Row>
        <Col>
          <Form onSubmit  = {onSubmitHandler}>
            <Form.Group as={Row} controlId="formHorizontalEmail">
              <Form.Label column sm={2}>
                Email
              </Form.Label>
              <Col sm={10}>
                <Form.Control 
                    type="email" 
                    ref ={emailInput} 
                    placeholder="Enter email you'd like to change to." 
                    required
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Col sm={{ }}>
                <Button type = "submit" >Change</Button>
              </Col>
            </Form.Group>
          </Form>
        </Col>
      </Row>
    </Container>
  );
  
}

function Profile(props){
  useEffect(() => {
    let request = async () =>{
      try {
        const url = "https://api.randomuser.me/";
        const response = await fetch(url);
        const data = await response.json();
        props.setPerson(data.results[0]);
        props.setLoading(false);
        props.setEmail(props.person.email);
        stats.firstName = props.person.name.first;
      } catch (error) {
        console.log(error);
      }
    };
    request();
  }, [] );
  return(
    <div> {props.loading || !props.person ? (
      <div> loading... </div>
    ) : (
      
      <Container fluid>
        <Row>
          <Col>
              <Card className = "Card1">
                <Card.Body>
                  <Card.Title>Profile</Card.Title>
                  <Card.Img variant="top" src = {props.person.picture.large} />
                </Card.Body>
                <ListGroup className="list-group-flush">
                  <ListGroupItem>First name: {props.person.name.first}</ListGroupItem>
                  <ListGroupItem>Last name: {props.person.name.last}</ListGroupItem>
                  <ListGroupItem>Email: {props.person.email}</ListGroupItem>
                  <ListGroupItem>Company: {stats.company}</ListGroupItem>
                  <ListGroupItem>Title: {stats.title}</ListGroupItem>
                  <ListGroupItem>Address: {props.person.location.street.number + " " + props.person.location.street.name + ", " 
                    + props.person.location.city + ", " + props.person.location.postcode + ", " + props.person.location.country }</ListGroupItem>
                </ListGroup>
              </Card>
            </Col>
        </Row>
      </Container>
    )} </div>
    
    
  );
}

//this function would be the patch function I would use if using the correct api
//cannot use this patch function because the api randomizes every fetch call
function Patch(props){
  
  useEffect(() => {
    let handleSubmit = async (event) => {
      try {
        fetch("https://api.randomuser.me/", {
        method: "PATCH",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: props.email
        })
      })
        .then(response => response.json())
        .then(json => console.log(json))
        console.log("200 OK")
      } catch (error) {
        console.log("Error: 400")
      }
    };
    try {
      handleSubmit();
    } catch (error) {
      console.log("ERROR: 400")
    }
    
  }, []);
  

  return null;
}

function App(props) {
  const [loading,setLoading] = useState(true);
  const [person, setPerson] = useState(null);
  const [email, setEmail] = useState(stats.email);
  return (
    <div className="App">
      
      <div className = "App-header"> {props.title} </div>
      <Profile email = {email} setEmail = {setEmail} loading = {loading} setLoading = {setLoading} person = {person} setPerson = {setPerson}/>
      <UpdateEmail email = {email} setEmail = {setEmail} person = {person} setPerson = {setPerson}/>
      <Patch email = {email}/>
    </div>
  );
}


export default App;
