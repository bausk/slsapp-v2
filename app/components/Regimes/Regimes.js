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
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import Fab from '@material-ui/core/Fab';
import PlayIcon from '@material-ui/icons/PlayCircleFilled';
import IconButton from '@material-ui/core/IconButton';
import PauseIcon from '@material-ui/icons/PauseCircleOutline';
import RepeatIcon from '@material-ui/icons/Repeat';
import { DateTimePicker } from "material-ui-pickers";
import { DataTransformations } from '../../lib/calculations';

const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: '1200px'
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '33.33%',
    flexShrink: 0
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary
  },
  controlCell: {
    display: 'flex',
    alignItems: 'center'
  },
  fab: {
    margin: theme.spacing.unit
  },
  extendedIcon: {
    marginRight: theme.spacing.unit
  },
  button: {
    margin: theme.spacing.unit / 2
  },
  number: {
    maxWidth: '80px'
  }
});


class Regimes extends React.Component {
  state = {
    expanded: null,
    initialized: false,
    selectedDate: null,
    selectedStart: null,
    selectedFinish: null,
    zMultiplier: 100,
    isAnimationLooped: false,
    isAnimating: false,
    animationDuration: 3
  };

  animationTimeout = null;
  animationData = null;

  componentDidUpdate() {
    if (!this.state.initialized && this.props.normalizedData && this.props.normalizedData.length > 0) {
      const dataset = new DataTransformations(this.props.normalizedData)
        .getLatestDate();
      this.onConvertData(dataset);
      this.setState({
        initialized: true,
        selectedDate: dataset.startDate,
        selectedStart: dataset.startDate,
        selectedFinish: dataset.startDate
      });
    }
  }

  get isRangePanelOpen() {
    return this.state.expanded === 'panel2';
  }

  get rangeCaption() {
    if (!this.state.selectedStart && !this.state.selectedFinish) {
      return '<Not selected>';
    }
    return this.isRangePanelOpen ? '' : `${this.state.selectedStart} ... ${this.state.selectedFinish}`;
  }

  handleChange = panel => (event, expanded) => {
    const nextExpandedPanel = expanded ? panel : false;
    this.setState({
      expanded: nextExpandedPanel
    });
    if (nextExpandedPanel === 'panel2') {
      this.stopAnimation();
    }
  };

  onDurationChange = (e) => {
    this.setState({
      animationDuration: e.target.value
    });
  };

  onDurationValidate = (e) => {
    const actualDuration = parseFloat(this.state.animationDuration)
    if (!actualDuration || actualDuration <= 0 || actualDuration > 100000) {
      this.setState({
        animationDuration: 3
      });
    }
  }

  toggleRepeat = () => {
    this.setState({
      isAnimationLooped: !this.state.isAnimationLooped
    });
  };

  startAnimation = () => {
    const dataSlice = new DataTransformations(this.props.normalizedData)
      .getDatasetsInRange(this.state.selectedStart, this.state.selectedFinish)
      .resultToSurfaces(this.state.zMultiplier);
    const animationSequence = dataSlice.reduceRight((acc, frame, i) => {
      acc.value = frame;
      if (i === 0) {
        return acc;
      }
      return { next: acc };
    }, { next: null });
    const frameTimeout = (this.state.animationDuration * 1000) / (dataSlice.length - 1);
    const enqueueFrame = (frame) => {
      const data = frame.value;
      const nextFrame = frame.next;
      this.props.onUpdate(data);
      if (nextFrame === null) {
        if (this.state.isAnimationLooped) {
          return this.startAnimation();
        }
        this.setState({
          isAnimating: false
        });
        return;
      }
      this.animationTimeout = setTimeout(() => {
        enqueueFrame(nextFrame);
      }, frameTimeout);
    }
    return enqueueFrame(animationSequence);
  };

  toggleAnimation = (e) => {
    if (this.state.isAnimating) {
      this.setState({
        isAnimating: false
      });
      return this.stopAnimation();
    }
    this.setState({
      isAnimating: true
    });
    this.startAnimation();
  };

