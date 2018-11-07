import React, {Component} from 'react';
import {Feed, Icon, Button, Modal, TextArea, Form, Grid} from 'semantic-ui-react';
import Identicon from 'identicon.js';
import axios from 'axios';
import Comment from './Comment';

class Post extends Component {
  state = {
    likeCount: 0,
    open: false,
    comment: '',
    post: ''
  };

  close = () => this.setState({open: false});

  componentDidMount() {
    this.setState({likeCount: this.props.post.likeCount})
  }

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

  like = () => {
    const requestBody = {
      postId: this.props.post.postId,
      likeCount: this.state.likeCount + 1
    };
    var qs = require('qs');
    let url = `http://localhost:8000/likePost`;
    if (process.env.NODE_ENV === 'production') {
      url = `http://huole.huobidev.com:8000/likePost`;
    }
    axios.post(url, qs.stringify(requestBody)).then(resp => {
      this.setState({likeCount: this.state.likeCount + 1});
      console.log('server res: ', resp.data);
    }).catch((err) => {
      console.error('something went wrong in adding like count');
    });
  };

  comment = () => {
    const comment = this.state.comment;
    const requestBody = {
      postId: this.props.post.postId,
      comment: comment
    };
    var qs = require('qs');
    let url = `http://localhost:8000/commentPost`;
    if (process.env.NODE_ENV === 'production') {
      url = `http://huole.huobidev.com:8000/commentPost`;
    }
    axios.post(url, qs.stringify(requestBody)).then(resp => {
      console.log('server res: ', resp.data);
    }).catch((err) => {
      console.error('something went wrong in adding like count');
    });
    this.close();
    window.location.replace('/');
  };

  renderComment = () => {
    if (this.props.post.comment && this.props.post.comment.length > 0) {
      return (
        <Grid celled>
          {this.props.post.comment.map((comment, index) => {
            return (
              <Comment key={index} comment={comment} userAddress={this.props.post.userAddress}/>
            )
          })}
        </Grid>
      );
    }
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
            <Icon name='dollar sign'/>
            {this.props.post.tip / 10 ** 18} ether
            <Feed.Date>{this.getTime(this.props.post.postTime)}</Feed.Date>
          </Feed.Summary>
          <Feed.Extra text>
            {this.props.post.content}
          </Feed.Extra>
          <Feed.Extra>
            {this.renderComment()}
            <Button onClick={() => this.setState({open: true})}>Comment</Button>
            <Modal
              open={this.state.open}
              closeOnEscape={true}
              closeOnDimmerClick={false}
              onClose={this.close}
            >
              <Modal.Content>
                <Modal.Description>
                  <Form>
                    <TextArea
                      autoHeight
                      placeholder='Write your comment here'
                      value={this.state.comment}
                      onChange={event => this.setState({comment: event.target.value})}
                    />
                  </Form>
                </Modal.Description>
              </Modal.Content>
              <Modal.Actions>
                <Button color='red'
                        onClick={() => this.close()}>
                  <Icon name='remove'/> Cancel
                </Button>
                <Button color='green'
                        onClick={() => this.comment()}>
                  <Icon name='checkmark'/> Publish
                </Button>
              </Modal.Actions>
            </Modal>
          </Feed.Extra>
          <Feed.Meta>
            <Feed.Like onClick={() => {
              this.like()
            }}>
              <Icon name='like'/>
              {this.state.likeCount}
            </Feed.Like>
          </Feed.Meta>
        </Feed.Content>
      </Feed.Event>
    );
  }
}

export default Post;
