import React from "react";
import { Form } from 'semantic-ui-react';

export default class Posts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      postMsg: '',
      msgCount: 0,
      posts: []
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    const { drizzle } = this.props;
    const contract = drizzle.contracts.HuoLe;

    (async () => {
      const postCount = await contract.methods.postCount_().call();
      let posts = [];
      for(let i = 0; i < postCount; i++) {
        posts.push(await contract.methods.getPost(i + 1).call());
      }
      this.setState({posts: posts});
    })();
  }

  renderPosts() {
    return this.state.posts.map((post, index) => {
      return (
        <div key={index}>
          <p>{post[0]}</p>
        </div>
      )
    });
  }

  handleChange(event) {
    this.setState({postMsg: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();
    const { drizzle } = this.props;
    const contract = drizzle.contracts.HuoLe;

    const stackId = contract.methods.newPost.cacheSend(this.state.postMsg, 'random', 'tanghao@huobi.com');
    //todo loading UI says waiting for blockchain to confirm. Use stackId to check, once the tx is confirmed, refresh the UI to show the added message.

  }

  render() {
    return (
      <div>
        Posts list:
        {this.renderPosts()}
        <Form>
          <Form.TextArea label='留言'  placeholder='写点什么。。。' value={this.state.postMsg} onChange={this.handleChange}/>
          <Form.Button onClick={this.handleSubmit}>Submit</Form.Button>
        </Form>
      </div>
    );
  }
}