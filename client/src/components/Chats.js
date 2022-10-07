import { Button, Typography } from '@mui/material'
import React from 'react'
import { useAppContext } from '../context/appContext'
import {authFetch} from "../utils"
import { useRef } from 'react'
import { useCallback } from 'react'

import SideBar from './SideBar'
const Chats = ({socket}) => {

  let {ConversationNumber,ConversationId,currentChat}=useAppContext()
    let [chats,setChats]=React.useState([])

    let {user}=useAppContext()

    let [onlineUsers,setOnlineUsers]=React.useState([])

    let [message,setMessage]=React.useState("")

    let [messages,setMessages]=React.useState([])

   
    
    let [ConversationStatus,setConversationStatus]=React.useState("")
    
    let lastMessageRef=useRef()
    
    React.useEffect(()=>{
      socket.on("GetMessage",(data)=>{
        console.log(ConversationId)
        console.log(currentChat)
          setMessages((pre)=>[...pre,data])       
      })

      return ()=>{
        socket.off("GetMessage")
      }
    },[socket])
  
    
    

           React.useEffect(()=>{
            const start =async ()=>{
                try {
                    let {data}=await authFetch("/chat/singleUserChats")
                    setChats(data.Chats)
                  } catch (error) {
                    console.log(error.response.data.msg)
                  }
                }
                start()    
              },[])

              
              React.useEffect(()=>{
                    socket.emit("AddUser",user)
                  },[user])

              
                    React.useEffect(()=>{
                      socket.on("GetUsers",(data)=>{
                           setOnlineUsers(data)        
                          })
                      },[socket])
                        
                        
                        // console.log(messages)                      
                        // console.log(currentChat)
                        React.useEffect(()=>{
                          const start=async ()=>{
                               try {
                                 let {data}=await authFetch(`/chatMessages/${ConversationId}`)
                                 setMessages(data.chatMessages)
                                } catch (error) {
                                  console.log(error.response.data.msg)
                                }
                              }
                              start()
                            },[currentChat])
                            
                            
                            
    
                     const chatFront=(chat)=>{
                      let Friend=chat.members.find((all)=>all._id!==user.userId)
                      setConversationStatus(`You are currently chatting with ${Friend.name} you may recieve others messages`)
                      }
                      
                      
    
                      // React.useEffect(()=>{
        //   socket.on("GetMessage",(data)=>{
          //        console.log(ConversationId)
          //        console.log(currentChat)
        //       setMessages((pre)=>[...pre,data])       
        //   })
        // },[socket,messages])
    
    
        
        const send=async ()=>{
      let Friend=currentChat?.members?.find((all)=>all._id!==user.userId)
      setMessage("")
      try {
        if(currentChat){
          await authFetch.post('/chatMessages',{ConversationId,Reciever:Friend,Sender:user,message})
        }
      } catch (error) {
        console.log(error.response.data.msg)
      }
      
      if(message.length>2 && currentChat && ConversationId){
        socket.emit("Message",{Sender:user,Reciever:Friend,text:message,ConversationId})
        setMessages((pre)=>[...pre,{Sender:user,Reciever:Friend,ConversationId,message:message}])
      }

      
      
    }


    React.useEffect(()=>{
      lastMessageRef.current?.scrollIntoView({behavior:"smooth"})
    },[messages])
    






  return (
    <div className="ChatMain" style={{display:"flex"}}>
      <SideBar chats={chats} onlineUsers={onlineUsers} chatFront={chatFront}/>
    

{/* The Chatts */}
                  <div  style={{padding:"10px"}}>
                    <div>
                      <Typography variant="h6" style={{marginTop:"40px",marginBottom:"40px"}}>
                         {ConversationStatus?ConversationStatus:"Please Select One To start chat"}
                      </Typography>
                    </div>

                    <div>
                      {
                        messages?.map((all)=>{
                          return(
                             <div ref={lastMessageRef} className={`${all.Sender?.userId===user.userId?"Active":"NotActive"}`} >
                               <div  style={{display:"flex",marginBottom:"30px"}}>
                                  <Typography style={{marginRight:"10px"}} variant='h7'>{all?.Sender?.name.toUpperCase()}</Typography>
                                   <img style={{height:"40px",width:"40px",borderRadius:"50%"}} src={all?.Sender?.image}/>
                               </div>

                               <div >
                                   <Typography className={`${all?.Sender?.userId===user.userId?"ActiveBox":"Box"}`}  variant="h6">{all.message}</Typography>
                               </div>
                             </div>
                            )
                        })
                      }
                    </div>

                    <div>
                       <input value={message} onChange={(e)=>setMessage(e.target.value)} style={{padding:"10px",ouline:"none",padding:"10px",zIndex:"-100"}} placeholder="Message" />
                       <Button variant='outlined' style={{marginLeft:"20px",zIndex:"10"}} onClick={send}>Send</Button>
                    </div>
                  </div>
                  
    </div>
  )
}

export default Chats
