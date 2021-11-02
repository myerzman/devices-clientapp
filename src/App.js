import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import numeral from 'numeral';

import BasicTable from './components/BasicTable';
import DeviceForm from './components/DeviceForm';
import Dialog from '@mui/material/Dialog';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { ThemeProvider } from '@mui/material/styles';

import { muiNinjaTheme } from './css/muiNInjaTheme.js';
import './css/ninjaTheme.scss';

function App() {
  // Global Config
  const serverURL = 'http://localhost:3000';
  //General State
  const [devices, setDevices] = useState(undefined);
  const [selectedRow, setSelectedRow] = useState(undefined);
  // Modal State
  const [open, setOpen] = React.useState(false);
  const [error, setError] = React.useState(false);

  useEffect(() => {
    (async () => {
      console.log('lets fetch some devices.');
      const query = `${serverURL}/devices`;
      const result = await axios(query);
      console.log('get some devices:', result.data);
      setDevices(result.data);
    })().catch((err) => {
      console.log(`Oops! Error fetching devices ${err}`);
      setError(true);
    });
    console.log(devices);
    console.log('running use effect');
    // eslint-disable-next-line
  }, []);

  // Modal Functions
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setSelectedRow(undefined);
  };

  // CRUD Functions
  const handleEdit = (data) => {
    console.log('editing', data);
    setSelectedRow(data);
    handleOpen();
  };

  const handleDelete = (id) => {
    console.log('devices in delete', devices);
    console.log('delete', id);
    (async () => {
      console.log('lets delete this device.', id);
      const query = `${serverURL}/devices/${id}`;
      const result = await axios.delete(query);
      console.log('delete device result:', result.data);

      setDevices(devices.filter((item) => item.id !== id));
    })().catch((err) => {
      console.log(`Oops! Error delete device ${err}`);
    });
  };

  const handleSubmit = (event) => {
    console.log('submitted in parent', event);
    // check if ID exist
    if (event.hasOwnProperty('id')) {
      //exists, get the index
      let index = devices.findIndex((x) => x.id === event.id);
      console.log('id found, update object', index);
      const newArray = [...devices];
      newArray[index] = event;
      // put device to server
      (async () => {
        console.log('lets put this device.', event);
        const query = `${serverURL}/devices/${event.id}`;
        const result = await axios.put(query, event);
        console.log('put device result:', result.data);
        setDevices(newArray);
      })().catch((err) => {
        console.log(`Oops! Error updating device ${err}`);
      });
    } else {
      // Adding New Device - Id doesn't exist
      (async () => {
        console.log('lets post device.', event);
        const query = `${serverURL}/devices`;
        const result = await axios.post(query, event);
        console.log('post device result:', result.data);
        event.id = result.data.id;
        setDevices((oldArray) => [...oldArray, event]);
      })().catch((err) => {
        console.log(`Oops! Error posting device ${err}`);
      });
    }
    handleClose();
  };

  // Data columns to display
  const columns = useMemo(
    () => [
      {
        Header: 'System Name',
        accessor: 'system_name',
        Cell: (props) => (
          <div>
            {props.value}
            <span className="mobileOnly">{props.row.original.type}</span>
          </div>
        ),
      },
      {
        Header: 'Type',
        accessor: 'type',
      },
      {
        Header: 'HDD Capacity',
        accessor: 'hdd_capacity',
        Cell: (props) => numeral(props.value).format('(0,0)'),
      },
    ],
    []
  );

  return (
    <ThemeProvider theme={muiNinjaTheme}>
      <div className="App">
        <header className="App-header">
          <h1>NinjaOne Devices</h1>
        </header>
        <Container component="section" maxWidth="lg" className="container">
          <Grid container spacing={2}>
            <Grid item xs={12} sm={10} md={10} lg={10} xl={10}></Grid>
            <Grid item xs={12} sm={2} md={2} lg={2} xl={2} className="buttonWrapper">
              {!error && (
                <Button onClick={handleOpen} variant="contained" color="primary">
                  Add Device
                </Button>
              )}
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              {devices && (
                <BasicTable
                  columns={columns}
                  data={devices}
                  handleDelete={handleDelete}
                  handleEdit={handleEdit}
                  modalOpen={open}
                />
              )}
            </Grid>
          </Grid>

          {error && (
            <Alert severity="warning">Problem fetching data! Check server connection</Alert>
          )}
        </Container>
      </div>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Device Form</DialogTitle>
        <DialogContent>
          <DeviceForm onSubmit={handleSubmit} handleClose={handleClose} selectedRow={selectedRow} />
        </DialogContent>
      </Dialog>
    </ThemeProvider>
  );
}

export default App;
