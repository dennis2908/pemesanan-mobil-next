import { Card, CardBody, CardHeader, CardFooter } from '@paljs/ui/Card';
import Row from '@paljs/ui/Row';
import Col from '@paljs/ui/Col';
import React from 'react';
import Layout from 'Layouts';
import { storeLogin } from 'components/redux/storeLogin';

export default function Home() {
  let username = '';

  if (storeLogin.getState().authUserName) {
    username = capitalizeFirstLetter(storeLogin.getState().authUserName);
  }

  function capitalizeFirstLetter(string: any) {
    if (string) return string.charAt(0).toUpperCase() + string.slice(1);
  }

  return (
    <Layout title="Dashboard">
      <Row>
        <Col breakPoint={{ xs: 24, md: 12 }}>
          <Card status="Primary" accent="Info">
            <CardHeader>Dashboard</CardHeader>
            <CardBody>Hai, {username} !!</CardBody>
            <CardFooter></CardFooter>
          </Card>
        </Col>
      </Row>
    </Layout>
  );
}
