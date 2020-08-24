import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";
import {
  Form,
  Button,
  FormControl,
  Card,
  Container,
  Row,
  Col,
  Alert,
  Spinner,
} from "react-bootstrap";

const Show = (props) => {
  return (
    <Col lg={4} md={6} sm={8} className="mt-5">
      <Card
        style={{ width: "18rem", color: "#222222", backgroundColor: "#ebf5ff" }}
      >
        <Card.Body>
          <Card.Title>{props.name}</Card.Title>
          <Card.Text>Genre: {props.genre}</Card.Text>
          <Card.Text>Start Year: {props.year}</Card.Text>
          <Button variant="info" as={NavLink} to={"/" + props.id}>
            Add a review
          </Button>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default class ShowList extends Component {
  state = {
    username: "",
    keyword: "",
    loading: false,
    showslist: [],
    error: "",
  };

  onChange = this.onChange.bind(this);
  onSubmit = this.onSubmit.bind(this);

  componentDidMount() {
    let userToken = localStorage.usertoken;
    let username = localStorage.username;
    if (!userToken) {
      this.props.history.push(`/`);
    } else {
      this.setState({ username: username });
    }
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  onSubmit(e) {
    e.preventDefault();

    this.setState({ loading: true });

    const keyword = this.state.keyword;

    axios
      .post(
        "api/shows/search/",
        { keyword: keyword },
        {
          headers: {
            "x-auth-token": localStorage.getItem("usertoken"),
          },
        }
      )
      .then((res) => {
        this.setState({ loading: false, showslist: res.data, error: "" });
      })
      .catch((e) => {
        if (e.response) {
          this.setState({
            error: e.response.data.msg,
            loading: false,
            showslist: [],
          });
        } else if (e.request) {
          console.log(e.request);
        } else {
          console.log(e.message);
        }
        console.log(e);
      });
  }

  showlist() {
    return this.state.showslist.map((show) => {
      return (
        <Show
          name={show.primaryTitle}
          year={show.startYear}
          genre={show.genres}
          id={show.tconst}
          key={show._id}
        />
      );
    });
  }

  render() {
    return (
      <Container>
        <Row className="justify-content-sm-center">
          <Col sm={6} className="mt-5">
            <h1>Search here for shows!</h1>
            {this.state.error !== "" && (
              <Alert variant="warning">{this.state.error}</Alert>
            )}
            <Form onSubmit={this.onSubmit}>
              <FormControl
                type="text"
                name="keyword"
                placeholder="Search"
                className="mr-sm-2"
                value={this.state.keyword}
                onChange={this.onChange}
              />
              <Button className="mt-2" type="submit" variant="outline-info">
                Search
              </Button>
            </Form>
          </Col>
        </Row>
        <Row className="justify-content-sm-center mb-5">
          <Col>
            {this.state.loading ? (
              <>
                <Spinner animation="grow" variant="primary" />
                <Spinner animation="grow" variant="secondary" />
                <Spinner animation="grow" variant="success" />
                <Spinner animation="grow" variant="danger" />
                <Spinner animation="grow" variant="warning" />
                <Spinner animation="grow" variant="info" />
                <Spinner animation="grow" variant="light" />
                <Spinner animation="grow" variant="dark" />
              </>
            ) : (
              <Container>
                <Row className="justify-content-sm-center">
                  {this.showlist()}
                </Row>
              </Container>
            )}
          </Col>
        </Row>
      </Container>
    );
  }
}
