import React, { useState, useEffect } from 'react';
import Avatar from 'react-avatar';
import Grid from '@material-ui/core/Grid'
import MaterialTable from "material-table";
import axios from 'axios'
import Alert from '@material-ui/lab/Alert';
import Layout from './Layout';
import {tableIconsConst as tableIcons} from "./constants";
import {apiPetConst as apiPet} from "./constants";
import {apiDogCeoConst as apiDogCeo} from "./constants";

function Pets() {
  const [dataDogs, setDataDogs] = useState([]); //storage para a lista de raças

  useEffect(() => { 
    apiDogCeo.get("/breeds/list/all")
        .then(res => {               
          console.log(dataDogs);
          let breedsList = [];
          for (var key in res.data.message) {
            breedsList.push(key);
          }

            setDataDogs(breedsList)
         })
         .catch(error=>{
             console.log("Error")
         })
  }, [])

  var columns = [
    {title: "id", field: "id", hidden: true},
    {title: "NEM", render: rowData => <Avatar maxInitials={1} size={40} round={true} name={rowData === undefined ? " " : rowData.nem} />  },
    {title: "Nome", field: "nome"},
    {title: "Peso", field: "peso"},
    {
      title: "Raça",
      field: "raca",
      editComponent: ({ value, onChange }) => (
        <select onChange={(e) => onChange(e.target.value)}>
          <option selected value={value}>
            {value}
          </option>
          {dataDogs.map(
            (item) =>
              item !== value && (
                <option key={item} value={item}>
                  {item}
                </option>
              )
          )}
        </select>
      )
    }
  ]

  const [data, setData] = useState([]); //table data
  //for error handling
  const [iserror, setIserror] = useState(false)
  const [errorMessages, setErrorMessages] = useState([])

  useEffect(() => { 
    apiPet.get("/dogs")
        .then(res => {               
            setData(res.data.dogs)
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
      errorList.push("Por favor, entre o nome do cão.")
    }
    if(newData.peso === undefined){
      errorList.push("Por favor, entre o peso do cão.")
    }
    
    if(errorList.length < 1){
      apiPet.put("/dog?id="+newData.id, newData)
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
      errorList.push("Por favor, entre o nome do cão.")
    }
    if(newData.peso === undefined){
      errorList.push("Por favor, entre o peso do cão.")
    }

    if(errorList.length < 1){ //no error
      apiPet.post("/dog", newData)
      .then(res => {
        let dataToAdd = [...data];
        dataToAdd.push(res.data);
        setData(dataToAdd);
        resolve()
        setErrorMessages([])
        setIserror(false)
      })
      .catch(error => {
        setErrorMessages(["Cannot add data. Server error!"])
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
    
    apiPet.delete("/dog?id="+oldData.id)
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
              title="Lista de Pets"
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

export default Pets;