import React, { Component } from "react";
import { withRouter } from "../utils/withRouter";
import { connect } from "react-redux";
import { Field, Formik } from "formik";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import APIHelper from "../apis/APIHelper";
import { Navigate, Route } from 'react-router-dom';

/**
 * Function to retreive data from redux
 * @param {*} state 
 * @returns 
 */
 const mapStateToProps = (state) => ({ request: state.dispatcherReducer, user: state.userReducer });

class MedicalHistory extends Component {
  constructor(props) {
    super(props);

    this.state = { vitals: {}, medicalHistory: [] };
  }

  render() {
    if (this.props.user.state == null || this.props.user.state == undefined) {
      return <Navigate to={'/login'} />;
    }
    return (
      <Formik
        initialValues={{
          vitals: this.state.vitals,
          medicalHistory: this.state.medicalHistory,
        }}
        /**
         * Function to update the Vitals of the caller when Submit button has been clicked
         */
        onSubmit={(values) => {
          console.log(values);
          APIHelper.updateCallerVitals(
            this.props.request.state.caller.callerId,
            values, this.props.user.state.accessToken
          )
            .then((data) => {
              return data;
            })
            .then((data) => {
              console.log(data);
              const payload = {
                receiver: { physician: "6269b94e42ac696bdef8ca5d" },
              };
              /**
               * API call to update the status of the request to Awaiting Physician's Review
               */
              APIHelper.updateRequest(this.props.request.state._id, payload, this.props.user.state.accessToken)
                .then((response) => {
                  return response.data;
                })
                .then((data) => {
                  console.log(data);
                  const payload = {
                    status: "Awaiting Physician's Review",
                  };
                  APIHelper.updateRequest(data._id, payload, this.props.user.state.accessToken).then((response) => {
                    console.log(response.data);
                    return response.data;
                  }).then((data) => {
                    console.log(data);
                    const meetingURL = "https://meet.jit.si/SampleRoom";
                    // send the meeting link to physician via email.
                    const physicianId ="6269b94e42ac696bdef8ca5d";// data.caller.receiver.physician;
                    APIHelper.sendMeetingLink(physicianId, meetingURL).then((data) => this.props.navigate("/meeting"));

                    
                  });
                });
            });
        }}
      >
        {({ values, handleChange, handleSubmit }) => {
          return (
            <div className="medicalHistoryContainer">
              <div className="medical-History-Form">
                <h2>WELCOME PARAMEDIC</h2>
                <form onSubmit={handleSubmit}>
                  <div className="form-section">
                    <div className="section-label">
                      <b>
                        <i>Personal Information:</i>
                      </b>
                    </div>
                    <div className="section-control">
                      <div className='form-control'>
                        Name:
                        <input
                          type="text"
                          name="name"
                          placeholder="Enter Patients name"
                          value={this.props.request.state?.caller.callerName}
                          onChange={handleChange}
                        /></div>
                      <div className='form-control'>
                        Blood Group:
                        <Field as="select" className="drop-dwn" name="bloodGroup" placeholder="Select BloodGroup" onChange={handleChange}>
                          <option value=""></option>
                          <option value="O+ve">O+ve</option>
                          <option value="O-ve">O-ve</option>
                          <option value="A+ve">A+ve</option>
                          <option value="A-ve">A-ve</option>
                          <option value="B+ve">B+ve</option>
                          <option value="B-ve">B-ve</option>
                          <option value="AB+ve">AB+ve</option>
                          <option value="AB-ve">AB-ve</option>
                        </Field>
                      </div>
                      <div className='form-control'>
                        Height:
                        <input
                          type="text"
                          name="height"
                          placeholder="Enter Height"
                          value={values?.height}
                          onChange={handleChange}
                        />
                        cms</div>
                      <div className='form-control'>
                        Weight:
                        <input
                          type="text"
                          name="weight"
                          placeholder="Enter Weight"
                          value={values?.weight}
                          onChange={handleChange}
                        />
                        kgs <br></br>
                      </div>
                    </div>
                  </div>
                  <div className="form-section">
                    <div className="section-label">
                      <b><i>Vitals Check: </i></b></div><br></br>
                    <div className="section-control">
                      <div className='form-control'>
                        Oxygen Level:
                        <input
                          type="text"
                          name="vitals.oxygenLevel"
                          placeholder="Enter Oxygen Level"
                          value={values?.oxygenLevel}
                          onChange={handleChange}
                        /></div>
                      <div className='form-control'>
                        % Temperature:
                        <input
                          type="text"
                          name="vitals.temperature"
                          placeholder="Enter body temperature"
                          value={values?.temperature}
                          onChange={handleChange}
                        />
                        °F </div>
                      <div className='form-control'>
                        Heart Rate:
                        <input
                          type="text"
                          name="vitals.heartRate"
                          placeholder="Enter Heart Rate"
                          value={values?.heartRate}
                          onChange={handleChange}
                        />
                        bpm <br></br></div>
                      <div className='form-control'>
                        Systolic:
                        <input
                          type="text"
                          name="vitals.systolic"
                          placeholder="Enter Systolic"
                          value={values?.systolic}
                          onChange={handleChange}
                        />
                        mmHg </div>
                      <div className='form-control'>
                        Diastolic:
                        <input
                          type="text"
                          name="vitals.diastolic"
                          placeholder="Enter Diastolic"
                          value={values?.diastolic}
                          onChange={handleChange}
                        />
                        mmHg
                      </div>
                    </div>
                  </div>
                  <div className="form-section">
                    <div className="section-label">
                      <b>
                        <i>
                          Medical History: <br></br>
                        </i>
                      </b>
                    </div>
                    <b>
                      Please check all the ailments that are applicable:
                      <br></br>
                    </b>
                    <div role="group" aria-labelledby="checkbox-group">
                      <div className='form-control'>
                        <label>
                          <Field
                            type="checkbox"
                            name="medicalHistory"
                            value="Diabetes"
                          />
                          Diabetes
                        </label>
                        <label>
                          <Field
                            type="checkbox"
                            name="medicalHistory"
                            value="HIV Infection"
                          />
                          HIV Infection
                        </label>
                        <label>
                          <Field
                            type="checkbox"
                            name="medicalHistory"
                            value="Chronic Kidney Disease"
                          />
                          Chronic Kidney Disease
                        </label>
                        <label>
                          <Field
                            type="checkbox"
                            name="medicalHistory"
                            value="Cancer"
                          />
                          Cancer
                        </label>
                        <label>
                          <Field
                            type="checkbox"
                            name="medicalHistory"
                            value="Smoking current or former"
                          />
                          Smoking current or former
                        </label>
                        <label>
                          <Field
                            type="checkbox"
                            name="medicalHistory"
                            value="Pregnancy"
                          />
                          Pregnancy
                        </label>
                        <label>
                          <Field
                            type="checkbox"
                            name="medicalHistory"
                            value="Dementia"
                          />
                          Dementia
                        </label>
                        <label>
                          <Field
                            type="checkbox"
                            name="medicalHistory"
                            value="Tuberculosis"
                          />
                          Tuberculosis
                        </label>
                        <label>
                          <Field
                            type="checkbox"
                            name="medicalHistory"
                            value="Heart Conditions"
                          />
                          Heart Conditions
                        </label>
                      </div></div>
                      {/* <div className="section-label">
                        Physicians : 
                      <Field as="select" className="drop-dwn" name="physicianName" placeholder="Select BloodGroup" onChange={handleChange}>
                          <option value=""></option>
                          <option value="O+ve">O+ve</option>
                          <option value="O-ve">O-ve</option>
                          <option value="A+ve">A+ve</option>
                          <option value="A-ve">A-ve</option>
                          <option value="B+ve">B+ve</option>
                          <option value="B-ve">B-ve</option>
                          <option value="AB+ve">AB+ve</option>
                          <option value="AB-ve">AB-ve</option>
                        </Field>
                      </div> */}
                  </div>
                  <button type="submit">Submit</button>
                </form>
              </div>
            </div>
          );
        }}
      </Formik>
    );
  }
}

export default connect(mapStateToProps)(withRouter(MedicalHistory));
