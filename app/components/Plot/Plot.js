import React from 'react';
import dynamic from 'next/dynamic';
const Plot = dynamic(
  import('react-plotly.js'),
  { ssr: false }
)
import Grid from '@material-ui/core/Grid';
import Regimes from '../Regimes/Regimes';
import { initialLayout, trace } from '../../settings/mainplot';


class PlotContainer extends React.Component {
  state = {
    currentDate: null,
    currentSlice: {
      'x': [],
      'y': [],
      'z': [],
      'intensity': []
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

  onUpdate = (data) => {
    this.setState({
      currentSlice: {
        x: data[0],
        y: data[1],
        z: data[2],
        intensity: data[3],
      }
    });
  };

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
        <Grid
          container
          direction="column"
          justify="center"
          alignItems="stretch"
          spacing={8}
        >
          <Grid
            container
            direction="column"
            alignItems="center"
          >
            <Regimes onUpdate={this.onUpdate}/>
          </Grid>
          <Grid item>
            <Plot
              data={this.data}
              layout={this.layout}
            />
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default PlotContainer;
