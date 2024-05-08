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

import { RedisConfig } from '../../redis/redis';

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
  {
    id: 'arr_tgl',
    label: 'Aksi',
    minWidth: 380,
    align: 'center',
  },
  { id: 'ket_mobil', label: 'Merk Mobil Plat', minWidth: 200 },
  { id: 'tgl_mulai', label: 'Tgl Mulai Pinjam', minWidth: 200 },
  { id: 'tgl_akhir', label: 'Tgl Akhir Pinjam', minWidth: 200 },
  { id: 'nama', label: 'Peminjam', minWidth: 200 },
  { id: 'h_sewa', label: 'Biaya Sewa', minWidth: 200, align: 'right' },
];

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
  container: {
    maxHeight: 440,
  },
});

export default function Kembali_list() {
  const style = { marginBottom: '1.5rem' };
  const [open, setOpen] = React.useState(false);

  const [nowDate, setNowDate] = React.useState('');

  const [styleAlrt, setStyleAlrt] = React.useState(false);

  const [rows, setrows] = React.useState([]);

  const [FormCari, setFormCari] = React.useState({});

  const [selmobil, setselmobil] = React.useState([]);

  const Input = styled(InputGroup)`
    margin-bottom: 10px;
  `;

  const Label = styled.span`
    display: flex;
    align-items: center;
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

  const cariMobilSearch = async () => {
    await DoShowLin();
    await fetch('http://127.0.0.1:8441/api/kembali/cariMobil', {
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
      .then(async (result) => {
        await setNowDate(result.now);
        if (Object.keys(result.result).length > 0) {
          const filtered = result.result.filter((x) => {
            x.ket_mobil = x.merk + '-' + x.model + '-' + x.no_plat;
            x.arr_tgl = { tgl_akhir: x.tgl_akhir, tgl_kembali_pinjam: x.tgl_kembali_pinjam };
            return x;
          });
          setrows(filtered);
        }
      });
    await DoHideLin();
  };

  const handleKembalikan = async (data) => {
    await DoShowLin();
    await fetch('http://127.0.0.1:8441/api/kembali/', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Headers': '*',
        Authorization: 'Bearer ' + storeLogin.getState().authLogin,
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then(async () => {
        await loadData();
        await cariMobil();
      });
    await DoHideLin();
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
    const redis = RedisConfig();
    const res = await redis.get(storeLogin.getState().authLogin);
    var mmanajemen = Object.assign({}, res.authRoleAssign.split(','));
    let cekmmanajemen = Object.values(mmanajemen).find((obj) => {
      return obj === 'mminjam';
    });
    if (!cekmmanajemen) router.push('/dashboard');

    await loadData();
    await cariMobil();
  }, []);
  const loadData = async (e) => {
    await DoShowLin();
    await fetch('http://127.0.0.1:8441/api/kembali', {
      method: 'GET',
      headers: { Authorization: 'Bearer ' + storeLogin.getState().authLogin },
    })
      .then((res) => res.json())
      .then(async (result) => {
        setNowDate(result.now);
        if (Object.keys(result.result).length > 0) {
          const filtered = result.result.filter((x) => {
            const diffInMs = new Date(x.tgl_akhir) - new Date(x.tgl_mulai);
            const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
            x.h_sewa = parseInt(diffInDays + 1) * parseInt(x.tarif);
            x.ket_mobil = x.merk + '-' + x.model + '-' + x.no_plat;
            x.arr_tgl = { tgl_akhir: x.tgl_akhir, tgl_kembali_pinjam: x.tgl_kembali_pinjam };

            return x;
          });
          console.log(1111, filtered);
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
    <Layout title="Pengembalian Mobil">
      <Row>
        <Col breakPoint={{ xs: 24, md: 12 }}>
          <Card status="Primary" accent="Info">
            <CardHeader>
              <Row style={style} breakPoint={{ xs: 12, lg: 4 }}>
                <ListIcon style={{ marginBottom: -7 }} color="primary" />
                Kembalikan Mobil
              </Row>
              <Row>
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
                              if (column.id === 'arr_tgl') {
                                // console.log(111, Date(row[column.id].tgl_akhir));
                                var d1 = new Date(row[column.id].tgl_akhir);
                                var d2 = new Date(nowDate);
                                if (row[column.id].tgl_kembali_pinjam === null && d1.getTime() < d2.getTime())
                                  return (
                                    <TableCell key={column.id} align={column.align}>
                                      <Button
                                        onClick={() => handleKembalikan(row)}
                                        style={{ marginLeft: 5 }}
                                        variant="contained"
                                        color="primary"
                                      >
                                        {' '}
                                        &nbsp;Kembalikan
                                      </Button>
                                    </TableCell>
                                  );
                                else if (row[column.id].tgl_kembali_pinjam !== null)
                                  return (
                                    <TableCell key={column.id} align={column.align}>
                                      <Button status="Success" type="button" shape="Rectangle" disabled>
                                        Mobil Sudah Dikembalikan
                                      </Button>
                                    </TableCell>
                                  );
                                else
                                  return (
                                    <TableCell key={column.id} align={column.align}>
                                      <Button status="Success" type="button" shape="Rectangle" disabled>
                                        Mobil Sedang Dalam Proses Peminjaman
                                      </Button>
                                    </TableCell>
                                  );
                              } else {
                                const value = row[column.id];
                                return (
                                  <TableCell key={column.id} align={column.align}>
                                    {column.format && typeof value === 'number' ? column.format(value) : value}
                                  </TableCell>
                                );
                              }
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
