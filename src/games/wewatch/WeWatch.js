import GameComponent from "../../GameComponent.js";
import React from "react";
import YouTube from "react-youtube";
import SocialUI from "./SocialUI.js";
import "./wewatch.css";

export default class WeWatch extends GameComponent {
  constructor(props) {
    super(props);
    let users = this.getSessionUserIds();
    let userCount = users.length;
    this.state = {
      eventLog: ["Welcome! There are " + userCount + " users in the room"],
      firebaseData: {
        playing: false,
        timestamp: 0,
        user_id: this.getMyUserId(),
      },
    };
  }

  onVideoReady(e) {
    console.log("Video ready", e);
    this.setState({ videoPlayer: e.target });
    if (this.state.firebaseData.playing) {
      console.log("Auto playing video");
      e.target.seekTo(this.state.firebaseData.timestamp, true);
      e.target.playVideo();
    }
  }

  onVideoPlay(e) {
    if (!this.state.firebaseData.playing) {
      console.log("Pressed play", e);
      this.getSessionDatabaseRef().set({
        playing: true,
        timestamp: e.target.getCurrentTime(),
        user_id: this.getMyUserId(),
      });
    }
  }

  onVideoPause(e) {
    if (this.state.firebaseData.playing) {
      console.log("Pressed pause", e);
      this.getSessionDatabaseRef().set({
        playing: false,
        timestamp: e.target.getCurrentTime(),
        user_id: this.getMyUserId(),
      });
    }
  }

  onSessionDataChanged(data) {
    this.setState({ firebaseData: data });

    if (data.user_id === this.getMyUserId()) {
      console.log("Ignoring Firebase change: you made the change");
      return;
    }

    if (!this.state.videoPlayer) {
      console.log("Ignoring Firebase change: video player not ready yet");
      return;
    }

    if (data.playing === true) {
      // video should play (someone else pressed play)
      console.log("Firebase change: video now playing");
      this.state.videoPlayer.seekTo(data.timestamp, true);
      this.state.videoPlayer.playVideo();
    } else {
      // video should pause (someone else pressed pause)
      console.log("Firebase change: video now paused");
      this.state.videoPlayer.pauseVideo();
    }
  }

  render() {
    let opts = {
      width: "100%",
      height: "100%",
      playerVars: {
        controls: 0,
        modestbranding: 1
      }
    };
    return (
      <div className="wewatch">
        <SocialUI eventLog={this.state.eventLog} />
        <YouTube
          containerClassName="player"
          videoId="fH3X2U9t2P0"
          opts={opts}
          onPlay={e => this.onVideoPlay(e)}
          onPause={e => this.onVideoPause(e)}
          onReady={e => this.onVideoReady(e)}
        />
      </div>
    );
  }
}
