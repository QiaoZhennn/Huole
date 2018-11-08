import React from "react";
import {Form, Input, Message, Button, Segment, Label, TextArea} from 'semantic-ui-react';
import {Redirect} from 'react-router-dom';
import axios from 'axios';

class Lottery extends React.Component {
  state = {
    totalLottery: '',
    numPlayer: '',
    contribute:'',
    bankerAddress:''
  };
  render() {
    return (
      <div style={{marginTop: '10px', marginBottom: '20px'}}>
        <Segment>
        <h2>Lottery</h2>
        <h4>Total lottery: {this.state.totalLottery}</h4>
        <h4>Number of players: {this.state.numPlayer}</h4>
        <hr/>
        <h3>Want to try?</h3>
        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
          <Form.Field>
            <Input
              placeholder={'input amount'}
              value={this.state.contribute}
              onChange={event => this.setState({contribute: event.target.value})}
            />
          </Form.Field>
          <Button primary>Contribute</Button>
        </Form>
      </Segment>
      <Segment>
        <h2>banker</h2>
        <h4>banker address: {this.state.bankerAddress}</h4>
        <Button primary>Pick Winner</Button>
      </Segment>
      </div>
    )
  }
}

export default Lottery;