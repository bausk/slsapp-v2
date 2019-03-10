import React from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { DateTimePicker } from "material-ui-pickers";
import { DataTransformations } from '../../lib/calculations';

const styles = theme => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '33.33%',
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
});


class Regimes extends React.Component {
  state = {
    expanded: null,
    initialized: false,
    selectedDate: null,
    selectedStart: null,
    selectedFinish: null,
    zMultiplier: 100
  };

  componentDidUpdate() {
    if (!this.state.initialized && this.props.normalizedData && this.props.normalizedData.length > 0) {
      const dataset = new DataTransformations(this.props.normalizedData)
        .getLatestDate();
      this.onConvertData(dataset);
      debugger;
      this.setState({
        initialized: true,
        selectedDate: dataset.startDate,
        selectedStart: null,
        selectedFinish: null
      });
    }
  }

  get rangeCaption() {
    if (!this.state.selectedStart && !this.state.selectedFinish) {
      return '<Not selected>';
    }
    return `${this.state.selectedStart} ... ${this.state.selectedFinish}`;
  }
  handleChange = panel => (event, expanded) => {
    this.setState({
      expanded: expanded ? panel : false,
    });
  };

  onConvertData = (transform) => {
    debugger;
    const preparedDataset = transform.resultToSurfaces(this.state.zMultiplier);
    return this.props.onUpdate(preparedDataset);
  };

  onChangeDate = (date) => {
    const dataset = new DataTransformations(this.props.normalizedData)
      .getDatasetClosestToDate(date);
    this.onConvertData(dataset);
    debugger;
    this.setState({
      selectedDate: dataset.startDate,
      selectedStart: null,
      selectedFinish: null
    });
  };

  render() {
    const { classes } = this.props;
    const { expanded } = this.state;

    return (
      <div className={classes.root}>
        <ExpansionPanel expanded={expanded === 'panel1'} onChange={this.handleChange('panel1')}>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography className={classes.heading}>Click to Select Time:</Typography>
            <Typography className={classes.secondaryHeading}>
              {this.state.selectedDate && this.state.selectedDate.format() || 'Please wait...'}
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <DateTimePicker
              value={this.state.selectedDate}
              onChange={this.onChangeDate}
              label="Select time and date:"
              showTodayButton
            />
          </ExpansionPanelDetails>
        </ExpansionPanel>
        <ExpansionPanel expanded={expanded === 'panel2'} onChange={this.handleChange('panel2')} disabled>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography className={classes.heading}>Click to Select Range:</Typography>
            <Typography className={classes.secondaryHeading}>
              {this.rangeCaption}
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Typography>
              {this.rangeCaption}
            </Typography>
          </ExpansionPanelDetails>
        </ExpansionPanel>
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

export default connect(mapStateToProps)(withStyles(styles)(Regimes));
