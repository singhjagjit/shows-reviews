import React, { Component } from "react";
import axios from "axios";
import { Form, Button, Alert, Container, Row, Col } from "react-bootstrap";

export default class Register extends Component {
  state = {
    username: "",
    email: "",
    password: "",
    error: "",
  };

  onChange = this.onChange.bind(this);
  onSubmit = this.onSubmit.bind(this);

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  onSubmit(e) {
    e.preventDefault();

    axios
      .post("http://localhost:5000/api/auth/register", {
        username: this.state.username,
        email: this.state.email,
        password: this.state.password,
      })
      .then((res) => {
        this.props.history.push(`/`);
      })
      .catch((e) => {
        if (e.response) {
          console.log(e.response);
          this.setState({ error: e.response.data.error });
        } else if (e.request) {
          console.log(e.request);
        } else {
          console.log(e.message);
        }
        console.log(e);
      });
  }

  render() {
    return (
      <Container>
        <Row className="justify-content-sm-center">
          <Col sm={6} className="mt-5">
            <h1>Register here!</h1>
            {this.state.error !== "" && (
              <Alert variant="warning">{this.state.error}</Alert>
            )}
            <Form onSubmit={this.onSubmit}>
              <Form.Group>
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter username"
                  name="username"
                  value={this.state.username}
                  onChange={this.onChange}
                />
              </Form.Group>

              <Form.Group controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  name="email"
                  value={this.state.email}
                  onChange={this.onChange}
                />
              </Form.Group>

              <Form.Group controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  name="password"
                  onChange={this.onChange}
                />
              </Form.Group>
              <Button variant="info" type="submit">
                Register
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    );
  }
}
