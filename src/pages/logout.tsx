import { useEffect } from 'react';
import { storeLogin } from 'components/redux/storeLogin';
import { useRouter } from 'next/router';
export default function Logout() {
  const router = useRouter();

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
