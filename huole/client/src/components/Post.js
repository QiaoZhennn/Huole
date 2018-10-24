import React, {Component} from 'react';
import {Item, Icon} from 'semantic-ui-react';
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
    var data = new Identicon(this.props.post[2], 420).toString();
    return 'data:image/png;base64,' + data;
  };

  render() {
    return (
      <Item>
        <Item.Image floated='right' size='small'
                    src={this.generateIcon()}/>
        <Item.Content>
          <Item.Header>
            <Icon name='user outline'/>
            {this.props.post[3]}
          </Item.Header>
          <Item.Meta>
            <Icon name='address card'/>
            {this.props.post[2].substr(0, 7) + "..."}
            &nbsp;&nbsp;
            <Icon name='envelope'/>
            {this.props.post[4]}
          </Item.Meta>
          <Item.Description>
            <strong>{this.props.post[0]}</strong>
          </Item.Description>
          <Item.Extra>
            {this.getTime(this.props.post[1])}
          </Item.Extra>
        </Item.Content>
      </Item>
    );
  }
}

export default Post;
