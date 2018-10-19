import React from "react";
import {
  Card,
  Form,
  Button,
  Modal,
  Header,
  Icon
} from 'semantic-ui-react';
import axios from 'axios';

export default class Posts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      addr: '',
      modalOpen: false,
      respMsg: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  componentDidMount() {
    const { drizzleState } = this.props;
    const addr = drizzleState.accounts[0];
    if (addr) {
      this.setState({addr: addr});
    } else {
      this.setState({addr: 'Is your metamask unlocked?'});
    }
  }
  closeModal = () => this.setState({ modalOpen: false })

  handleChange(event) {
    this.setState({addr: event.target.value});
  }

  handleSubmit() {
    this.setState({modalOpen: true});
    
    let url = `http://localhost:8000/showmethemoney`;
    if (process.env.NODE_ENV == 'production') {
      url = `http://huole.huobidev.com:8000/showmethemoney`;
    }

    const requestBody = {
      addr: this.state.addr,
    }; 
    var qs = require('qs'); 

    axios.post(url, qs.stringify(requestBody)).then(resp => {
      console.log('server res: ', resp.data);
      this.setState({respMsg: JSON.stringify(resp.data)})
    }).catch((err) => {
      console.error('something went wrong in faucet handleSubmit');
    });
  }

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
              <Card.Header>Faucet here</Card.Header>
              <Form>
                <Form.Field>
                  <label>Wallet Address</label>
                  <input placeholder='0x...' value={this.state.addr} onChange={this.handleChange} />
                </Form.Field>
                <Button type='submit' onClick={this.handleSubmit}>Get 0.01 ETH</Button>
              </Form>
            </Card.Content>
          </Card>
      </div>
    );
  }
}