import React, {useState} from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import XLSX from 'xlsx';

import {columns} from "./columns";
import {SheetJSFT} from './types';

function App() {
  const [employee,
    setEmployee] = useState([]);

  const [myfile,
    setMyFile] = useState({});

  function handleChange(e) {
    const files = e.target.files;
    if (files && files[0]) 
      setMyFile(files[0]);
    };
  
  function handleFile() {
    const reader = new FileReader();
    const rABS = !!reader.readAsBinaryString;

    reader.onload = (e) => {
      /* Parse data */
      const bstr = e.target.result;
      const wb = XLSX.read(bstr, {
        type: rABS
          ? 'binary'
          : 'array',
        bookVBA: true
      });
      /* Get first worksheet */
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      /* Convert array of arrays */
      const data = XLSX
        .utils
        .sheet_to_json(ws);
      /* Update state */
      setEmployee(data);
    };

    if (rABS) {
      reader.readAsBinaryString(myfile);
    } else {
      reader.readAsArrayBuffer(myfile);
    };
  }
  return (
    <div className="container" style={{
      marginTop: 10
    }}>
      <label htmlFor="file">
        Upload an excel to Display in Table
      </label>
      <br/>
      <input
        type="file"
        className="form-control-file border"
        id="file"
        accept={SheetJSFT}
        onChange={handleChange}/>
      <br/>
      <input
        type="Submit"
        className="btn btn-primary"
        onClick={handleFile}
        value="Submit"/>
      <BootstrapTable
        striped
        hover
        keyField='empId'
        data={employee}
        columns={columns}/>
    </div>
  );
}

export default App;
