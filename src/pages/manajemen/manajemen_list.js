import { Card, CardBody, CardHeader, CardFooter } from '@paljs/ui/Card';
import Row from '@paljs/ui/Row';
import Col from '@paljs/ui/Col';
import React from 'react';

import Alert from '@paljs/ui/Alert';

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
  { id: 'merk', label: 'Merk', minWidth: 200 },
  { id: 'model', label: 'Model', minWidth: 200 },
  { id: 'no_plat', label: 'No Plat', minWidth: 200 },
  { id: 'tarif', label: 'Tarif/Hari', minWidth: 200 },
  { id: 'sedia', label: 'Hari ini Tersedia', minWidth: 200 },
];

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
  container: {
    maxHeight: 440,
  },
});

export default function Manajemen_list() {
  const style = { marginBottom: '1.5rem' };
  const [open, setOpen] = React.useState(false);

  const [styleAlrt, setStyleAlrt] = React.useState(false);

  const [rows, setrows] = React.useState([]);

  const [FormCari, setFormCari] = React.useState({});

  const Input = styled(InputGroup)`
    margin-bottom: 10px;
  `;

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
    var mmanajemen = Object.assign({}, storeLogin.getState().authRoleAssign);
    let cekmmanajemen = Object.values(mmanajemen).find((obj) => {
      return obj === 'mmanajemen';
    });
    if (!cekmmanajemen) router.push('/dashboard');

    await loadData();
  }, []);
  const loadData = async (e) => {
    await DoShowLin();
    await fetch('http://127.0.0.1:8441/api/manajemen', {
      method: 'GET',
      headers: { Authorization: 'Bearer ' + storeLogin.getState().authLogin },
    })
      .then((res) => res.json())
      .then((result) => {
        if (Object.keys(result.result).length > 0) {
          const filtered = result.result.filter((x) => (x.tgl_mulai === null ? (x.sedia = 'Ya') : (x.sedia = 'Tidak')));
          setrows(filtered);
        }
      });
    await DoHideLin();
  };

  const cariMobil = async () => {
    await DoShowLin();
    console.log(FormCari);
    await fetch('http://127.0.0.1:8441/api/manajemen/cariMobil', {
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
          const filtered = result.result.filter((x) => (x.tgl_mulai === null ? (x.sedia = 'Ya') : (x.sedia = 'Tidak')));
          setrows(filtered);
        }
      });
    await DoHideLin();
  };

  const saveUpdateData = async (e) => {
    e.preventDefault();
    let no_plat = await fetch('http://127.0.0.1:8441/api/manajemen/cekplat/' + FormData.no_plat, {
      method: 'GET',
      headers: { Authorization: 'Bearer ' + storeLogin.getState().authLogin },
    })
      .then((response) => response.json())
      .then((response) => {
        return response.result;
      });

    if (no_plat === null)
      fetch('http://127.0.0.1:8441/api/manajemen', {
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
    e.preventDefault();
  };

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
    setOpen(true);
    setFormData({});
    setIconSEtitle(<AddIcon style={{ marginBottom: -4 }} color="primary" />);
    setDialogSEtitle('Daftar Mobil Baru');
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
    <Layout title="Manajemen Mobil">
      <Row>
        <Col breakPoint={{ xs: 24, md: 12 }}>
          <Card status="Primary" accent="Info">
            <CardHeader>
              <Row style={style} breakPoint={{ xs: 12, lg: 4 }}>
                <ListIcon style={{ marginBottom: -7 }} color="primary" />
                Manajemen Mobil
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
                    &nbsp;Daftar Mobil Baru
                  </Button>
                </Col>
                <Col style={style} breakPoint={{ xs: 8, lg: 4 }}>
                  <Input fullWidth>
                    <input
                      type="text"
                      placeholder="Cari berdasarkan merek/model/ketersediaan"
                      onChange={carimobilchange('keyword').bind(this)}
                      defaultValue={FormCari.keyword || ''}
                    />
                  </Input>
                </Col>
                <Col style={style} breakPoint={{ xs: 10, lg: 4 }}>
                  <Button style={{ marginLeft: 5 }} onClick={cariMobil} variant="contained" color="secondary">
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
                      type="text"
                      label="Merk"
                      name="merk"
                      minLength={3}
                      defaultValue={FormData.merk || ''}
                      variant="outlined"
                      fullWidth
                      style={{ marginBottom: 20 }}
                      onChange={onFieldChange('merk').bind(this)}
                    />
                    <TextField
                      required
                      label="Model"
                      name="model"
                      minLength={3}
                      defaultValue={FormData.model || ''}
                      variant="outlined"
                      fullWidth
                      style={{ marginBottom: 20 }}
                      onChange={onFieldChange('model').bind(this)}
                    />
                    <TextField
                      required
                      label="No Plat"
                      name="no_plat"
                      minLength={3}
                      defaultValue={FormData.no_plat || ''}
                      variant="outlined"
                      fullWidth
                      style={{ marginBottom: 20 }}
                      onChange={onFieldChange('no_plat').bind(this)}
                    />
                    <TextField
                      required
                      type="number"
                      label="Tarif/Hari"
                      name="tarif"
                      defaultValue={FormData.tarif || ''}
                      variant="outlined"
                      fullWidth
                      style={{ marginBottom: 20 }}
                      onChange={onFieldChange('tarif').bind(this)}
                    />
                    <Alert style={{ display: styleAlrt ? 'block' : 'none' }} status="Warning">
                      No Plat sudah ada di sistem
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
