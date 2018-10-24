import React from "react";
import {Form, Input, Message, Button, Segment} from 'semantic-ui-react';
import {Redirect} from 'react-router-dom';

class NewPost extends React.Component {
  state = {
    postMsg: '',
    nickname: '',
    contact: '',
    loading: false,
    errorMessage: '',
    msgCount: 0,
    posts: [],
    stackId: null,
    redirect: false
  };

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

  getTxStatus = () => {
    const {transactions, transactionStack} = this.props.drizzleState;
    const txHash = transactionStack[this.state.stackId];
    if (!txHash) return null;
    return `${transactions[txHash].status}`;
  };

  onSubmit = async (event) => {
    event.preventDefault();
    this.setState({loading: true, errorMessage: ''});

    const {drizzle, drizzleState} = this.props;
    const contract = drizzle.contracts.HuoLe;
    try {
      const stackId = contract.methods.newPost.cacheSend(this.state.postMsg, this.state.nickname, this.state.contact, {
        from: drizzleState.accounts[0]
      });
      this.setState({stackId});
    } catch (err) {
      this.setState({errorMessage: err.message});
    }
  };

  tryToRedirect = () => {
    let status = this.getTxStatus();
    if (status === 'success') {
      return <Redirect to='/'/>;
    }
  };

  render() {
    return (
      <div style={{marginTop: '10px', marginBottom: '20px'}}>
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
            <Button primary>Post</Button>
            {/*<Button primary loading={this.state.loading}>Post</Button>*/}
          </Form>
        </Segment>
        {/*<div>{this.tryToRedirect()}</div>*/}
      </div>
    );
  }
}

export default NewPost;