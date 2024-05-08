import { useEffect } from 'react';
import { storeLogin } from 'components/redux/storeLogin';
import { useRouter } from 'next/router';

import { RedisConfig } from 'redis/redis';
export default function Logout() {
  const router = useRouter();

  const redis = RedisConfig();
  redis.del(storeLogin.getState().authLogin);

  useEffect(() => {
    const Dologout = async () => {
      localStorage.removeItem('nextJS');
      await storeLogin.dispatch({
        type: 'CHANGE_STATE',
        payload: { authLogin: '', authUserName: '', authName: '', authRoleName: '', authRoleAssign: '' },
      });
      router.push('/auth/signin');
    };
    Dologout();
  }, []);

  return '';
}
