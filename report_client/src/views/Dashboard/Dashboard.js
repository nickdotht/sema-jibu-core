import React from "react";
import PropTypes from "prop-types";
import {
    ContentCopy,
    Store,
    InfoOutline,
    Warning,
    DateRange,
    LocalOffer,
    Update,
    ArrowUpward,
    AccessTime,
    Accessibility
} from "material-ui-icons";
import { withStyles, Grid } from "material-ui";


import dashboardStyle from "../../variables/styles/dashboardStyle";

class Dashboard extends React.Component {
  state = {
    value: 0
  };
  handleChange = (event, value) => {
    this.setState({ value });
  };

  handleChangeIndex = index => {
    this.setState({ value: index });
  };
  render() {
    return (
      <div>Dashboard </div>
    );
  }
}

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(dashboardStyle)(Dashboard);

