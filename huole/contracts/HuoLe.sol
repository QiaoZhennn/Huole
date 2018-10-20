pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract HuoLe is Ownable{
  using SafeMath for *;

  // Storage
  uint public userCount_;
  uint public postCount_;
  mapping(address=>User) users_;
  mapping(uint=>User) user_by_id_;
  mapping(uint=>Post) posts_;
  uint public charCost_;

  // Structs
  struct User {
    uint id;
    address addr;
    string nickname;
    string contact;
  }

  struct Post {
    uint id;
    uint postTime;
    string text;
    User user;
  }
  
  // Events
  event PostCreated (string _msg, address _sender, string _nickname, string _contact);


  // Public functions
  constructor() public {
  }

  function newPost(string _msg, string _nickname, string _contact) public {
    if (users_[msg.sender].id == 0) {
      userCount_ = userCount_.add(1);
      users_[msg.sender] = User(userCount_, msg.sender, _nickname, _contact);
    }

    postCount_ = postCount_.add(1);
    User memory user = users_[msg.sender];
    posts_[postCount_] = Post(postCount_, now, _msg, user);
    user_by_id_[user.id] = user;
    emit PostCreated(_msg, msg.sender, _nickname, _contact);
  }

  function setCharCost(uint _charCost) public onlyOwner {
    charCost_ = _charCost;
  }

  function getPost(uint _id) public view returns(string, uint, uint) {
    return (posts_[_id].text, posts_[_id].user.id, posts_[_id].postTime);
  }

  function getUser(uint _id) public view returns(address, string, string) {
    return (user_by_id_[_id].addr, user_by_id_[_id].nickname, user_by_id_[_id].contact);
  }
}