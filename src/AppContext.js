import React from 'react';
import { createContainer } from 'unstated-next';

export function useStore(initialState = 0) {
  let [isLogin, setLogin] = React.useState(false);
  let [user, setUser] = React.useState({});
  let login = (user) => {
    setUser(user);
    setLogin(true);
  };
  let logout = () => setLogin(false);
  return { isLogin, setLogin, login, logout, user, setUser };
}

export const StateContainer = createContainer(useStore);

// const AppContext = React.createContext(null);

// const Connect = (ChildComponent) => (props) => (
//   <AppContext.Consumer>
//     {(context) => <ChildComponent {...props} context={context} />}
//   </AppContext.Consumer>
// );

// const Connect2 = (ChildComponent) => (props) => (
//   <Subscribe to={[Store]}>
//     {(context) => <ChildComponent {...props} context={context} />}
//   </Subscribe>
// );
