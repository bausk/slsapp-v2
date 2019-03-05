import React from 'react';
import styled from 'styled-components';

const Button = styled.button`
padding: 10px 12px;
font-size: 18px;
margin: 12px;
background-color: #7ac142;
border: solid 2px #477126;
color: #1c2d10;
`;

class Login extends React.Component {

  state = {
    result: null
  };

  login = (e) => {
    this.props.auth.login();
  }

  logout = (e) => {
    this.props.auth.logout();
  }

  render() {
    const isAuthenticated = this.props.auth && this.props.auth.isAuthenticated;
    return (
      <div>
        <div>Ternovka-2 Landing Page</div>
        <div>{isAuthenticated() ? 
          <Button onClick={this.logout}>
            Log Out
          </Button> : 
          <Button onClick={this.login}>
            Log In
          </Button>
        }
        </div>
      </div>
    );
  }
}

export default Login;
