import { Card, CardBody, CardHeader, CardFooter } from '@paljs/ui/Card';
import Row from '@paljs/ui/Row';
import Col from '@paljs/ui/Col';
import React from 'react';
import Layout from 'Layouts';
import { storeLogin } from 'components/redux/storeLogin';
import { RedisConfig } from '../redis/redis';

export default function Home() {
  const [authUserName, setauthUserName] = React.useState(false);

  React.useEffect(() => {
    async function getData() {
      const redis = RedisConfig();
      const res: any = await redis.get(storeLogin.getState().authLogin);
      if (res.authUserName) {
        setauthUserName(capitalizeFirstLetter(res.authUserName));
      }
    }
    getData();
  });

  function capitalizeFirstLetter(string: any) {
    if (string) return string.charAt(0).toUpperCase() + string.slice(1);
  }

  return (
    <Layout title="Dashboard">
      <Row>
        <Col breakPoint={{ xs: 24, md: 12 }}>
          <Card status="Primary" accent="Info">
            <CardHeader>Dashboard</CardHeader>
            <CardBody>Hai, {authUserName} !!</CardBody>
            <CardFooter></CardFooter>
          </Card>
        </Col>
      </Row>
    </Layout>
  );
}
