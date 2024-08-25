import { Card, CardBody, CardHeader, CardFooter } from '@paljs/ui/Card';
import Row from '@paljs/ui/Row';
import Col from '@paljs/ui/Col';
import React from 'react';

import Alert from '@paljs/ui/Alert';

import NativeSelect from '@material-ui/core/NativeSelect';

import useStateRef from 'react-usestateref';
import Layout from 'Layouts';
import { storeLogin } from 'components/redux/storeLogin';
import AddIcon from '@material-ui/icons/Add';
import ListIcon from '@material-ui/icons/List';

import { InputGroup } from '@paljs/ui/Input';

import styled from 'styled-components';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';

import { red } from '@material-ui/core/colors';

import { withStyles, makeStyles } from '@material-ui/core/styles';

import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';

import LinearProgress from '@material-ui/core/LinearProgress';

import { useRouter } from 'next/router';

const columns = [
  { id: 'ket_mobil', label: 'Merk Mobil Plat', minWidth: 200 },
  { id: 'tgl_mulai', label: 'Tgl Mulai Pinjam', minWidth: 200 },
  { id: 'tgl_akhir', label: 'Tgl Akhir Pinjam', minWidth: 200 },
  { id: 'nama', label: 'Peminjam', minWidth: 200 },
];

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
  container: {
    maxHeight: 440,
  },
});

