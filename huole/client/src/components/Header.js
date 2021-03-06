import React from 'react';
import {Header, Menu} from 'semantic-ui-react';
import {Link} from 'react-router-dom';

export default () => {
  return (
    <div style={{marginTop: '10px', marginBottom: '10px'}}>
      <Header size='large' textAlign='center'>Welcome To HuoLe</Header>
      <Menu style={{marginTop: '10px'}}>
        <Menu.Item>
          <Link to='/'>Home</Link>
        </Menu.Item>
        <Menu.Item>
          <Link to='/faucet'>Faucet</Link>
        </Menu.Item>
        <Menu.Item>
          <Link to='/lottery'>Lottery</Link>
        </Menu.Item>
        <Menu.Item position="right">
          <Link to='/newpost'>New Post</Link>
        </Menu.Item>
      </Menu>
    </div>
  );
}