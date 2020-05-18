import GameComponent from "../../GameComponent.js";
import React from "react";
import YouTube from "react-youtube";
import SocialUI from "./SocialUI.js";
import VoteUI from "./VoteUI.js";
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
        like_count: 0,
        dislike_count: 0,
        playlist: []
      }
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
      this.getSessionDatabaseRef().update({
        playing: true,
        timestamp: e.target.getCurrentTime(),
        user_id: this.getMyUserId()
      });
    }
  }

  onVideoPause(e) {
    if (this.state.firebaseData.playing) {
      console.log("Pressed pause", e);
      this.getSessionDatabaseRef().update({
        playing: false,
        timestamp: e.target.getCurrentTime(),
        user_id: this.getMyUserId()
      });
    }
  }

  onSessionDataChanged(data) {
    let mergedData = Object.assign(this.state.firebaseData, data);
    this.setState({ firebaseData: mergedData });

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

  handleLikePressed() {
    // Update the firebase database count of likes
    let currentLikeCount = this.state.firebaseData.like_count;
    this.getSessionDatabaseRef().update({
      like_count: currentLikeCount + 1,
      user_id: this.getMyUserId()
    });
  }

  handleDislikePressed() {
    // Update the firebase database count of dislikes
    let currentDislikeCount = this.state.firebaseData.dislike_count;
    this.getSessionDatabaseRef().update({
      dislike_count: currentDislikeCount + 1,
      user_id: this.getMyUserId()
    });
  }

  handleVideoAdd(title, url) {
    let new_playlist_item = {
      title: title,
      url: url
    };
    let playlist = this.state.firebaseData.playlist;
    playlist.push(new_playlist_item);
    this.getSessionDatabaseRef().update({
      playlist: playlist
    });
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
        <VoteUI
          like={this.state.firebaseData.like_count}
          dislike={this.state.firebaseData.dislike_count}
          onLikePressed={e => this.handleLikePressed()}
          onDislikePressed={e => this.handleDislikePressed()}
        />
        <SocialUI
          onVideoAdd={(title, url) => this.handleVideoAdd(title, url)}
          eventLog={this.state.eventLog}
        />
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
