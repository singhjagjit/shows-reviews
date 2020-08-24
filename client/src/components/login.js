import React, { Component } from "react";
import axios from "axios";
import { Form, Button, Alert, Container, Row, Col } from "react-bootstrap";

export default class Login extends Component {
  state = {
    username: "",
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
      .post("http://localhost:5000/api/auth/login", {
        username: this.state.username,
        password: this.state.password,
      })
      .then((res) => {
        localStorage.setItem("usertoken", res.data.token);
        localStorage.setItem("username", res.data.user.username);
        window.location = "/showslist";
      })
      .catch((e) => {
        if (e.response) {
          console.log(e.response);
          this.setState({ error: e.response.data.msg });
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
            <h1>Login here!</h1>
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
                Login
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    );
  }
}
