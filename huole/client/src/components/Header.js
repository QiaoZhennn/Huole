import React from 'react';
import {Menu} from 'semantic-ui-react';

export default () => {
  return (
    <Menu style={{marginTop:'10px'}}>
      <Menu.Item>
        <a href={'/'}>Home</a>
      </Menu.Item>
      <Menu.Item position="right">
        <a href={'/newpost'}>New Post</a>
      </Menu.Item>
    </Menu>
  );
}