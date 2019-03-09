import React from 'react';
import { connect } from 'react-redux';
import dynamic from 'next/dynamic';
const Plot = dynamic(
  import('react-plotly.js'),
  { ssr: false }
)
import styled from 'styled-components';
import FetchData from '../FetchData/FetchDataContainer';
import { initialLayout, trace } from '../../settings/mainplot';


class PlotContainer extends React.Component {
  state = {
    currentDate: null,
    currentSlice: {
      'x': [1, 2, 3, 4],
      'y': [5, 3, 5, 6],
      'z': [2, 2, 3, 3],
      'intensity': [2, 2, 3, 3]
    }
  };
  get data() {
    const dataTrace = Object.assign({}, trace, this.state.currentSlice);
    return [
      dataTrace
    ];
  }

  get layout() {
    return initialLayout;
  }

  onClick = () => {
    this.setState({
      currentSlice: {
        ...this.state.currentSlice,
        z: [3, 4, 5, 7],
        intensity: [7, 8, 9, 7]
      }
    });
  };

  render() {
    return (
      <div>
        <FetchData />
        <Plot
          data={this.data}
          layout={this.layout}
        />
        <button onClick={this.onClick}>Change data</button>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    data: state.table.data,
    normalizedData: state.table.normalizedData
  };
}

export default connect(mapStateToProps)(PlotContainer);
