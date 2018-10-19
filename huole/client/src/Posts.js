import React from "react";
import {Form, Input, Message, Button, Segment} from 'semantic-ui-react';
import PostList from "./components/PostList";

export default class Posts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      postMsg: '',
      nickname: '',
      contact: '',
      loading: false,
      errorMessage: '',
      msgCount: 0,
      posts: []
    };
    // this.handleChange = this.handleChange.bind(this);
    // this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    const {drizzle} = this.props;
    const contract = drizzle.contracts.HuoLe;

    (async () => {
      const postCount = await contract.methods.postCount_().call();
      let posts = [];
      for (let i = 0; i < postCount; i++) {
        posts.push(await contract.methods.getPost(i + 1).call());
      }
      this.setState({posts: posts});
    })();
  }

  // handleSubmit(event) {
  //   event.preventDefault();
  //   const { drizzle } = this.props;
  //   const contract = drizzle.contracts.HuoLe;
  //
  //   const stackId = contract.methods.newPost.cacheSend(this.state.postMsg, 'random', 'tanghao@huobi.com');
  //   //todo loading UI says waiting for blockchain to confirm. Use stackId to check, once the tx is confirmed, refresh the UI to show the added message.
  //
  // }

  onSubmit = async (event) => {
    event.preventDefault();
    this.setState({loading: true, errorMessage: ''});

    const {drizzle} = this.props;
    const contract = drizzle.contracts.HuoLe;
    try {
      const stackId = contract.methods.newPost.cacheSend(this.state.postMsg, this.state.nickname, this.state.contact);
    } catch (err) {
      this.setState({errorMessage: err.message});
    }
    this.setState({loading: false});
    // Redirect.to('/');
  }

  render() {
    return (
      <div  style={{marginTop:'10px', marginBottom:'20px'}}>
        <Segment>
          <h2>Publish a new post</h2>
          <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
            <Form.Field>
              <Input
                placeholder={'Content'}
                value={this.state.postMsg}
                onChange={event => this.setState({postMsg: event.target.value})}
              />
            </Form.Field>
            <Form.Field>
              <Input
                placeholder={'Nickname'}
                value={this.state.nickname}
                onChange={event => this.setState({nickname: event.target.value})}
              />
            </Form.Field>
            <Form.Field>
              <Input
                placeholder={'Contact'}
                value={this.state.contact}
                onChange={event => this.setState({contact: event.target.value})}
              />
            </Form.Field>
            <Message error header="Oops!" content={this.state.errorMessage}/>
            <Button primary loading={this.state.loading}>Post</Button>
          </Form>
        </Segment>
      </div>
    );
  }
}