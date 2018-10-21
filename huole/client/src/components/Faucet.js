import React from "react";
import {
  Card,
  Form,
  Input,
  Button,
  Modal,
  Header,
  Icon,
  Label
} from 'semantic-ui-react';
import axios from 'axios';

export default class Posts extends React.Component {
  state = {
    addr: '',
    modalOpen: false,
    respMsg: '',
    userBalance: '',
    donateValue: 0.1,
    faucetAddr: '',
    faucetBalance: ''
  };


  componentDidMount() {
    const { drizzleState } = this.props;
    const addr = drizzleState.accounts[0];
    this.setState({userBalance: drizzleState.accountBalances[addr]});
    if (addr) {
      this.setState({addr: addr});
    } else {
      this.setState({addr: 'Is your metamask unlocked?'});
    }
    this.getFaucetInfo();
  };

  closeModal = () => this.setState({ modalOpen: false });

  onFaucetSubmit = (event) => {
    this.setState({modalOpen: true});
    const requestBody = {
      addr: this.state.addr,
    };
    var qs = require('qs');
    let url = `http://localhost:8000/showmethemoney`;
    if (process.env.NODE_ENV === 'production') {
      url = `http://huole.huobidev.com:8000/showmethemoney`;
    }
    axios.post(url, qs.stringify(requestBody)).then(resp => {
      console.log('server res: ', resp.data);
      this.setState({respMsg: JSON.stringify(resp.data)})
    }).catch((err) => {
      console.error('something went wrong in faucet handleSubmit');
    });
  };

  getFaucetInfo = () => {
    let url = `http://localhost:8000/faucetinfo`;
    if (process.env.NODE_ENV === 'production') {
      url = `http://huole.huobidev.com:8000/faucetinfo`;
    }
    axios.post(url)
      .then(res => {
        if(res.status === 200)
          this.setState({faucetAddr:res.data.faucetAddr, faucetBalance: res.data.faucetBalance})
      }).catch((err) => {
      console.log(err);
    })
  };

  onDonateSubmit = (event) => {

    alert("Not implemented yet!")
  };

  render() {
    return (
      <div>
          <Modal open={this.state.modalOpen}>
            <Header content='水龙头消息' />
            <Modal.Content>
              <p>
                {this.state.respMsg}
              </p>
            </Modal.Content>
            <Modal.Actions>
              <Button color='green' onClick={this.closeModal}>
                <Icon name='checkmark' /> OK
              </Button>
            </Modal.Actions>
          </Modal>

          <Card fluid>
            <Card.Content>
              <Card.Header>
                <Label size='huge' color='yellow'>Get Ether from Faucet</Label>
              </Card.Header>
              <Card.Meta>
                <Label>Faucet Address: {this.state.faucetAddr}</Label>
                <Label>Faucet Balance: {this.state.faucetBalance}</Label>
              </Card.Meta>
            </Card.Content>
            <Card.Content extra>
              <Form onSubmit={this.onFaucetSubmit}>
                <Form.Field>
                  <input placeholder='0x...' value={this.state.addr} onChange={(event)=>this.setState({addr: event.target.value})}/>
                </Form.Field>
                <Button positive>Get 0.1 ETH</Button>
              </Form>
            </Card.Content>
          </Card>

        <Card fluid>
          <Card.Content>
            <Card.Header>
              <Label size='huge' color='yellow'>Donate to Faucet</Label>
            </Card.Header>
            <Card.Meta>
              <Label>User Address: {this.state.addr}</Label>
              <Label>User Balance: {this.state.userBalance/10**18}</Label>
            </Card.Meta>
          </Card.Content>
          <Card.Content extra>
            <Form onSubmit={this.onDonateSubmit}>
              <Form.Field>
                <Input label='ether' labelPosition='right' value={this.state.donateValue} onChange={(event)=>this.setState({donateValue: event.target.value})} />
              </Form.Field>
              <Button positive>Donate ${this.state.donateValue} ether</Button>
            </Form>
          </Card.Content>
        </Card>
      </div>
    );
  }
}