import React, {Component} from 'react';
import {Image, Card, Icon} from 'semantic-ui-react';


class Post extends Component {

  getTime(epochTime) {
    let d = new Date(0);
    let n = d.getTimezoneOffset();
    d.setUTCSeconds(epochTime);
    d += n;
    let words = d.split(" ");
    return words[0] + " " + words[1] + " " + words[2] + " " + words[3] + " " + words[4];
  }

  render() {
    return (
      <Card color='yellow'>
        <Card.Content>
          <Image floated='right' size='mini' src={require('../img0.png')} />
          <Card.Header>
            <Icon name='user outline'/>
            {this.props.post[3]}
          </Card.Header>
          <Card.Meta>
            <Icon name='address card'/>
            {this.props.post[2].substr(0, 7) + "..."}
            &nbsp;&nbsp;
            <Icon name='envelope'/>
            {this.props.post[4]}
          </Card.Meta>
          <Card.Description>
            <strong>{this.props.post[0]}</strong>
          </Card.Description>
        </Card.Content>
        <Card.Content extra>
          {this.getTime(this.props.post[1])}
        </Card.Content>
      </Card>
    );
  }
}

export default Post;
