import React from "react";
import {Feed} from 'semantic-ui-react';
import axios from 'axios';

import Post from './Post';

export default class Posts extends React.Component {

  state = {
    posts: [],
    currentUserAddress: ''
  };


  componentDidMount() {
    const {drizzle, drizzleState} = this.props;
    const contract = drizzle.contracts.HuoLe;
    this.state.currentUserAddress =  drizzleState.accounts[0];
    (async () => {
      const postCount = await contract.methods.postCount_().call();
      let posts = [];
      for (let i = 0; i < postCount; i++) {

        let url = `http://localhost:8000/readPost`;
        if (process.env.NODE_ENV === 'production') {
          url = `http://huole.huobidev.com:8000/readPost`;
        }
        await axios.post(url, {postId: i+1})
          .then(res => {
            if(res.status === 200) {
              if (res.data.postId) {
                posts.push(res.data);
              }
            }
          }).catch((err) => {
          console.log(err);
        });
      }
      this.setState({posts: posts});
    })();
  }

  sortByExtraFeeAndPostTime = (post1, post2) => {
    const fee1 = post1.tip / 10**18; // in ether
    const time1 = parseInt(post1.postTime); // in ms
    const fee2 = post2.tip / 10**18;
    const time2 = parseInt(post2.postTime);
    const fee1ToExtraTime = fee1 * 1000 * 60 * 60 * 24 ; // 1 ether = 1 day advancement
    const post1TotalTime = time1 + fee1ToExtraTime;
    const fee2ToExtraTime = fee2 * 1000 * 60 * 60 * 24 ;
    const post2TotalTime = time2 + fee2ToExtraTime;
    return post2TotalTime - post1TotalTime;
  };

  renderPosts() {
    this.state.posts.sort(this.sortByExtraFeeAndPostTime);
    return this.state.posts.map((post, index) => {
      return (
        <Post key={index} post={post} currentUserAddress={this.state.currentUserAddress}/>
      )
    });
  }

  render() {
    return (
      <Feed>
        {this.renderPosts()}
      </Feed>
    );
  }
}
