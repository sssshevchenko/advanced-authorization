import { observer } from 'mobx-react-lite';
import React, { FC, useContext, useEffect, useState } from 'react';
import { Context } from '.';
import LoginForm from './components/LoginForm';
import { IUser } from './models/IUser';
import UserService from './services/UserService';

const App: FC = () => {
  const {store} = useContext(Context)
  const [users, setUsers] = useState<IUser[]>([])

  async function getUsers() {
    try {
      const response = await UserService.fetchUsers()
      setUsers(response.data)
    } catch(e: any) {
      console.log(e)
    }
  }

  useEffect(() => {
    if(localStorage.getItem('token')) {
      store.checkAuth()
    }
  }, [])

  if(store.isLoading) {
    return (
      <div>Loading...</div>
    )
  }

  if(!store.isAuth) {
    return (
      <LoginForm />
    )
  }

  return (
    <div>
      <h1>{store.isAuth ? `User ${store.user.email} is authorized` : 'You need to authorize'}</h1>
      <h1>{store.user.isActivated ? 'Account is activated' : 'You need to activate your account'}</h1>
      <button onClick={() => store.logout()}>Logout</button>
      <button onClick={getUsers}>Get users</button>
      <div>
        {users.map(user => 
          <div key={user.email}>{user.email}</div>  
        )}
      </div>
    </div>
  );
};

export default observer(App);