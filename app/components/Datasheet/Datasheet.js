import React from 'react';
import axios from 'axios';
import getConfig from 'next/config';


class Datasheet extends React.Component {
  state = {
    message: 'None received'
  }

  componentDidMount() {
    this.request();
  }

  request = () => {
    const { publicRuntimeConfig } = getConfig();
    const { getAccessToken } = this.props.auth;
    const API_URL = publicRuntimeConfig.API_URL;
    const headers = { 'Authorization': `Bearer ${getAccessToken()}`}
    axios.get(`${API_URL}/private`, { headers })
      .then((response) => 
        {
          this.setState({ message: response.data })
        })
      .catch((error) => {
        this.setState({ message: error.message })
    });
  }

  render() {
    return (
      <div>
        Here be Datasheet.
        <br />
        Message: {this.state.message}
      </div>
    );
  }
}

export default Datasheet;
