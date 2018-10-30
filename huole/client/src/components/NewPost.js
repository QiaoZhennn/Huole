import React from "react";
import {Form, Input, Message, Button, Segment, Label} from 'semantic-ui-react';
import {Redirect} from 'react-router-dom';

class NewPost extends React.Component {
  state = {
    postMsg: '',
    nickname: '',
    contact: '',
    tip: 0,
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
      // this.transferToFaucet();
      const stackId = contract.methods.newPost.cacheSend(this.state.postMsg, this.state.nickname, this.state.contact, drizzle.web3.utils.toWei(this.state.tip, 'ether'), {
        from: drizzleState.accounts[0],
        to: contract.address,
        value: drizzle.web3.utils.toWei(this.calculatePayment(), 'ether')
      });
      this.setState({stackId});
    } catch (err) {
      this.setState({errorMessage: err.message});
    }
    this.setState({loading: false});
  };


  calculatePayment = () => {
    return (parseFloat(this.state.tip) + (this.state.postMsg.length*0.0001)).toString(); // one char = 0.0001 ether
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
              <Label>ether cost: {this.state.postMsg.length * 0.0001}</Label>
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