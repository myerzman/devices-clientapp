import React, { useState } from 'react';
import MenuItem from '@mui/material/MenuItem';

import InputLabel from '@mui/material/InputLabel';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import styles from './DeviceForm.module.scss';

const DeviceForm = ({ handleClose, selectedRow, onSubmit }) => {
  const [submitted, setSubmitted] = useState(false);
  const [valid, setValid] = useState(false);
  const [errorMessage, setErrorMessage] = useState(undefined);
  const [values, setValues] = useState({
    system_name: selectedRow ? selectedRow.system_name : '',
    hdd_capacity: selectedRow ? selectedRow.hdd_capacity : '',
    type: selectedRow ? selectedRow.type : '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);

    if (values.system_name && values.hdd_capacity && values.type) {
      if (values.hdd_capacity > 0) {
        setValid(true);
        console.log('form is valid', valid);
        setErrorMessage(undefined);
        console.log('submitted:', selectedRow);
        if (selectedRow !== undefined) {
          values.id = selectedRow.id;
          console.log('found props ID in edit');
        }

        onSubmit(values);
      } else {
        setValid(false);
        setErrorMessage(' HD cannot be negative.');
      }
    }
  };

  const onSystemChange = (event) => {
    //https://deepscan.io/docs/rules/react-missing-event-persist
    event.persist();
    setValues((values) => ({
      ...values,
      system_name: event.target.value,
    }));
  };

  const onHddChange = (event) => {
    event.persist();
    setValues((values) => ({
      ...values,
      hdd_capacity: event.target.value,
    }));
  };

  const onTypeChange = (event) => {
    //event.persist();
    setValues((values) => ({
      ...values,
      type: event.target.value,
    }));
  };

  return (
    <>
      <InputLabel id="system-label">System Name</InputLabel>
      <TextField
        type="text"
        placeholder="System Name"
        value={values.system_name}
        onChange={onSystemChange}
        className={styles.formItem}
        size="small"
      />

      {submitted && !values.system_name && (
        <span className="error" id="first-name-error">
          Please enter a system name.
        </span>
      )}

      <InputLabel id="type-label">Type</InputLabel>

      <TextField
        select
        // labelId="type-label"
        id="demo-simple-select"
        value={values.type}
        // label="Type"
        onChange={onTypeChange}
        className={styles.formItem}
        size="small"
      >
        <MenuItem value="WINDOWS_WORKSTATION">Windows Workstation</MenuItem>
        <MenuItem value="WINDOWS_SERVER">Windows Server</MenuItem>
        <MenuItem value="MAC">MAC</MenuItem>
      </TextField>

      {submitted && !values.type && (
        <span className="error" id="first-name-error">
          Please select a type.
        </span>
      )}

      <InputLabel id="hd-label">HDD Capacity (GB)</InputLabel>

      <TextField
        type="number"
        placeholder="HDD Capacity (GB)"
        value={values.hdd_capacity}
        onChange={onHddChange}
        className={styles.formItem}
        size="small"
      />

      {submitted && !values.hdd_capacity && (
        <span className="error" id="first-name-error">
          Please set HDD Capacity.
        </span>
      )}

      {errorMessage && <span className="error">{errorMessage}</span>}

      <DialogActions>
        <Button onClick={handleClose} className="button">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" className="button">
          Save Device
        </Button>
      </DialogActions>
    </>
  );
};

export default DeviceForm;
