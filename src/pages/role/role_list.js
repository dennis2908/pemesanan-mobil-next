import { Card, CardBody, CardHeader, CardFooter } from '@paljs/ui/Card';
import Row from '@paljs/ui/Row';
import Col from '@paljs/ui/Col';
import React from 'react';

import useStateRef from 'react-usestateref';
import Layout from 'Layouts';
import { storeLogin } from 'components/redux/storeLogin';
import Grid from '@material-ui/core/Grid';
import AddIcon from '@material-ui/icons/Add';
import CreateIcon from '@material-ui/icons/Create';
import ListIcon from '@material-ui/icons/List';
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
import Checkbox from '@material-ui/core/Checkbox';

import LinearProgress from '@material-ui/core/LinearProgress';

import { useRouter } from 'next/router';

const columns = [
  {
    id: 'btn',
    label: 'Action',
    minWidth: 300,
    align: 'center',
  },
  {
    id: 'btn_assign',
    label: 'Assign',
    minWidth: 300,
    align: 'center',
  },
  { id: 'role_name', label: 'Role Name', minWidth: 170 },
];

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
  container: {
    maxHeight: 440,
  },
});

export default function Role_list() {
  const [open, setOpen] = React.useState(false);

  const [rows, setrows] = React.useState([]);

  const [OpenDetailDil, setOpenDetailDil] = React.useState(false);

  const [OpenDelDil, setOpenDelDil] = React.useState(false);

  const [ShowHideLin, setShowHideLin] = React.useState({ display: 'block' });

  const [OpenAssignDil, setOpenAssignDil] = React.useState(false);

  const [FormData, setFormData] = React.useState({});

  const defRoleAss = { mbarang: false, mbarang: false, mcustomer: false, torder: false };
  const [FormCheckAssign, setFormCheckAssign] = React.useState(defRoleAss);

  const [FormAssign, setFormAssign] = React.useState({});

  const [BtnDilSE, setBtnDilSE] = React.useState({});

  const [DialogSEtitle, setDialogSEtitle] = useStateRef('New Data Role');

  const [IconSEtitle, setIconSEtitle] = React.useState(<AddIcon style={{ marginBottom: -4 }} color="primary" />);

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

  const onFieldChange = (fieldName) => {
    return function (event) {
      FormData[fieldName] = event.target.value;
      setFormData(FormData);
    };
  };

  React.useEffect(async () => {
    var roleAss = Object.assign({}, storeLogin.getState().authRoleAssign);
    let cekmrole = Object.values(roleAss).find((obj) => {
      return obj === 'mrole';
    });
    if (!cekmrole) router.push('/dashboard');

    loadData();
  }, []);
  const loadData = async (e) => {
    await DoShowLin();
    await fetch('http://127.0.0.1:8441/api/role', {
      method: 'GET',
      headers: { Authorization: 'Bearer ' + storeLogin.getState().authLogin },
    })
      .then((res) => res.json())
      .then((result) => {
        setrows(result.result);
      });
    await DoHideLin();
  };

  const DoShowLin = async (e) => {
    setShowHideLin({ display: 'block' });
  };

  const DoHideLin = async (e) => {
    setShowHideLin({ display: 'none' });
  };

  const delItem = async () => {
    await fetch('http://127.0.0.1:8441/api/role/' + FormData.id, {
      method: 'DELETE',
      headers: { Authorization: 'Bearer ' + storeLogin.getState().authLogin },
    })
      .then((res) => res.json())
      .then((result) => {
        loadData();
        handleCloseDelDil();
      });
  };

  const saveUpdateData = (e) => {
    e.preventDefault();
    if (typeof FormData.id === 'undefined') {
      fetch('http://127.0.0.1:8441/api/role', {
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
    } else {
      fetch('http://127.0.0.1:8441/api/role/' + FormData.id, {
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

  const UpdateAssign = (e) => {
    e.preventDefault();
    let role_assign = '';
    if (Object.keys(FormAssign).length > 0) {
      Object.entries(FormAssign).map(function (k, v) {
        if (k[1]) role_assign += k[1] + ',';
      });
      FormData.role_assign = role_assign.substring(0, role_assign.length - 1);
      fetch('http://127.0.0.1:8441/api/role/assign/' + FormData.id, {
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
          handleCloseAssignDil();
        });
    }
    e.preventDefault();
  };

  const handleClickOpen = (data) => {
    setOpen(true);
    setFormData(data);
    setDialogSEtitle('Edit Data Role');
    setIconSEtitle(<CreateIcon style={{ marginBottom: -4 }} color="primary" />);
    setBtnDilSE('Update');
  };

  const onAssignChange = (fieldName) => {
    return function (event) {
      if (event.target.checked) {
        FormAssign[fieldName] = fieldName;
      } else {
        FormAssign[fieldName] = '';
      }

      setFormAssign(FormAssign);
    };
  };

  const openNewForm = () => {
    setOpen(true);
    setFormData({});
    setIconSEtitle(<AddIcon style={{ marginBottom: -4 }} color="primary" />);
    setDialogSEtitle('New Data Role');
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

  const OpenAssignSE = async (data) => {
    let FrmCheckAssign = defRoleAss;
    if (data.role_assign != null) {
      let role_assign = data.role_assign.split(',');
      await role_assign.forEach((k, v) => {
        FrmCheckAssign[k] = true;
        FormAssign[k] = k;
      });
    }
    setFormData(data);
    setFormCheckAssign(FrmCheckAssign);
    setFormAssign(FormAssign);
    setOpenAssignDil(true);
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

  const handleCloseAssignDil = (data) => {
    setOpenAssignDil(false);
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

  let frmCheck = [];

  frmCheck.push(
    <Grid item xs={10}>
      <TextField
        defaultValue={'Master Role'}
        variant="outlined"
        fullWidth
        style={{ marginBottom: 20 }}
        InputProps={{
          readOnly: true,
        }}
      />
    </Grid>,
  );

  if (FormCheckAssign.mrole === true) {
    frmCheck.push(
      <Grid item xs={2}>
        <Checkbox
          defaultChecked
          key={String('mrole')}
          onClick={onAssignChange('mrole').bind(this)}
          name="mrole"
          inputProps={{ 'aria-label': 'controlled-checkbox' }}
        />
      </Grid>,
    );
  } else {
    frmCheck.push(
      <Grid item xs={2}>
        <Checkbox
          key={String('mrole')}
          onClick={onAssignChange('mrole').bind(this)}
          name="mrole"
          inputProps={{ 'aria-label': 'controlled-checkbox' }}
        />
      </Grid>,
    );
  }

  frmCheck.push(
    <Grid item xs={10}>
      <TextField
        defaultValue={'Manajemen Mobil'}
        variant="outlined"
        fullWidth
        style={{ marginBottom: 20 }}
        InputProps={{
          readOnly: true,
        }}
      />
    </Grid>,
  );

  if (FormCheckAssign.mmanajemen === true) {
    frmCheck.push(
      <Grid item xs={2}>
        <Checkbox
          defaultChecked
          key={String('mmanajemen')}
          onClick={onAssignChange('mmanajemen').bind(this)}
          name="mmanajemen"
          inputProps={{ 'aria-label': 'controlled-checkbox' }}
        />
      </Grid>,
    );
  } else {
    frmCheck.push(
      <Grid item xs={2}>
        <Checkbox
          key={String('mmanajemen')}
          onClick={onAssignChange('mmanajemen').bind(this)}
          name="mmanajemen"
          inputProps={{ 'aria-label': 'controlled-checkbox' }}
        />
      </Grid>,
    );
  }

  frmCheck.push(
    <Grid item xs={10}>
      <TextField
        defaultValue={'Peminjaman'}
        variant="outlined"
        fullWidth
        style={{ marginBottom: 20 }}
        InputProps={{
          readOnly: true,
        }}
      />
    </Grid>,
  );

  if (FormCheckAssign.mminjam === true) {
    frmCheck.push(
      <Grid item xs={2}>
        <Checkbox
          defaultChecked
          key={String('mminjam')}
          onClick={onAssignChange('mminjam').bind(this)}
          name="mminjam"
          inputProps={{ 'aria-label': 'controlled-checkbox' }}
        />
      </Grid>,
    );
  } else {
    frmCheck.push(
      <Grid item xs={2}>
        <Checkbox
          key={String('mminjam')}
          onClick={onAssignChange('mminjam').bind(this)}
          name="mminjam"
          inputProps={{ 'aria-label': 'controlled-checkbox' }}
        />
      </Grid>,
    );
  }

  frmCheck.push(
    <Grid item xs={10}>
      <TextField
        defaultValue={'Pengembalian'}
        variant="outlined"
        fullWidth
        style={{ marginBottom: 20 }}
        InputProps={{
          readOnly: true,
        }}
      />
    </Grid>,
  );

  if (FormCheckAssign.mkembali === true) {
    frmCheck.push(
      <Grid item xs={2}>
        <Checkbox
          defaultChecked
          key={String('mkembali')}
          onClick={onAssignChange('mkembali').bind(this)}
          name="mkembali"
          inputProps={{ 'aria-label': 'controlled-checkbox' }}
        />
      </Grid>,
    );
  } else {
    frmCheck.push(
      <Grid item xs={2}>
        <Checkbox
          key={String('mkembali')}
          onClick={onAssignChange('mkembali').bind(this)}
          name="mkembali"
          inputProps={{ 'aria-label': 'controlled-checkbox' }}
        />
      </Grid>,
    );
  }

  return (
    <Layout title="List Role">
      <Row>
        <Col breakPoint={{ xs: 24, md: 12 }}>
          <Card status="Primary" accent="Info">
            <CardHeader>
              <ListIcon style={{ marginBottom: -7 }} color="primary" /> DATA ROLE{' '}
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
                &nbsp;Add Data
              </Button>
            </CardHeader>
            <CardBody>
              <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogContent>
                  <div style={{ fontSize: 24, marginBottom: 20 }}>
                    {IconSEtitle}
                    {DialogSEtitle}
                  </div>
                  <form autoComplete="off" onSubmit={(e) => saveUpdateData(e)}>
                    <TextField
                      required
                      label="Role Name"
                      defaultValue={FormData.role_name || ''}
                      name="role_name"
                      variant="outlined"
                      fullWidth
                      style={{ marginBottom: 20 }}
                      onChange={onFieldChange('role_name').bind(this)}
                    />
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
                    Detail Data Role
                  </div>
                  <TextField
                    label="Role Name"
                    defaultValue={FormData.role_name || ''}
                    name="role_name"
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

              <Dialog open={OpenAssignDil} onClose={handleCloseAssignDil} aria-labelledby="form-dialog-title">
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
                    Assign To Role
                  </div>
                  <form autoComplete="off" onSubmit={(e) => UpdateAssign(e)}>
                    <Grid container spacing={3} key={String('gridrole')}>
                      {frmCheck}
                    </Grid>
                    <Button type="submit" variant="contained" color="primary">
                      Update
                    </Button>
                  </form>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleCloseAssignDil} color="primary">
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
                          <TableCell
                            key={String(column.id) + String('mpmp')}
                            align={column.align}
                            style={{ minWidth: column.minWidth }}
                          >
                            {column.label}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                        return (
                          <TableRow hover role="checkbox" tabIndex={-1} key={String(row.id) + String('kkkkk')}>
                            {columns.map((column) => {
                              if (column.id === 'btn') {
                                return (
                                  <TableCell key={String(column.id) + String('DDDD')} align={column.align}>
                                    <Button
                                      style={{ marginRight: 10 }}
                                      variant="contained"
                                      color="inherit"
                                      onClick={() => OpenDetailSE(row)}
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        fill="currentColor"
                                        className="bi bi-box-arrow-up-right"
                                        viewBox="0 0 16 16"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5z"
                                        />
                                        <path
                                          fillRule="evenodd"
                                          d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0v-5z"
                                        />
                                      </svg>
                                      &nbsp; Detail
                                    </Button>
                                    <Button
                                      variant="contained"
                                      style={{ marginRight: 10 }}
                                      color="secondary"
                                      onClick={() => handleClickOpen(row)}
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        fill="currentColor"
                                        className="bi bi-pencil-square"
                                        viewBox="0 0 16 16"
                                      >
                                        <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                        <path
                                          fillRule="evenodd"
                                          d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"
                                        />
                                      </svg>
                                      &nbsp; Edit
                                    </Button>
                                    <DangerButton variant="contained" onClick={() => OpenDeleteSE(row)}>
                                      <svg
                                        width="16"
                                        height="16"
                                        fill="currentColor"
                                        className="bi bi-trash-fill"
                                        viewBox="0 0 16 16"
                                      >
                                        <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z" />
                                      </svg>
                                      &nbsp; Delete
                                    </DangerButton>
                                  </TableCell>
                                );
                              } else if (column.id === 'btn_assign') {
                                return (
                                  <TableCell key={String(column.id) + String('DDDD')} align={column.align}>
                                    <Button
                                      style={{ marginRight: 10 }}
                                      variant="contained"
                                      color="inherit"
                                      onClick={() => OpenAssignSE(row)}
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        fill="currentColor"
                                        className="bi bi-box-arrow-up-right"
                                        viewBox="0 0 16 16"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5z"
                                        />
                                        <path
                                          fillRule="evenodd"
                                          d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0v-5z"
                                        />
                                      </svg>
                                      &nbsp; Assign
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
