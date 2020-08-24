import React, { Component } from "react";
import axios from "axios";
import {
  Form,
  Button,
  Card,
  Alert,
  Container,
  Row,
  Col,
} from "react-bootstrap";
require("dotenv").config();

const OneShow = (props) => {
  return (
    <Col className="my-4" lg={4} md={6} sm={12}>
      <Card
        style={{
          width: "18rem",
          color: "#222222",
          margin: "auto",
          backgroundColor: "#ebf5ff",
        }}
      >
        {props.url && props.url !== "N/A" ? (
          <Card.Img variant="top" src={props.url} style={{ height: "300px" }} />
        ) : (
          <Card.Img
            variant="top"
            src="https://thefittingsource.com/wp-content/uploads/2017/12/temp-inventory-landing.jpg"
          />
        )}
        <Card.Body>
          <Card.Title>{props.name}</Card.Title>
          <Card.Text>Start Year: {props.year}</Card.Text>
          <Card.Text>Genre: {props.genre}</Card.Text>
          <Card.Text>Imdb Ratings: {props.rating}</Card.Text>
        </Card.Body>
      </Card>
    </Col>
  );
};

const Review = (props) => {
  return (
    <Col lg={4} md={4} sm={6} className="my-2">
      <Card style={{ color: "#222222", backgroundColor: "#ebf5ff" }}>
        <Card.Header>{props.stars} out of 5 stars</Card.Header>
        <Card.Body>
          <blockquote className="blockquote mb-0">
            <p>{props.review}</p>
            <footer className="blockquote-footer">
              <cite title="Source Title">{props.username}</cite>
            </footer>
          </blockquote>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default class Show extends Component {
  state = {
    username: "",
    show: "",
    success: false,
    stars: "1",
    review: "",
    allreviews: [],
    img: "",
    rating: "",
    msg: "",
    reviewadded: "warning",
  };

  onChange = this.onChange.bind(this);
  onSubmit = this.onSubmit.bind(this);
  displayShow = this.displayShow.bind(this);
  displayReview = this.displayReview.bind(this);

  componentDidMount() {
    let userToken = localStorage.usertoken;
    let username = localStorage.username;
    if (!userToken) {
      this.props.history.push(`/`);
    } else {
      this.setState({ username: username });

      axios
        .get(
          `https://www.omdbapi.com/?apikey=${process.env.REACT_APP_API_KEY}&i=${this.props.match.params.id}`
        )
        .then((res) => {
          this.setState({
            img: res.data.Poster,
            rating: res.data.imdbRating,
          });
        })
        .catch((e) => {
          if (e.response) {
            console.log(e.response);
          } else if (e.request) {
            console.log(e.request);
          } else {
            console.log(e.message);
          }
          console.log(e);
        });

      axios
        .get(
          "http://localhost:5000/api/shows/show/" + this.props.match.params.id,
          {
            headers: {
              "x-auth-token": localStorage.getItem("usertoken"),
            },
          }
        )
        .then((res) => {
          this.setState({
            show: res.data,
            success: true,
          });
        })
        .catch((e) => {
          if (e.response) {
            this.setState({
              msg: e.response.data.msg,
            });
          } else if (e.request) {
            console.log(e.request);
          } else {
            console.log(e.message);
          }
          console.log(e);
        });

      axios
        .get(
          "http://localhost:5000/api/shows/showReviews/" +
            this.props.match.params.id,
          {
            headers: {
              "x-auth-token": localStorage.getItem("usertoken"),
            },
          }
        )
        .then((res) => {
          this.setState({
            allreviews: res.data,
          });
        })
        .catch((e) => {
          if (e.response) {
            console.log(e.response);
          } else if (e.request) {
            console.log(e.request);
          } else {
            console.log(e.message);
          }
          console.log(e);
        });
    }
  }

  displayShow() {
    const show = this.state.show;
    return (
      <OneShow
        name={show.primaryTitle}
        genre={show.genres}
        year={show.startYear}
        url={this.state.img}
        rating={this.state.rating}
      />
    );
  }

  displayReview() {
    return this.state.allreviews.map((review) => (
      <Review
        username={review.username}
        stars={review.stars}
        review={review.review}
        key={review._id}
      />
    ));
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  onSubmit(e) {
    e.preventDefault();

    axios
      .post(
        "http://localhost:5000/api/shows/addReview",
        {
          review: this.state.review,
          stars: this.state.stars,
          username: this.state.username,
          tconst: this.props.match.params.id,
        },
        {
          headers: {
            "x-auth-token": localStorage.getItem("usertoken"),
          },
        }
      )
      .then((res) => {
        this.setState({
          msg: res.data.msg,
          reviewadded: "success",
        });
        axios
          .get(
            "http://localhost:5000/api/shows/showReviews/" +
              this.props.match.params.id,
            {
              headers: {
                "x-auth-token": localStorage.getItem("usertoken"),
              },
            }
          )
          .then((res) => {
            this.setState({
              allreviews: res.data,
            });
          })
          .catch((e) => {
            if (e.response) {
              console.log(e.response);
            } else if (e.request) {
              console.log(e.request);
            } else {
              console.log(e.message);
            }
            console.log(e);
          });
      })
      .catch((e) => {
        if (e.response) {
          this.setState({
            msg: e.response.data.error,
            reviewadded: "warning",
          });
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
      <>
        {this.state.msg === "No such show found" ? (
          <Alert variant={this.state.reviewadded}>{this.state.msg}</Alert>
        ) : (
          <Container>
            {this.state.msg !== "" && (
              <Alert variant={this.state.reviewadded}>{this.state.msg}</Alert>
            )}
            <Row className="justify-content-sm-center">
              {this.state.success && this.displayShow()}
              <Col lg={8} md={6} sm={12} className="my-4">
                <Form onSubmit={this.onSubmit}>
                  <Form.Group controlId="exampleForm.ControlTextarea1">
                    <Form.Label>Add a review</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows="6"
                      name="review"
                      required
                      placeholder="Write your review"
                      onChange={this.onChange}
                      value={this.state.review}
                    />
                  </Form.Group>
                  <Form.Group controlId="exampleForm.ControlSelect1">
                    <Form.Label>Stars</Form.Label>
                    <Form.Control
                      as="select"
                      name="stars"
                      onChange={this.onChange}
                      value={this.state.stars}
                    >
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                    </Form.Control>
                  </Form.Group>

                  <Button variant="info" type="submit">
                    Submit
                  </Button>
                </Form>
              </Col>
            </Row>
            {this.state.allreviews.length > 0 && <h4>Reviews</h4>}
            <Row>
              {this.state.allreviews.length > 0 && <>{this.displayReview()}</>}
            </Row>
          </Container>
        )}
      </>
    );
  }
}
