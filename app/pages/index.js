import React, { Component } from 'react';
import styled from 'styled-components';
import Header from '../components/Header/Header.js';
import Head from 'next/head';
import Datasheet from '../components/Datasheet/Datasheet';
import Plot from '../components/Plot/Plot';
import Login from '../components/Login/Login';
import Auth from '../utils/auth';

const AppWrapper = styled.div`
  text-align: center;
  padding: 20px;
`;

const Body = styled.div`
  padding-top: 20px;
  padding-bottom: 20px;
  text-align: center;
  font-size: 22px;
  border-color: rgb(211, 211, 211);
  border-style: solid;
  border-width: 1px;
  border-top-width: 0;
`;



class App extends Component {
  state = {
    ready: false,
    tabs: [
      {
        id: 0,
        title: 'Datasheet'
      },
      {
        id: 1,
        title: 'Plot'
      }],
    selectedTab: null
  };

  
  componentDidMount() {
    debugger;
    this.auth = new Auth();
    this.setState({
      ready: true
    });
  }

  onSelect = (selected) => {
    if (this.state.tabs.some(t => t.id === selected) && this.auth.isAuthenticated()) {
      this.setState({ selectedTab: selected });
    }
  };

  render() {
    if (!this.state.ready) {
      return null;
    }
    return (
      <div>
        {/* <Head>
          <script src="https://cdn.auth0.com/js/auth0/9.5.1/auth0.min.js"></script>
        </Head> */}
        <AppWrapper>
          <Header
            tabs={this.state.tabs}
            selected={this.state.selectedTab}
            onSelect={this.onSelect}
          />
          <Body>
            {(this.state.selectedTab === 0) && <Datasheet auth={this.auth} />}
            {(this.state.selectedTab === 1) && <Plot auth={this.auth} />}
            {(this.state.selectedTab === null) && <Login auth={this.auth} />}
          </Body>
        </AppWrapper>
      </div>
    );
  }
}

export default App;