export default function Pinjam_list() {
  const style = { marginBottom: '1.5rem' };
  const [open, setOpen] = React.useState(false);

  const [styleAlrt, setStyleAlrt] = React.useState(false);

  const [rows, setrows] = React.useState([]);

  const [FormCari, setFormCari] = React.useState({});

  const [selmobil, setselmobil] = React.useState([]);

  const Input = styled(InputGroup)`
    margin-bottom: 10px;
  `;

  const [OpenDetailDil, setOpenDetailDil] = React.useState(false);

  const [OpenDelDil, setOpenDelDil] = React.useState(false);

  const [ShowHideLin, setShowHideLin] = React.useState({ display: 'block' });

  const [FormData, setFormData] = React.useState({});

  const [BtnDilSE, setBtnDilSE] = React.useState({});

  const [DialogSEtitle, setDialogSEtitle] = useStateRef('Register New Data');
  const [IconSEtitle, setIconSEtitle] = React.useState(<AddIcon style={{ marginBottom: -4 }} color="primary" />);

  const onFieldChange = (fieldName) => {
    return function (event) {
      FormData[fieldName] = event.target.value;
      setFormData(FormData);
    };
  };

  const carimobilchange = (fieldName) => {
    return function (event) {
      FormCari[fieldName] = event.target.value;
      setFormCari(FormCari);
    };
  };

  const DangerButton = withStyles((theme) => ({
    root: {
      color: theme.palette.getContrastText(red[500]),
      backgroundColor: red[500],
      '&:hover': {
        backgroundColor: red[700],
      },
    },
  }))(Button);

  const router = useRouter();

  React.useEffect(async () => {
    var roleAss = Object.assign({}, storeLogin.getState().authRoleAssign);
    let cekmminjam = Object.values(roleAss).find((obj) => {
      return obj === 'mminjam';
    });
    if (!cekmminjam) router.push('/dashboard');

    await loadData();
    await cariMobil();
  }, []);
  const loadData = async (e) => {
    await DoShowLin();
    await fetch('http://127.0.0.1:8441/api/minjam', {
      method: 'GET',
      headers: { Authorization: 'Bearer ' + storeLogin.getState().authLogin },
    })
      .then((res) => res.json())
      .then((result) => {
        if (Object.keys(result.result).length > 0) {
          const filtered = result.result.filter((x) => (x.ket_mobil = x.merk + '-' + x.model + '-' + x.no_plat));
          setrows(filtered);
        }
      });
    await DoHideLin();
  };

  const cariMobilSearch = async () => {
    await DoShowLin();
    await fetch('http://127.0.0.1:8441/api/minjam/cariMobil', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Headers': '*',
        Authorization: 'Bearer ' + storeLogin.getState().authLogin,
      },
      body: JSON.stringify(FormCari),
    })
      .then((res) => res.json())
      .then((result) => {
        if (Object.keys(result.result).length > 0) {
          const filtered = result.result.filter((x) => (x.ket_mobil = x.merk + '-' + x.model + '-' + x.no_plat));
          setrows(filtered);
        }
      });
    await DoHideLin();
  };

  const cariMobil = async () => {
    await DoShowLin();
    console.log(FormCari);
    await fetch('http://127.0.0.1:8441/api/manajemen', {
      method: 'GET',
      headers: {
        'Access-Control-Allow-Headers': '*',
        Authorization: 'Bearer ' + storeLogin.getState().authLogin,
      },
    })
      .then((res) => res.json())
      .then((result) => {
        if (Object.keys(result.result).length > 0) {
          setselmobil(result.result);
        }
      });
    await DoHideLin();
  };

  const saveUpdateData = async (e) => {
    e.preventDefault();
    setStyleAlrt(false);
    if (typeof FormData.id === 'undefined') {
      let avail = await fetch('http://127.0.0.1:8441/api/minjam/cekavail', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Headers': '*',
          Authorization: 'Bearer ' + storeLogin.getState().authLogin,
        },
        body: JSON.stringify(FormData),
      })
        .then((response) => response.json())
        .then((response) => {
          return response.result;
        });

      if (Object.keys(avail).length === 0)
        fetch('http://127.0.0.1:8441/api/minjam', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Headers': '*',
            Authorization: 'Bearer ' + storeLogin.getState().authLogin,
          },
          body: JSON.stringify(FormData),
        })
          .then((res) => res.json())
          .then(() => {
            loadData();
            handleClose();
          });
      else setStyleAlrt(true);
    } else {
      fetch('http://127.0.0.1:8441/api/minjam/' + FormData.id, {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Headers': '*',
          Authorization: 'Bearer ' + storeLogin.getState().authLogin,
        },
        body: JSON.stringify(FormData),
      })
        .then((res) => res.json())
        .then((result) => {
          loadData();
          handleClose();
        });
    }
    e.preventDefault();
  };
  const dataMobil = async (e) => {
    await fetch('http://127.0.0.1:8441/api/manajemen', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Headers': '*',
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setselmobil(result.result);
      });
  };

  let dataSelMobil = [];
  dataSelMobil = [
    <option value="" key={String('0role') + String('0role')}>
      == Pilih Mobil ==
    </option>,
  ];
  if (selmobil) {
    selmobil.forEach((k, v) => {
      dataSelMobil.push(
        <option value={k.id} key={String(k.id + 'mobil')}>
          {k.merk + '-' + k.model + '-' + k.no_plat}
        </option>,
      );
    });
  }

  const DoShowLin = async (e) => {
    setShowHideLin({ display: 'block' });
  };

  const DoHideLin = async (e) => {
    setShowHideLin({ display: 'none' });
  };

  const delItem = async () => {
    await fetch('http://127.0.0.1:8441/api/user/' + FormData.id, {
      method: 'DELETE',
      headers: { Authorization: 'Bearer ' + storeLogin.getState().authLogin },
    })
      .then((res) => res.json())
      .then((result) => {
        loadData();
        handleCloseDelDil();
      });
  };

  const openNewForm = () => {
    setStyleAlrt(false);
    setOpen(true);
    setFormData({});
    setIconSEtitle(<AddIcon style={{ marginBottom: -4 }} color="primary" />);
    setDialogSEtitle('Daftar Peminjaman Baru');
    setBtnDilSE('Save');
  };

  const OpenDetailSE = async (data) => {
    await setFormData(data);
    await setOpenDetailDil(true);
  };

  const OpenDeleteSE = async (data) => {
    await setFormData(data);
    await setOpenDelDil(true);
  };

  const handleClose = () => {
    loadData();
    setOpen(false);
  };

  const handleCloseDelDil = () => {
    loadData();
    setOpenDelDil(false);
  };

  const handleCloseDetailDil = (data) => {
    setOpenDetailDil(false);
  };

  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  return (
    <Layout title="List Peminjaman">
      <Row>
        <Col breakPoint={{ xs: 24, md: 12 }}>
          <Card status="Primary" accent="Info">
            <CardHeader>
              <Row style={style} breakPoint={{ xs: 12, lg: 4 }}>
                <ListIcon style={{ marginBottom: -7 }} color="primary" />
                Peminjaman Mobil
              </Row>
              <Row>
                <Col style={style} breakPoint={{ xs: 12, lg: 4 }}>
                  <Button style={{ marginLeft: 30 }} onClick={() => openNewForm()} variant="contained" color="primary">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-plus-square"
                      viewBox="0 0 16 16"
                    >
                      <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
                      <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                    </svg>{' '}
                    &nbsp;Daftar Peminjaman Baru
                  </Button>
                </Col>
                <Col style={style} breakPoint={{ xs: 8, lg: 4 }}>
                  <Input fullWidth>
                    <input
                      type="text"
                      placeholder="Cari berdasarkan merek/model"
                      onChange={carimobilchange('keyword').bind(this)}
                      defaultValue={FormCari.keyword || ''}
                    />
                  </Input>
                </Col>
                <Col style={style} breakPoint={{ xs: 10, lg: 4 }}>
                  <Button style={{ marginLeft: 5 }} onClick={cariMobilSearch} variant="contained" color="secondary">
                    {' '}
                    &nbsp;Cari Mobil
                  </Button>
                </Col>
              </Row>
            </CardHeader>
            <CardBody>
              <Dialog open={OpenDelDil} onClose={handleCloseDelDil} aria-labelledby="form-dialog-title">
                <DialogContent>
                  <div style={{ fontSize: 24, marginBottom: 20 }}>Confirmation Delete</div>
                  Do you want to delete this item ?
                </DialogContent>
                <DialogActions>
                  <DangerButton onClick={delItem}>OK</DangerButton>
                  <Button onClick={handleCloseDelDil} color="primary">
                    close
                  </Button>
                </DialogActions>
              </Dialog>

              <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogContent>
                  <div style={{ fontSize: 24, marginBottom: 20 }}>
                    {IconSEtitle}
                    {DialogSEtitle}
                  </div>
                  <form autoComplete="off" onSubmit={(e) => saveUpdateData(e)}>
                    <TextField
                      required
                      type="date"
                      name="tgl_mulai"
                      minLength={3}
                      defaultValue={FormData.tgl_mulai || ''}
                      variant="outlined"
                      fullWidth
                      style={{ marginBottom: 20 }}
                      onChange={onFieldChange('tgl_mulai').bind(this)}
                    />
                    <TextField
                      required
                      type="date"
                      name="tgl_akhir"
                      minLength={3}
                      defaultValue={FormData.tgl_akhir || ''}
                      variant="outlined"
                      fullWidth
                      style={{ marginBottom: 20 }}
                      onChange={onFieldChange('tgl_akhir').bind(this)}
                    />
                    <NativeSelect
                      inputProps={{
                        name: 'name',
                        id: 'id',
                      }}
                      defaultValue={FormData.m_mobil}
                      required
                      fullWidth
                      onChange={onFieldChange('m_mobil').bind(this)}
                      style={{ marginBottom: 20 }}
                    >
                      {dataSelMobil}
                    </NativeSelect>
                    <Alert style={{ display: styleAlrt ? 'block' : 'none' }} status="Warning">
                      Mobil tidak tersedia pada tanggal itu
                    </Alert>

                    <Button type="submit" variant="contained" color="primary">
                      {BtnDilSE}
                    </Button>
                  </form>
                </DialogContent>
                <DialogActions>
                  <Button type="button" onClick={handleClose} color="primary">
                    Cancel
                  </Button>
                </DialogActions>
              </Dialog>

              <Dialog open={OpenDetailDil} onClose={handleCloseDetailDil} aria-labelledby="form-dialog-title">
                <DialogContent>
                  <div style={{ fontSize: 24, marginBottom: 20 }}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="currentColor"
                      className="bi bi-check2-square"
                      viewBox="0 0 16 16"
                    >
                      <path d="M3 14.5A1.5 1.5 0 0 1 1.5 13V3A1.5 1.5 0 0 1 3 1.5h8a.5.5 0 0 1 0 1H3a.5.5 0 0 0-.5.5v10a.5.5 0 0 0 .5.5h10a.5.5 0 0 0 .5-.5V8a.5.5 0 0 1 1 0v5a1.5 1.5 0 0 1-1.5 1.5H3z" />
                      <path d="m8.354 10.354 7-7a.5.5 0 0 0-.708-.708L8 9.293 5.354 6.646a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0z" />
                    </svg>{' '}
                    Detail Data Mobil
                  </div>
                  <TextField
                    label="Merk"
                    defaultValue={FormData.merk || ''}
                    name="merk"
                    variant="outlined"
                    fullWidth
                    style={{ marginBottom: 20 }}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                  <TextField
                    label="Model"
                    name="model"
                    defaultValue={FormData.Model || ''}
                    variant="outlined"
                    fullWidth
                    style={{ marginBottom: 20 }}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                  <TextField
                    label="No Plat"
                    name="no_plat"
                    defaultValue={FormData.no_plat || ''}
                    variant="outlined"
                    fullWidth
                    style={{ marginBottom: 20 }}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                  <TextField
                    name="Tarif"
                    label="Tarif / Jam"
                    defaultValue={FormData.tarif || ''}
                    variant="outlined"
                    fullWidth
                    style={{ marginBottom: 20 }}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                  <TextField
                    name="Sedia"
                    label="sedia"
                    defaultValue={FormData.sedia || ''}
                    variant="outlined"
                    fullWidth
                    style={{ marginBottom: 20 }}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleCloseDetailDil} color="primary">
                    close
                  </Button>
                </DialogActions>
              </Dialog>

              <Paper className={classes.root}>
                <TableContainer className={classes.container}>
                  <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                      <TableRow>
                        {columns.map((column) => (
                          <TableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth }}>
                            {column.label}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                        return (
                          <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                            {columns.map((column) => {
                              const value = row[column.id];
                              return (
                                <TableCell key={column.id} align={column.align}>
                                  {column.format && typeof value === 'number' ? column.format(value) : value}
                                </TableCell>
                              );
                            })}
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
                <TablePagination
                  rowsPerPageOptions={[10, 25, 100]}
                  component="div"
                  count={rows.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </Paper>
            </CardBody>
            <CardFooter>
              <LinearProgress style={ShowHideLin} />
            </CardFooter>
          </Card>
        </Col>
      </Row>
    </Layout>
  );
}
