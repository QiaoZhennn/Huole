import React from "react";
import {Item} from 'semantic-ui-react';

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
    const {drizzle} = this.props;
    const contract = drizzle.contracts.HuoLe;

    (async () => {
      const postCount = await contract.methods.postCount_().call();
      let posts = [];
      for (let i = 0; i < postCount; i++) {
        const post = await contract.methods.getPost(i + 1).call();
        const user = await contract.methods.getUser(post[1]).call(); //post[1] is user_id
        const obj = {
          content: post[0],
          postTime: post[2],
          tip: post[3],
          userAddress: user[0],
          nickname: user[1],
          contact: user[2]
        };
        posts.push(obj);
      }
      this.setState({posts: posts});
    })();
  }

  sortByExtraFeeAndPostTime = (post1, post2) => {
    const fee1 = post1.tip / 10**18; // in ether
    const time1 = parseInt(post1[1]); // in ms
    const fee2 = post2.tip / 10**18;
    const time2 = parseInt(post2[1]);
    const fee1ToExtraTime = fee1 * 1000 * 60 * 60 * 24 ; // 1 ether = 1 day advancement
    const post1TotalTime = time1 + fee1ToExtraTime;
    const fee2ToExtraTime = fee2 * 1000 * 60 * 60 * 24 ;
    const post2TotalTime = time2 + fee2ToExtraTime;
    return post1TotalTime <= post2TotalTime;
  };

  renderPosts() {
    this.state.posts.sort(this.sortByExtraFeeAndPostTime);
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
