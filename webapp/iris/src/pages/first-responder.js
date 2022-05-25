import React, { Component } from "react";
import DataTable from "../components/datatable";
import Form from "../components/form";
import MapContainer from "../components/map";
import { withRouter } from "../utils/withRouter";
import { connect } from "react-redux";
import APIHelper from "./../apis/APIHelper.js";
import { recordMedicalHistory as recordMedicalHistoryAction } from "../redux/actions/dispatcher-actions";
import {Constants, MapLaunchOption} from './../utils/constants.js'
import { Navigate, Route } from 'react-router-dom';

/**
 * Function to dispatch the current variables from the page to redux
 * @param {*} dispatch 
 * @returns 
 */
const mapDispatchToProps = (dispatch) => {
  return {
    recordMedicalHistory: (request) => dispatch(recordMedicalHistoryAction(request))
  };
}

const mapStateToProps = (state) => ({ request: state.dispatcherReducer, user: state.userReducer });

class FirstResponderHome extends Component {
  constructor(props) {
    super(props);

    this.state = {
      frRequests: [],
      users: [],
      selectedRow: {},
      requestAction: "Acknowledge",
      hospitalLocation: "",
      callerLocation: "",
      disableButton: false
    };
    this.getAllUsers();
  }

  /**
   * Code to get all Hospitals from the API
   */
  getAllUsers() {
    APIHelper.fetchHospitals(this.props.user?.state?.accessToken).then((data) => this.setState({ users: data }));
  }

  /**
   * Code to get Hospitals from a particular zipCode
   * @param {*} zip 
   * @returns 
   */
  getHospitalReceiver(zip) {
    if (zip != null && zip != undefined) {
      return this.state.users?.find((user) => {
          if (
            parseInt(zip) >= parseInt(user.zipCodeMin) &&
            parseInt(zip) <= parseInt(user.zipCodeMax)
          ) {
            return user;
          }
        })
    } else {
      return;
    }
  }

  /**
   * Code to fetch requests by a receiver's id
   */
  async componentDidMount() {
    await this.fetchRequestsByReceiver();
  }

  async fetchRequestsByReceiver() {
    APIHelper.fetchRequestsByReceiver(this.props.user.state._id, this.props.user.state.role.toLowerCase(), this.props.user?.state?.accessToken).then((data) =>
      this.setState({ frRequests: data })
    );
  }

  /**
   * Code to get data from selected row
   * @param {*} ids 
   */
  getSelectedRow(ids) {
    const selectedRow = this.state.frRequests.find((row) =>
      ids.includes(row._id.toString())
    );
    this.setState({ selectedRow });
    console.log(this.props.user.state.role);
    if (selectedRow.status === 'Scene Assessment in progress' && this.props.user.state.role === 'Fire') {
      console.log('here')
      this.setState({ disableButton: true });
    }
    if (selectedRow.status === "Scene Assessment in progress") {
      this.setState({ requestAction: "Transfer To Hospital" });
    } else {
      this.setState({ requestAction: "Acknowledge" });
    }
    this.locationHandler(selectedRow.caller.callerAddress);
    // console.log(selectedRow);
  }

  /**
   * Function to update the status of the request
   */
  async acknowledgeRequest() {
    const payload = {
      status: "Scene Assessment in progress",
    };

    const updatedRequest = await APIHelper.updateRequest(
      this.state.selectedRow._id,
      payload, this.props.user?.state?.accessToken
    );
    this.setState({
      frRequests: this.state.frRequests.map((request) =>
        request._id === this.state.selectedRow._id ? updatedRequest.data : request
      )
    });

    if (this.state.selectedRow.emergencyLevel === 'C') {
      console.log(this.state.selectedRow);
      this.props.recordMedicalHistory(this.state.selectedRow);
      this.props.navigate('/medical-history');
    }
    this.setState({ selectedRow : {} });
  }

  locationHandler(location) {
    this.setState({callerLocation: location});
  };

  showHideButton() {
    switch (this.props.user.state.role) {
      case "Paramedic":
        if (this.state.selectedRow.status === "Transferred to Hospital") {
          return false;
        } else {
          return true;
        }
      case "Police", "Fire":
        if (this.state.selectedRow.status === "Scene Assessment in progress") {
          return false;
        } else {
          return true;
        }
      
    }
    return true
  }

  onClickMarker = (locDetails) => {
    console.log(locDetails);
    if (locDetails.types.includes("hospital")) {
      this.setState({ hospitalLocation: locDetails.formatted_address });
    }
  };

  /**
   * Function to update the status about the caller when they have been transferred to the hospital
   */
  async transferToHospital() {
    const hospitalZIP = this.state.hospitalLocation.split(" ").at(-1);
    const payload = {
      receiver: { "hospital": this.getHospitalReceiver(hospitalZIP)?._id },
    };

    const result = await APIHelper.updateRequest(
      this.state.selectedRow._id,
      payload, this.props.user?.state?.accessToken
    );

    if (result.response.status == 200) {
      const payload = {
        status: 'Transferred to Hospital'
      };
      const updatedRequest = await APIHelper.updateRequest(
        this.state.selectedRow._id,
        payload, this.props.user?.state?.accessToken
      );

      this.setState({
        frRequests: this.state.frRequests.map((request) =>
          request._id === this.state.selectedRow._id ? updatedRequest.data : request
        ),
      });
    }
  }

  render() {
    if (this.props.user.state == null || this.props.user.state == undefined) {
      return <Navigate to={'/login'} />;
    }
    return (
      <div className="firstResponderContainer">
        <div className="historyFRTable">
          <DataTable
            data={this.state.frRequests}
            getSelectedRow={this.getSelectedRow.bind(this)}
          />
        </div>
        <div className="form-map-container">
          <div className="emergencyForm">
            <Form
              data={this.state.selectedRow}
              isFromDispatcher={false}
              requestAction={this.state.requestAction}
              hospitalLocation={this.state.hospitalLocation}
              onNext={
                this.state.requestAction === "Acknowledge"
                  ? this.acknowledgeRequest.bind(this)
                  : this.transferToHospital.bind(this)
              }
              showButton={this.showHideButton()}
            />
          </div>
          <div className="mapContainer">
            <div className="map">
              <MapContainer
                showHospitalLocation={
                  this.state.requestAction === "Acknowledge"
                    ? true
                    : false
                } data={{callerLocation: this.state.callerLocation, mapLaunchOption: MapLaunchOption.FirstResponder}} clickMarkerHandler={this.onClickMarker.bind(this)}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps) (withRouter(FirstResponderHome));
