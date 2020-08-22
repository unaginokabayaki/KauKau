import React from 'react';
import { createContainer } from 'unstated-next';

export function useStore(initialState = 0) {
  const [isLogin, setLogin] = React.useState(false);
  const [authInfo, setAuthInfo] = React.useState({});
  const [user, setUser] = React.useState({});
  const updateUser = (values) => {
    setUser({ ...user, ...values });
  };
  const login = (authInfo, user) => {
    setAuthInfo(authInfo);
    setUser(user);
    setLogin(true);
  };
  const logout = () => setLogin(false);
  return { isLogin, setLogin, login, logout, authInfo, user, updateUser };
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