  stopAnimation = () => {
    return clearTimeout(this.animationTimeout);
  };

  onConvertData = (transform) => {
    const preparedDataset = transform.resultToSurfaces(this.state.zMultiplier);
    return this.props.onUpdate(preparedDataset);
  };

  onChangeDate = (date) => {
    const dataset = new DataTransformations(this.props.normalizedData)
      .getDatasetClosestToDate(date);
    this.onConvertData(dataset);
    this.setState({
      selectedDate: dataset.startDate,
      selectedStart: null,
      selectedFinish: null
    });
  };

  isDateRangeValid = (start, finish) => {
    if (!this.props.normalizedData || this.props.normalizedData.length < 1) {
      return false;
    }
    const data = new DataTransformations(this.props.normalizedData);
    const startDate = data.getClosestDate(start)[0];
    const endDate = data.getClosestDate(finish)[0];
    if (endDate > startDate) {
      return [startDate, endDate];
    }
    return false;
  };

  onChangeStart = (date) => {
    const dates = this.isDateRangeValid(date, this.state.selectedFinish)
    if (!dates) {
      return null;
    }
    const actualDate = dates[0];
    this.setState({
      selectedDate: actualDate,
      selectedStart: actualDate
    });
    const dataset = new DataTransformations(this.props.normalizedData)
      .getDatasetClosestToDate(actualDate);
    this.onConvertData(dataset);
  };

  onChangeFinish = (date) => {
    const dates = this.isDateRangeValid(date, this.state.selectedFinish)
    if (!dates) {
      return null;
    }
    const actualDate = dates[1];
    this.setState({
      selectedFinish: actualDate
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
        <ExpansionPanel expanded={expanded === 'panel2'} onChange={this.handleChange('panel2')}>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography className={classes.heading}>Click to Select Range:</Typography>
            <Typography className={classes.secondaryHeading}>
              {this.rangeCaption}
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Grid
              container
              direction="row"
              justify="space-evenly"
              alignItems="center"
              spacing={8}
            >
              <Grid item>
                <DateTimePicker
                  value={this.state.selectedStart}
                  onChange={this.onChangeStart}
                  label="Start:"
                  showTodayButton
                />
              </Grid>
              <Grid item>
                <Typography className={classes.secondaryHeading}>
                  {this.state.selectedDate && this.state.selectedDate.format() || ''}
                </Typography>
              </Grid>
              <Grid item>
                <DateTimePicker
                  value={this.state.selectedFinish}
                  onChange={this.onChangeFinish}
                  label="Finish:"
                  showTodayButton
                />
              </Grid>
              <Grid item className={classes.controlCell}>
                <Typography className={classes.secondaryHeading}>
                  Animate:
                </Typography>
                <Fab
                  onClick={this.toggleAnimation}
                  disabled={!this.isDateRangeValid(this.state.selectedStart, this.state.selectedFinish)}
                  variant="extended" color="primary" aria-label="Toggle animation" className={classes.fab}>
                  {this.state.isAnimating ?
                    <PauseIcon className={classes.extendedIcon} /> :
                    <PlayIcon className={classes.extendedIcon} />
                  }
                  {this.state.isAnimating ?
                    'Pause' :
                    'Play'
                  }
                </Fab>
                <IconButton
                  onClick={this.toggleRepeat} 
                  color={this.state.isAnimationLooped ? "primary" : undefined}
                  className={classes.button}
                  aria-label="Repeat animation"
                >
                  <RepeatIcon />
                </IconButton>
                <TextField
                  value={this.state.animationDuration}
                  onChange={this.onDurationChange}
                  onBlur={this.onDurationValidate}
                  className={classes.number}
                  label="Duration"
                  id="play-duration"
                  type="number"
                  InputProps={{
                    endAdornment:<InputAdornment position="end">sec</InputAdornment>
                  }}
                />
              </Grid>
            </Grid>
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
