import React, {Component} from 'react';
import {Label, Item} from 'semantic-ui-react';


class Post extends Component {

  getTime(epochTime) {
    let d = new Date(0);
    let n = d.getTimezoneOffset();
    d.setUTCSeconds(epochTime);
    d += n;
    return d;
  }

  render() {
    return (
      <Item>
        <Item.Content>
          <Item.Header as='a'>User: {this.props.post[2]}</Item.Header>
          <Item.Meta>
            <Label className='cinema'>Post Time: {this.getTime(this.props.post[1])}</Label>
            <Label className='cinema'>NickName: {this.props.post[3]}</Label>
            <Label className='cinema'>Contact: {this.props.post[4]}</Label>
          </Item.Meta>
          <Item.Content verticalAlign='middle'>Content: {this.props.post[0]}</Item.Content>
        </Item.Content>
      </Item>
    );
  }
}

export default Post;
