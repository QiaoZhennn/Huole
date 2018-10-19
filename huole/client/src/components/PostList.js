import React from "react";
import { Item } from 'semantic-ui-react';

import Post from './Post';

export default class Posts extends React.Component {

  state = {
    postMsg: '',
    nickname: '',
    contact: '',
    msgCount: 0,
    posts: []
  };

  componentDidMount() {
    const { drizzle } = this.props;
    const contract = drizzle.contracts.HuoLe;

    (async () => {
      const postCount = await contract.methods.postCount_().call();
      let posts = [];
      for(let i = 0; i < postCount; i++) {
        const post = await contract.methods.getPost(i + 1).call();
        const user = await contract.methods.getUser(post[1]).call();
        const obj = [post[0], post[2], user[0], user[1], user[2]];
        console.log(obj);
        posts.push(obj);
      }
      this.setState({posts: posts});
    })();
  }

  renderPosts() {
    return this.state.posts.map((post, index) => {
      return (
          <Post key={index} post={post}/>
      )
    });
  }

  render() {
    return (
      <Item.Group divided>
        {this.renderPosts()}
      </Item.Group>
    );
  }
}