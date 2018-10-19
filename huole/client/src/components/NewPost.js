import React, {Component} from 'react';


class NewPost extends Component {
  state = {
    msg: '',
    nickname: '',
    contact: '',
    loading: false,
    errorMessage: ''
  };


  render() {
    return (
      <div>
        <h3>Create a new post</h3>
      </div>
    );
  }
}

export default NewPost;