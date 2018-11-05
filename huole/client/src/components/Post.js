import React, {Component} from 'react';
import {Feed, Icon} from 'semantic-ui-react';
import Identicon from 'identicon.js';


class Post extends Component {
  getTime(epochTime) {
    let d = new Date(0);
    let n = d.getTimezoneOffset();
    d.setUTCSeconds(epochTime);
    d += n;
    let words = d.split(" ");
    return words[0] + " " + words[1] + " " + words[2] + " " + words[3] + " " + words[4];
  }

  generateIcon = () => {
    var data = new Identicon(this.props.post.userAddress, 420).toString();
    return 'data:image/png;base64,' + data;
  };

  render() {
    return (
      <Feed.Event>
        <Feed.Label>
          <img src={this.generateIcon()}/>
        </Feed.Label>
        <Feed.Content>
          <Feed.Summary>
            <Feed.User>
              {this.props.post.nickname}
            </Feed.User>
            <Icon name='address card'/>
            {this.props.post.userAddress.substr(0, 7) + "..."}
            <Icon name='envelope'/>
            {this.props.post.contact}
            <Feed.Date>{this.getTime(this.props.post.postTime)}</Feed.Date>
          </Feed.Summary>
          <Feed.Extra text>
            {this.props.post.content}
          </Feed.Extra>
          <Feed.Extra text>
            <Icon name='dollar sign'/>{this.props.post.tip/10**18} ether
          </Feed.Extra>
          <Feed.Meta>
            <Feed.Like onClick={()=>{

            }}>
              <Icon name='like' />
              5 Likes
            </Feed.Like>
          </Feed.Meta>
        </Feed.Content>
      </Feed.Event>
    );
  }
}

export default Post;
