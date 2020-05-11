import React from "react";
import "./socialui.css";

export default class SocialUI extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      video_title: "",
      video_url: ""
    };
  }

  handleShowAll() {
    console.log("Show all clicked");
  }

  handleAdd() {
    console.log("Add Video Clicked", this.state);
  }

  handleVideoTitleChange(e) {
    let value = e.target.value;
    this.setState({ video_title: value });
  }

  handleVideoUrlChange(e) {
    let value = e.target.value;
    this.setState({ video_url: value });
  }

  render() {
    return (
      <div className="SocialUI">
        <div className="RedBox">
          <div className="AddVideoForm">
            <input
              placeholder="Title"
              onChange={e => this.handleVideoTitleChange(e)}
              value={this.state.video_title}
            />
            <input
              placeholder="URL"
              onChange={e => this.handleVideoUrlChange(e)}
              value={this.state.video_url}
            />
          </div>
          <div className="EventLog">{this.props.eventLog}</div>
        </div>

        <div className="Buttons">
          <button className="ShowAll" onClick={e => this.handleShowAll()}>
            Show All
          </button>
          <div className="NextVideo">Next video title</div>
          <button className="AddVideo" onClick={e => this.handleAdd()}>
            Add
          </button>
        </div>
      </div>
    );
  }
}
