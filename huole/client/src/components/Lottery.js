import React from "react";
import {Form, Input, Button, Segment, Message} from 'semantic-ui-react';
import ReactCountdownClock from 'react-countdown-clock';

class Lottery extends React.Component {
  state = {
    startTime: '',
    endTime: '',
    duration: 10,
    totalLottery: '',
    numPlayer: '',
    contribute: '',
    bankerAddress: '',
    errorMessage: '',
    setupReady: false,
    winnerAddress: '',
    winnerReady: false,
    lotteryRunning: false
  };

  componentDidMount = async () => {
    const {drizzle, drizzleState} = this.props;
    const contract = drizzle.contracts.Lottery;
    // const bankerAddress = await contract.methods.owner().call();
    // console.log(bankerAddress);
    // this.setState({bankerAddress});
    const duration = await contract.methods.duration_().call();
    console.log(duration);
    this.setState({duration});
    await this.updateBonus(drizzle, contract);
  };

  updateBonus = async (drizzle, contract) => {
    const web3 = drizzle.web3;
    web3.eth.getBalance(contract.address).then((value) => {
      console.log('contract balance', value);
      const totalLottery = web3.utils.fromWei(value, 'ether');
      this.setState({totalLottery});
    });
    const players = await contract.methods.getPlayers().call();
    this.setState({numPlayer: players.length});
  };

  onContribute = async (event) => {
    if (!this.state.lotteryRunning) {
      alert("Lottery haven't start yet");
    } else {
      const {drizzle, drizzleState} = this.props;
      const contract = drizzle.contracts.Lottery;
      try {
        await contract.methods.enter().send({
          from: drizzleState.accounts[0],
          to: contract.address,
          value: drizzle.web3.utils.toWei(this.state.contribute, 'ether')
        });
        await this.updateBonus(drizzle, contract);
      } catch (err) {
        this.setState({errorMessage: err.message});
      }
    }
  };

  getTime = (epochTime) => {
    let d = new Date(0);
    let n = d.getTimezoneOffset();
    d.setUTCSeconds(epochTime);
    d += n;
    let words = d.split(" ");
    return words[0] + " " + words[1] + " " + words[2] + " " + words[3] + " " + words[4];
  };

  runALottery = async () => {
    if (this.state.winnerReady) {
      window.location.replace('/lottery');
    } else if (this.state.lotteryRunning) {
      alert("Lottery is running");
    } else {
      const {drizzle, drizzleState} = this.props;
      const contract = drizzle.contracts.Lottery;
      const current = parseInt((new Date().getTime() / 1000));
      const endTime = parseInt(current + parseInt(this.state.duration));
      console.log('current time: ', current);
      console.log('duration: ', this.state.duration);
      try {
        // const stackId = await contract.methods.setTime.cacheSend(current, this.state.duration, {
        //   from: drizzleState.accounts[0],
        //   to: contract.address
        // });
        await contract.methods.setTime(current, this.state.duration).send({
          from: drizzleState.accounts[0],
          to: contract.address
        });
        this.setState({startTime: this.getTime(current)});
        this.setState({endTime: this.getTime(endTime), setupReady: true})
        this.setState({lotteryRunning: true});
      } catch (err) {
        this.setState({errorMessage: err.message});
      }
    }
  };

  pickWinner = async () => {
    const {drizzle, drizzleState} = this.props;
    const contract = drizzle.contracts.Lottery;
    try {
      await contract.methods.pickWinner().send({
        from: drizzleState.accounts[0],
        to: contract.address
      });
      const winner = await contract.methods.winner_().call();
      this.setState({winnerAddress: winner});
      this.setState({winnerReady:true});
    } catch (err) {
      this.setState({errorMessage: err.message});
    }
  };

  countdown = () => {
    if (this.state.setupReady) {
      return (
        <ReactCountdownClock
          seconds={this.state.duration}
          color="#000"
          alpha={0.9}
          size={150}
          onComplete={() => this.pickWinner()}
        />)
    } else {
      return (<div/>)
    }
  };

  render() {
    return (
      <div style={{marginTop: '10px', marginBottom: '20px'}}>
        <Message hidden={!this.state.winnerReady} color='purple'>Winner is: {this.state.winnerAddress}, wins: {this.state.totalLottery} ether</Message>
        <Segment>
          <h2>Lottery</h2>
          <h4>Total lottery: {this.state.totalLottery} ether</h4>
          <h4>Number of players: {this.state.numPlayer}</h4>
          <hr/>
          <h3>Want to try?</h3>
          <Form onSubmit={this.onContribute} error={!!this.state.errorMessage}>
            <Form.Field>
              <Input
                placeholder={'input amount'}
                value={this.state.contribute}
                onChange={event => this.setState({contribute: event.target.value})}
              />
            </Form.Field>
            <Button primary>Contribute</Button>
            <Message error header="Oops!" content={this.state.errorMessage}/>
          </Form>
        </Segment>
        <Segment>
          <h2>Banker</h2>
          {/*<h4>Banker address: {this.state.bankerAddress}</h4>*/}
          <Form onSubmit={this.runALottery}>
            <Form.Field>
              <Input
                label={'Lottery open duration: second'}
                value={this.state.duration}
                onChange={event => this.setState({duration: event.target.value})}
              />
            </Form.Field>
            <Button primary>Run a lottery</Button>
            <Message info hidden={!this.state.setupReady}>Lottery started at {this.state.startTime}, will end
              at {this.state.endTime}</Message>
            {this.countdown()}
          </Form>
        </Segment>
      </div>
    )
  }
}

export default Lottery;