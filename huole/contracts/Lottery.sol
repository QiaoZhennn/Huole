pragma solidity ^0.4.24;


import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract Lottery is Ownable{
  address[] public players_;
  uint public startTime_;
  uint public duration_;
  address public winner_;

  constructor() public {
    startTime_ = now;
    duration_ = 10 seconds;
  }

  modifier timeConstraint() {
    require(now >= startTime_ + duration_);
    _;
  }

  function setTime(uint _startTime, uint _duration){
    startTime_ = _startTime;
    duration_ = _duration;
  }

  // participate in the lottery game
  function enter() public payable {
    require(msg.value > 0.0001 ether);
    players_.push(msg.sender);
  }

  // return a random value
  function random() public view returns (uint) {
    return uint(keccak256(block.difficulty, now, players_));
  }

  function pickWinner() public timeConstraint{
    uint index = random() % players_.length;
    winner_ = players_[index];
    winner_.transfer(this.balance);
    players_ = new address[](0);
  }

  function getPlayers() public view returns(address[]) {
    return players_;
  }
}
