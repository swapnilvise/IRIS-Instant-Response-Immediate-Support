import { ErrorMessage, Field, Formik, Form } from "formik";
import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "../utils/withRouter";
import APIHelper from "./../apis/APIHelper.js";
import { loginUser as loginUserAction } from "../redux/actions/user-actions";
import { generateErrorToast } from "../utils/toast";
import "antd/lib/message/style/index.css";
import { loginSchema } from "../utils/validationSchema";

/**
 * Function to dispatch the current variables from the page to redux
 * @param {*} dispatch
 * @returns
 */
const mapDispatchToProps = (dispatch) => {
  return {
    loginUser: (user) => dispatch(loginUserAction(user)),
  };
};

const mapStateToProps = (state) => ({ user: state.userReducer });

class Login extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Formik
        initialValues={{
          emailID: "",
          password: "",
        }}
        validationSchema={loginSchema}
        onSubmit={(values) => {
          APIHelper.loginUser(values)
            .then((res) => {
              if (res.response.status !== 200) {
                this.props.loginUser({});
                generateErrorToast(res.data.message);
              } else {
                this.props.loginUser(res.data);
                switch (res.data.role) {
                  case "Dispatcher":
                    this.props.navigate("/dispatcherIncomingCalls");
                    break;
                  case "Paramedic":
                    this.props.navigate("/firstResponder");
                    break;
                  case "Fire":
                    this.props.navigate("/firstResponder");
                    break;
                  case "Police":
                    this.props.navigate("/firstResponder");
                    break;
                  case "Hospital":
                    this.props.navigate("/hospital");
                    break;
                  case "Physician":
                    this.props.navigate("/physician");
                    break;
                  case "Admin":
                    this.props.navigate("/systemAdmin");
                    break;
                }
              }
            })
            .catch((err) => {
              this.props.loginUser({});
            });
        }}
      >
        {({ values, handleChange, handleSubmit, errors, touched }) => {
          return (
            <div>
              <div className="loginContainer">
                <div className="loginFormContainer">
                  <div className="loginTitle">
                    <h1>LOGIN</h1>
                    <img src="../assets/Icon_64px.gif" />
                    <i>Instant Response Immediate Support</i>
                  </div>
                  <Form className="loginForm" onSubmit={handleSubmit}>
                    <Field
                      name="emailID"
                      placeholder="Enter Email-ID for login"
                    />
                    {errors.emailID && touched.emailID ? (
                      <div className="errormsg">{errors.emailID}</div>
                    ) : null}
                    <Field type="password" name="password" placeholder="Enter password" />
                    {errors.password && touched.password ? (
                      <div className="errormsg">{errors.password}</div>
                    ) : null}
                  <button type="submit">Submit</button>
                  </Form>
                </div>
              </div>
            </div>
          );
        }}
      </Formik>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Login));
