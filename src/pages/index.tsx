import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { storeLogin } from 'components/redux/storeLogin';

export default function Index() {
  const router = useRouter();
  useEffect(() => {
    if (storeLogin.getState().authLogin === '') {
      router.push('/auth/signin');
    } else router.push('/dashboard');
  }),
    [];
  return <div />;
}
