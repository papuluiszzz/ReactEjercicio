/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';
import type {GridColDef} from '@mui/x-data-grid';
import dinamicTable from '../components/dinamicTable';
import Grid from '@mui/material/Grid';
import { data } from 'react-router-dom';
import DinamicTable from '../components/dinamicTable';


interface Users{

    id: number | null;
    idUsuario:number|null;
    nombre:string;
    apellido:string;
    email:string;
}


const Inicio = ()=>{
    const [dataUsers, setDataUsers] = React.useState<Users[]>([])

    React.useEffect(()=>{
        fetch('http://localhost:8000/usuarios')
        .then(response => response.json())
        .then(dataResponse => setDataUsers(dataResponse.data.map((row: {idUsuario:any})=>({...row,id:row.idUsuario}))))
        .catch(error => console.error('Error al obtener datos',error))

    },[]);

    const columns: GridColDef[] = [

        {field:"idUsuario",headerName:"#",width:70},
        {field:"nombre",headerName:"Nombres",width:146},
        {field:"apellido",headerName:"Apellidos",width:146},
        {field:"email",headerName:"email",width:200},

    ]

    const handleEdit = (row:Users)=>{
        console.log(row)
    }

    const handreDelete =(id:number)=>{
        console.log(id)
    }

    return(
        <>
        
           <Grid container spacing={2} marginTop={5}>
                <Grid size={10}>

                    <DinamicTable rows={dataUsers} colums={columns} onEdit={handleEdit} onDelete={handreDelete} />

                </Grid>
           </Grid>


        </>
    )
}

export default Inicio;