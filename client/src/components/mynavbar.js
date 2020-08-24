import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import { Navbar, Nav } from "react-bootstrap";

class MyNavbar extends Component {
  logout() {
    localStorage.removeItem("usertoken");
    localStorage.removeItem("username");
    window.location = "/";
  }

  render() {
    return (
      <Navbar
        expand="md"
        className="bg-dark navbar-dark justify-content-between"
      >
        <Navbar.Brand as={NavLink} to="/">
          <b>Show Reviews</b>
        </Navbar.Brand>
        <div>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              {localStorage.usertoken && (
                <Nav.Link as={NavLink} to="/showslist">
                  Search
                </Nav.Link>
              )}
              <Nav.Link as={NavLink} to="/register">
                Register
              </Nav.Link>
              <Nav.Link exact as={NavLink} to="/">
                Login
              </Nav.Link>
              {localStorage.usertoken && (
                <Nav.Link onClick={this.logout}>Logout</Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </div>
      </Navbar>
    );
  }
}

export default MyNavbar;
