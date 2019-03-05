import React from 'react';
import { connect } from 'react-redux';
import { FETCH } from './FetchData.actions';


class FetchDataContainer extends React.Component {
  componentDidMount() {
    this.request();
  }

  request = () => {
    return this.props.getTable();
  }

  render() {
    return null;
  }
}

const mapDispatchToProps = {
  getTable: FETCH.action
};

export default connect(null, mapDispatchToProps)(
  FetchDataContainer
);

