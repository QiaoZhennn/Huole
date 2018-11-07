import React, {Component} from 'react';
import {Grid, Icon} from 'semantic-ui-react';

class Comment extends Component {
  render() {
    return (
      <Grid.Row>
        <Grid.Column width={3}>
          <Icon name='address card'/>{this.props.userAddress.substr(0, 7) + "..."}
        </Grid.Column>
        <Grid.Column width={13}>
          {this.props.comment}
        </Grid.Column>
      </Grid.Row>
    )
  }
}

export default Comment;