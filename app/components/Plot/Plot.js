import React from 'react';
import { connect } from 'react-redux';
import dynamic from 'next/dynamic';
const Plot = dynamic(
  import('react-plotly.js'),
  { ssr: false }
)
import styled from 'styled-components';
import FetchData from '../FetchData/FetchDataContainer';


class PlotContainer extends React.Component {
  get data() {
    return [
      {
        x: [1, 2, 3],
        y: [2, 6, 3],
        type: 'scatter',
        mode: 'lines+points',
        marker: { color: 'red' },
      },
      { type: 'bar', x: [1, 2, 3], y: [2, 5, 3] },
    ];
  }

  get layout() {
    return {
      width: 320,
      height: 240,
      title: 'A Fancy Plot'
    };
  }

  render() {
    return (
      <div>
        <FetchData />
          <Plot
            data={this.data}
            layout={this.layout}
          />
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
