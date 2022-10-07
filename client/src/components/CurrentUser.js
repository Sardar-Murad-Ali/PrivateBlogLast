import { Button, Typography } from '@mui/material'
import React from 'react'
import {authFetch} from "../utils"
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
// import Button from '@mui/material/Button';
// import Typography from '@mui/material/Typography';

const CurrentUser = () => {
    let [user,setUser]=React.useState({})

    const start=async ()=>{
      try {
          let {data}=await authFetch("/auth/currentUser")
           setUser(data.user)
      } catch (error) {
          console.log(error.response.data.msg)
      }
    }
    
    React.useEffect(()=>{
        start()
    },[])

    const unFollow=async (id)=>{
      try {
        await authFetch.post(`/auth/unFollow/${id}`)
        start()
      } catch (error) {
        console.log(error)
      }
    }

  return (
    <div className='section__padding'>
        <div>
       <Typography variant='h3' style={{marginBottom:"30px"}}>
         Your Follow
       </Typography>


       <div className='grid' style={{marginBottom:"40px"}}>

       {user?.followings?.length<1 && <p className='h__Cormorant'>Nothing to Show..</p>}
       {
           user?.followings?.map((all)=>{
            return(

              <Card sx={{ maxWidth: 345 }}>
            <CardMedia
              component="img"
              height="140"
              image={all?.image}
              alt="green iguana"
              />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                {all?.name}
              </Typography>
            </CardContent>
            <CardActions>
              <Button  onClick={()=>unFollow(all?._id)} size="small" >UnFollow</Button>
            </CardActions>
          </Card>
        )
      })
    }
    </div>
        </div>
        

        <div>
       <Typography variant='h3'>
          Your Followers
       </Typography>

       <div className='grid'>

    {user?.followers?.length<1 && <p className='h__Cormorant'>Nothing to Show..</p>}
       {
         user?.followers?.map((all)=>{
        return(
          
          <Card sx={{ maxWidth: 345 }}>
        <CardMedia
          component="img"
          height="140"
          image={all?.image}
          alt="green iguana"
          />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {all?.name}
          </Typography>
        </CardContent>
        <CardActions>
        </CardActions>
      </Card>
       )
      })
    }
    </div>


      </div>
      

      
    </div>
    )
}

export default CurrentUser
