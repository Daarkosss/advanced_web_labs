import React from 'react';
import { observer } from 'mobx-react-lite';
import { Login } from "./components/Login/Login";
import { Message } from "./components/Message/Message";
import { store } from "./store/store";

const App = observer(() => {
  return (
    <div>
      {!store.isLoggedIn ? (
        <Login/>
      ) : (
        <Message/>
      )}
    </div>
  );
});

export default App;
