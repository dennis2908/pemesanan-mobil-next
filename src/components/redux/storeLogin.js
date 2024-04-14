import { createStore } from 'redux';

const ls = require('local-storage');

if (!ls.get('nextJS')) {
  let arry = {};
  arry['authUserName'] = '';
  arry['authRoleAssign'] = [];
  ls.set('nextJS', arry);
}

const ThenextJS = ls.get('nextJS');

const initialState = {
  authLogin: ThenextJS['authLogin'],
  authUserName: ThenextJS['authUserName'],
  authRoleAssign: ThenextJS['authRoleAssign'],
};

const reducer = (state = initialState, action) => {
  if (action.type === 'CHANGE_STATE') {
    let nextJS = ThenextJS;
    if (action.payload.authLogin) {
      nextJS['authLogin'] = action.payload.authLogin;
      state.authLogin = action.payload.authLogin;
    } else if (action.payload.authLogin === '') {
      nextJS['authLogin'] = '';
      state.authLogin = '';
    }

    if (action.payload.authUserName) {
      nextJS['authUserName'] = action.payload.authUserName;
      state.authUserName = action.payload.authUserName;
    } else if (action.payload.authUserName === '') {
      nextJS['authUserName'] = '';
      state.authUserName = '';
    }

    if (action.payload.authRoleAssign) {
      let authRoleAssign = action.payload.authRoleAssign.split(',');
      nextJS['authRoleAssign'] = authRoleAssign;
      ls.set('nextJS', nextJS);
      state.authRoleAssign = authRoleAssign;
    } else if (action.payload.authRoleAssign === '') {
      nextJS['authRoleAssign'] = [];
      ls.set('nextJS', nextJS);
      state.authRoleAssign = '';
    }
  }

  return state;
};

const storeLogin = createStore(reducer);

export { storeLogin };
