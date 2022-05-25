import React, { Component } from "react";
import { JitsiMeeting } from "@jitsi/react-sdk";
import { withRouter } from "../utils/withRouter";

class Video extends Component {
  domain = "meet.jit.si";
  api = {};

  constructor(props) {
    super(props);

    this.state = {
      room: "SampleRoom",
      user: {
        userId: "EMT_01",
        name: "Paramedic RT",
        role: "Paramedic",
      },
    };
  }

  /**
   * Below function is used to prep up the jitsi to close the screen once the meeting has been completed
   * Upon ending the meeting the user will be re-directed back to the Paramedics screen
   */
  handleClose() {
    this.props.navigate("/firstResponder");
  }

  render() {
    return (
      <div className="video-screen">
        <JitsiMeeting
          roomName={this.state.room}
          getIFrameRef={(iframe) => {
            iframe.style.height = "610px";
          }}
          configOverwrite={{
            SHOW_PROMOTIONAL_CLOSE_PAGE: false,
            userInfo: {
              displayName: this.state.user.name,
            },
          }}
          onReadyToClose={this.handleClose.bind(this)}
        />
      </div>
    );
  }
}

export default withRouter(Video);
