import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import axios from '../../axios/axios'
import { useNavigate } from 'react-router-dom';
import { Button, Switch } from '@mui/material';
import io from 'socket.io-client';


export default function UserTable() {
    const socket = io(process.env.REACT_APP_SERVER_URL)
    const navigate=useNavigate()
    const [rows,setRows] = React.useState([])
    const [loading, setLoading] = React.useState(true)

    
    React.useEffect(()=>{
        const rowData=[]
        axios.get('/users').then(res=>{
            if(res.data){
                if(res.data.error){
                    navigate('/admin/login')
                }else{
                    res.data.map((row,i)=>{
                        rowData.push({
                            id:i+1,
                            userName:row.name,
                            email:row.email,
                            status:row.status?'Active':'Blocked',
                            blockOrUnblock:row.status?'Active':'Blocked',
                            userId:row._id           
                        })
                    })  
                    setRows(rowData)
                    setLoading(false)        
                }
            }
        })
    },[])

    const updateRows=(id,updatedData)=>{
        const updatedRows = [...rows];
        
        // Find the index of the item to be updated
        const itemIndex = updatedRows.findIndex(item => item.userId === id);
        
        // Update the item with the new data
        updatedRows[itemIndex].status = updatedData.status?'Active':'Blocked'
        updatedRows[itemIndex].blockOrUnblock = updatedData.status?'Active':'Blocked'
        
        // Set the updated array as the new state
        setRows(updatedRows)
    }

    const handleBlock=(id,status)=>{
        try {
            
            axios.put(`/block-user`,null,{
                params:{
                    id:id,        
                    status:status
                }
            }).then(res=>{
                if(res.data){
                    if(res.data.error){
                        navigate('/admin/login')
                    }else{
                        if(res.data.status===false){
                            socket.emit('userBlocked',res.data)
                        }
                        updateRows(id,res.data)
                        // emitEvent('userBlocked',res.data)
                    }
                }
            })              
        } catch (error) {
            console.log(error)
        }
    }   

    const columns = [
      { field: 'id', headerName: 'Sl.No', flex:1 },
      { field: 'userName', headerName: 'User name', flex:2},
      { field: 'email', headerName: 'Email', flex:2 },
      { field: 'status', headerName: 'Status', flex:1 ,
        renderCell:(params)=>(
            <div>
            {params.value==='Active'?(
             <Button variant='outlined' color='success' size='small'>Active</Button>
            ):(
             <Button variant='outlined' color='error' size='small'>Blocked</Button>   
            )}        
            </div>
        )
      },  
      { field: 'blockOrUnblock', headerName: 'Block/Unblock', flex:1 ,
        renderCell:(params)=>(
            <div>
            {params.value==='Active'?(
             <Switch defaultChecked onChange={()=>handleBlock(params.row.userId,true)}/>
            ):(
             <Switch onChange={()=>handleBlock(params.row.userId,false)}/>          
            )}        
            </div>
        )
      },
    ];

    return (
        <>
        {loading?'loading':(                       
        <>
        <div style={{ height: 400, width: '100%' }}>
        <DataGrid
            rows={rows}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
        />
        </div>
        </>
        )}   
        </>
  );
}

