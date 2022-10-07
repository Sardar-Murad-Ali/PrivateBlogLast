import React from 'react'
import { Typography } from '@mui/material'
import { useAppContext } from '../context/appContext'
import MenuIcon from '@mui/icons-material/Menu';
import ClearIcon from '@mui/icons-material/Clear';

const SideBar = ({chats,onlineUsers,chatFront}) => {
    let {user,chat,ConversationNumber}=useAppContext()
    let [open,setOpen]=React.useState(false)

    function chatChange(all){
        chat(all)
        setOpen(false)
        ConversationNumber({id:all._id})
        chatFront(all)
    }
    
    function chatBig(all){
        chat(all)
        ConversationNumber({id:all._id})
        chatFront(all)
    }
  return (
    <div >

        <div className='bigScreen'>


    <Typography variant='h5'>Your Conversations</Typography>
    {
        chats?.map((all)=>{
            return  all?.members?.filter((users)=>users.email!==user.email)?.map((allUsers)=>{
          return(
              
              <div  style={{display:"flex",marginBottom:"30px",cursor:"pointer"}} onClick={()=>chatBig(all)}>
                <div
                style={{display:"flex",marginTop:"30px"}}>
                  <img src={allUsers?.image} style={{height:"40px",width:"40px",borderRadius:"50%",marginRight:"30px"}} />
                 <Typography variant='h7'>{allUsers?.name}</Typography>
                </div>

          </div>
              )
            })
        })
      }


                <div className='Online'  style={{marginTop:"40px"}}>
                  <Typography variant='h5'>Online Users</Typography>
                  {
                      onlineUsers?.filter((all)=>all.userId!==user.userId)?.map((all)=>{
                          return(
                              <div onClick={()=>chat(all)} className='dotmain' style={{display:"flex",marginTop:"40px",cursor:"pointer"}} >
                                  <Typography style={{marginRight:"20px"}} variant='h7'>{all?.name.toUpperCase()}</Typography>
                       <img src={all?.image} style={{height:"40px",width:"40px",borderRadius:"50%",marginRight:"30px"}} />
                       <div className='dot'></div>
                       </div>
                    ) 
                })
                }
                </div>

                </div>




{/* tHe small scrren */}
                <div className='smallScreen'>
                {!open?<MenuIcon fontSize='large' style={{cursor:"pointer",position:"absolute",right:"0"}}  onClick={()=>setOpen(true)}/>:<ClearIcon fontSize='large' onClick={()=>setOpen(false)} style={{color:"white",cursor:"pointer"}}/>}

{ open  &&
 <>
 <div className='Outline'></div>
  <div className='small__Sidebar'>
  <Typography variant='h5'>Your Conversations</Typography>

    {
        chats?.map((all)=>{
            return  all?.members?.filter((users)=>users?.email!==user?.email).map((allUsers)=>{
                return(
                    
                    <div  style={{display:"flex",marginBottom:"30px",cursor:"pointer"}} onClick={()=>chatChange(all)}>
                    <div
                    style={{display:"flex",marginTop:"30px"}}>
              <img src={allUsers?.image} style={{height:"40px",width:"40px",borderRadius:"50%",marginRight:"30px"}} />
              <Typography variant='h7'>{allUsers?.name}</Typography>
              </div>
              
              </div>
              )
            })
        })
    }

                <div className='Online'  style={{marginTop:"40px"}}>
                    <Typography variant='h5'>Online Users</Typography>
                  {
                      onlineUsers?.filter((all)=>all.userId!==user.userId).map((all)=>{
                          return(
                              <div onClick={()=>chat(all)} className='dotmain' style={{display:"flex",marginTop:"40px",cursor:"pointer"}} >
                                  <Typography style={{marginRight:"20px"}} variant='h7'>{all?.name.toUpperCase()}</Typography>
                       <img src={all?.image} style={{height:"40px",width:"40px",borderRadius:"50%",marginRight:"30px"}} />
                       <div className='dot'></div>
                       </div>
                    ) 
                })
            }
            </div>
                </div>  

            </>
            }

                </div> 


                                  </div>
  )
}

export default SideBar
