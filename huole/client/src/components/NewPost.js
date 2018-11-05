import React from "react";
import {Form, Input, Message, Button, Segment, Label} from 'semantic-ui-react';
import {Redirect} from 'react-router-dom';
import axios from 'axios';

class NewPost extends React.Component {
  state = {
    postMsg: '',
    nickname: '',
    contact: '',
    tip: '0.0',
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

    const web3 = drizzle.web3;
    console.log('address', contract.address);
    web3.eth.getBalance(contract.address).then((value) => {
      console.log('contract balance', value);
    });
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
      const stackId = await contract.methods.newPost.cacheSend(this.state.postMsg, this.state.nickname, this.state.contact, drizzle.web3.utils.toWei(this.state.tip, 'ether'), {
        from: drizzleState.accounts[0],
        to: contract.address,
        value: drizzle.web3.utils.toWei(this.calculatePayment(), 'ether')
      });

      // let promise = await new Promise((resolve, reject) => {
      //   setTimeout(() => resolve("done!"), 3000)
      // });
      this.setState({stackId});
    } catch (err) {
      this.setState({errorMessage: err.message});
    }
    this.storeToDB(contract);
    this.setState({loading: false});
  };

  storeToDB = async (contract) => {
    const postId = await contract.methods.postCount_().call();
    alert(postId);
    const post = await contract.methods.getPost(postId).call();
    const user = await contract.methods.getUser(post[1]).call();
    const requestBody = {
      postId : postId,
      content: post[0],
      postTime: post[2],
      tip: post[3],
      userAddress: user[0],
      nickname: user[1],
      contact: user[2],
      likeCount: 0,
      comment: {}
    };

    var qs = require('qs');
    let url = `http://localhost:8000/createPost`;
    if (process.env.NODE_ENV === 'production') {
      url = `http://huole.huobidev.com:8000/createPost`;
    }
    axios.post(url, qs.stringify(requestBody)).then(resp => {
      console.log('server res: ', resp.data);
    }).catch((err) => {
      console.error('something went wrong in faucet handleSubmit');
    });
  };

  calculatePayment = () => {
    const cost = (parseFloat(this.state.tip) + (this.state.postMsg.length*0.0001)).toFixed(15).toString();
    return cost; // one char = 0.0001 ether
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
              <Label>char count: {this.state.postMsg.length}</Label>
              <Label>ether cost: {parseFloat(this.state.postMsg.length * 0.0001).toFixed(18)}</Label>
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
            <Form.Field>
              <Input
                placeholder={'Pay higher extra fee to post on a better location, default 0'}
                value={this.state.tip}
                onChange={event => this.setState({tip: event.target.value})}
              />
            </Form.Field>
            <Message error header="Oops!" content={this.state.errorMessage}/>
            <Button primary>Post</Button>
            {/*<Button primary loading={this.state.loading}>Post</Button>*/}
          </Form>
        </Segment>
        <div>{this.tryToRedirect()}</div>
      </div>
    );
  }
}

export default NewPost;