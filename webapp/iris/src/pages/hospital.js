import React, { Component } from "react";
import DataTable from "../components/datatable";
import APIHelper from "./../apis/APIHelper.js";
import { withRouter } from "../utils/withRouter";
import { connect } from "react-redux";
import { Navigate, Route } from 'react-router-dom';

const mapStateToProps = (state) => ({ user: state.userReducer });

class HospitalHome extends Component {
  constructor(props) {
    super(props);

    this.state = { hospitalRequests: [], selectedRow: {} };
  }

  /**
   * Function to fetch all the Hospital requests
   */
  componentDidMount() {
    this.fetchHospitalRequests();
  }

  async fetchHospitalRequests() {
    APIHelper.fetchRequestsByReceiver(
      this.props.user.state._id,
      this.props.user.state.role.toLowerCase(),
      this.props.user.state.accessToken
    ).then((data) => this.setState({ hospitalRequests: data }));
  }

  /**
   * Function to get data about selected row
   * @param {*} ids 
   */
  getSelectedRow(ids) {
    const selectedRow = this.state.hospitalRequests.find((row) =>
      ids.includes(row._id.toString())
    );
    this.setState({ selectedRow });
  }

  /**
   * Function to update the status of the request to resolved when clicked on Admit Patient
   * @param {*} e 
   */
  async handleClick(e) {
    e.preventDefault();
    const payload = {
      status: "Resolved",
    };

    const updatedRequest = await APIHelper.updateRequest(
      this.state.selectedRow._id,
      payload, this.props.user.state.accessToken
    );
    this.setState({
      hospitalRequests: this.state.hospitalRequests.map((request) =>
        request._id === this.state.selectedRow._id
          ? updatedRequest.data
          : request
      ),
    });
  }

  /**
   * Render fields
   * @returns 
   */
  render() {
    if (this.props.user.state == null || this.props.user.state == undefined) {
      return <Navigate to={'/login'} />;
    }
    return (
      <div className="hospital-history">
        <div className="historyTable">
          <DataTable
            data={this.state.hospitalRequests}
            getSelectedRow={this.getSelectedRow.bind(this)}
          />
        </div>
        <div className="history-action">
          <button type="button" onClick={(e) => this.handleClick(e)}>Admit Patient</button>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps) (withRouter(HospitalHome));
