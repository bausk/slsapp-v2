import React from 'react';
import { connect } from 'react-redux';
import FetchDataContainer from '../FetchData/FetchDataContainer';
import Table from '../Table/Table';


class Datasheet extends React.Component {
  state = {
    message: 'None received'
  }

  render() {
    return (
      <div>
        <FetchDataContainer />
        <h3>Ternovka -- Data Chart</h3>
        <br />
        <Table data={this.props.data} header={this.props.header} />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    data: state.table.normalizedData,
    header: state.table.header
  };
};

export default connect(mapStateToProps)(Datasheet);
