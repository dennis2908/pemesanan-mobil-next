import { Button } from '@paljs/ui/Button';
import { InputGroup } from '@paljs/ui/Input';
import React, { useEffect } from 'react';

import Alert from '@paljs/ui/Alert';

//import { useHistory } from 'react-router-dom'

import { storeLogin } from 'components/redux/storeLogin';

import Auth, { Group } from 'components/Auth';
import Layout from 'Layouts';

export default function Signin() {
  const [FormData, setFormData] = React.useState({});

  const [showForm, setShowForm] = React.useState(false);

  const [styleAlrt, setStyleAlrt] = React.useState(false);

  //const history = useHistory()
  useEffect(async () => {
    await localStorage.removeItem('nextJS');
    await storeLogin.dispatch({
      type: 'CHANGE_STATE',
      payload: { authLogin: '', authUserName: '', authName: '', authRoleName: '', authRoleAssign: '' },
    });
  }, []);

  const onFieldChange = (fieldName) => {
    return function (event) {
      FormData[fieldName] = event.target.value;
      setFormData(FormData);
    };
  };

  const SubmitFormRegister = async (e) => {
    e.preventDefault();

    setStyleAlrt(false);

    let no_sim = await fetch('http://127.0.0.1:8441/api/user/cek_sim/' + FormData.no_sim, {
      method: 'GET',
      headers: {
        'Access-Control-Allow-Headers': '*',
      },
    })
      .then((response) => response.json())
      .then((response) => {
        return response.result;
      });

    if (no_sim === null)
      fetch('http://127.0.0.1:8441/api/user/register', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Headers': '*',
        },
        body: JSON.stringify(FormData),
      })
        .then((res) => res.json())
        .then(() => {
          setShowForm(!showForm);
        });
    else setStyleAlrt(true);
    e.preventDefault();
  };

  const SubmitForm = async (e) => {
    e.preventDefault();
    let formData = {};
    formData.no_sim = e.target.no_sim.value;
    formData.password = e.target.password.value;

    await fetch('http://127.0.0.1:8441/api/user/login', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Headers': '*',
      },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.result) {
          storeLogin.dispatch({
            type: 'CHANGE_STATE',
            payload: {
              authLogin: result.token,
              authUserName: result.result.nama,
              authRoleAssign: result.result.role_assign,
            },
          });
          location.href = '/dashboard';
        }
      });

    e.preventDefault();
  };

  return (
    <Layout title="Register & Signin">
      {!showForm && (
        <Auth title="Signin" subTitle="Hallo! Masuk dengan akun anda">
          <form
            onSubmit={(e) => {
              SubmitForm(e);
            }}
          >
            <InputGroup fullWidth>
              <input type="text" placeholder="Masukkan Nomor SIM" name="no_sim" required minLength={3} />
            </InputGroup>
            <InputGroup fullWidth>
              <input type="password" placeholder="Masukkan Password" name="password" required minLength={3} />
            </InputGroup>
            <Group>
              <a onClick={() => setShowForm(!showForm)}>Belum punya akun. Klik disini!</a>
            </Group>
            <Button status="Success" type="submit" shape="SemiRound" fullWidth>
              Login
            </Button>
          </form>
        </Auth>
      )}
      {showForm && (
        <Auth title="Register" subTitle="Halo! Registrasi Disini" id="register">
          <form
            onSubmit={(e) => {
              SubmitFormRegister(e);
            }}
          >
            <InputGroup fullWidth>
              <input
                type="text"
                placeholder="Masukkan Nama"
                name="nama"
                required
                minLength={3}
                defaultValue={FormData.nama || ''}
                onChange={onFieldChange('nama').bind(this)}
              />
            </InputGroup>
            <InputGroup fullWidth>
              <input
                type="text"
                placeholder="Masukkan Alamat"
                name="alamat"
                required
                minLength={3}
                defaultValue={FormData.alamat || ''}
                onChange={onFieldChange('alamat').bind(this)}
              />
            </InputGroup>
            <InputGroup fullWidth>
              <input
                type="text"
                placeholder="Masukkan Nomor Telepon"
                name="no_telp"
                required
                minLength={3}
                defaultValue={FormData.no_telp || ''}
                onChange={onFieldChange('no_telp').bind(this)}
              />
            </InputGroup>
            <InputGroup fullWidth>
              <input
                type="text"
                placeholder="Masukkan Nomor SIM"
                name="no_sim"
                required
                minLength={3}
                defaultValue={FormData.no_sim || ''}
                onChange={onFieldChange('no_sim').bind(this)}
              />
            </InputGroup>
            <InputGroup fullWidth>
              <input
                type="password"
                placeholder="Masukkan Password"
                name="password"
                required
                minLength={3}
                defaultValue={FormData.password || ''}
                onChange={onFieldChange('password').bind(this)}
              />
            </InputGroup>
            <Group>
              <a onClick={() => setShowForm(!showForm)}>Sudah punya akun. Klik disini!</a>
            </Group>
            <Group>
              <Alert style={{ display: styleAlrt ? 'block' : 'none' }} status="Warning">
                No SIM sudah ada di sistem
              </Alert>
            </Group>
            <Button status="Success" type="submit" shape="SemiRound" fullWidth>
              Registrasi
            </Button>
          </form>
        </Auth>
      )}
    </Layout>
  );
}
