import React, { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid'
import MaterialTable from "material-table";
import Alert from '@material-ui/lab/Alert';
import Layout from "./Layout";
import {tableIconsConst as tableIcons} from "./constants";
import {apiTutorConst as apiTutor} from "./constants";

function validateEmail(email){
  const re = /^((?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\]))$/;
  return re.test(String(email).toLowerCase());
}

function Tutor() {

  var columns = [
    {title: "id", field: "id", hidden: true},
    {title: "Nome", field: "nome"},
    {title: "Sobrenome", field: "sobre_nome"},
    {title: "Email", field: "email"  },
  ]

  const [data, setData] = useState([]); //table data
  //for error handling
  const [iserror, setIserror] = useState(false)
  const [errorMessages, setErrorMessages] = useState([])

  useEffect(() => { 
    apiTutor.get("/tutores")
        .then(res => {               
            setData(res.data.tutores)
         })
         .catch(error=>{
             console.log("Error")
         })
  }, [])

  //método para alterar uma linha da tabela
  const handleRowUpdate = (newData, oldData, resolve) => {
    //validation
    let errorList = []
    if(newData.nome === undefined){
      errorList.push("Por favor, entre o nome do tutor.")
    }
    if(newData.sobre_nome === undefined){
      errorList.push("Por favor, entre o peso do tutor.")
    }
    if(newData.email === undefined || validateEmail(newData.email) === false){
      errorList.push("Please enter a valid email")
    }

    if(errorList.length < 1){
      apiTutor.put("/tutor?id="+newData.id, newData)
      .then(res => {
        const dataUpdate = [...data];
        const index = oldData.tableData.id;
        dataUpdate[index] = newData;
        setData([...dataUpdate]);
        resolve()
        setIserror(false)
        setErrorMessages([])
      })
      .catch(error => {
        setErrorMessages(["Update failed! Server error"])
        setIserror(true)
        resolve()
        
      })
    }else{
      setErrorMessages(errorList)
      setIserror(true)
      resolve()

    }
  }

  //método para adicionar uma linha da tabela
  const handleRowAdd = (newData, resolve) => {
    //validation
    let errorList = []
    if(newData.nome === undefined){
      errorList.push("Por favor, entre o nome do tutor.")
    }
    if(newData.sobre_nome === undefined){
      errorList.push("Por favor, entre o peso do tutor.")
    }

    if(errorList.length < 1){ //no error
      apiTutor.post("/tutor", newData)
      .then(res => {
        let dataToAdd = [...data];
        dataToAdd.push(res.data);
        setData(dataToAdd);
        resolve()
        setErrorMessages([])
        setIserror(false)
      })
      .catch(function (error) {
        let errorMessage = "Cannot add data. Server error!";
        if (error.response.data.message != null) {
          errorMessage = error.response.data.message;
        }
        setErrorMessages([errorMessage])
        setIserror(true)
        resolve()
      })
    }else{
      setErrorMessages(errorList)
      setIserror(true)
      resolve()
    }
  }

  //método para deletar uma linha da tabela
  const handleRowDelete = (oldData, resolve) => {
    
    apiTutor.delete("/tutor?id="+oldData.id)
      .then(res => {
        const dataDelete = [...data];
        const index = oldData.tableData.id;
        dataDelete.splice(index, 1);
        setData([...dataDelete]);
        resolve()
      })
      .catch(error => {
        setErrorMessages(["Erro no servidor."])
        setIserror(true)
        resolve()
      })
  }

  return (
    <div className="Tutor">
      <Layout />
      <Grid container spacing={1}>
          <Grid item xs={3}></Grid>
          <Grid item xs={6}>
          <div>
            {iserror && 
              <Alert severity="error">
                  {errorMessages.map((msg, i) => {
                      return <div key={i}>{msg}</div>
                  })}
              </Alert>
            }       
          </div>
            <MaterialTable
            localization={{
              toolbar: {
                  searchPlaceholder: 'Busca'
              }
              }}
              title="Lista de Tutores"
              columns={columns}
              data={data}
              icons={tableIcons}
              editable={{
                onRowUpdate: (newData, oldData) =>
                  new Promise((resolve) => {
                      handleRowUpdate(newData, oldData, resolve);
                      
                  }),
                onRowAdd: (newData) =>
                  new Promise((resolve) => {
                    handleRowAdd(newData, resolve)
                  }),
                onRowDelete: (oldData) =>
                  new Promise((resolve) => {
                    handleRowDelete(oldData, resolve)
                  }),
              }}
            />
          </Grid>
          <Grid item xs={3}></Grid>
        </Grid>
    </div>
  );
}

export default Tutor;