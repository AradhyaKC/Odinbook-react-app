import Box from '@mui/material/Box';
import { IconButton,Typography } from '@mui/material';
import Check from '@mui/icons-material/Check';
import Close from '@mui/icons-material/Close';
import UserImg from "../../assets/User.png";
import { useTheme } from '@emotion/react';
import config from '../../config.json';
import { useEffect, useState } from 'react';


function FriendRequestComponent(props){

    var loggedInUser=JSON.parse(window.sessionStorage.getItem('user'));
    const [userFriendReqs,setUserFriendReqs] = useState(()=>{
        // var friendReqs=JSON.parse(window.sessionStorage.getItem('user'));
        // friendReqs = friendReqs.friendRequests;
        // return friendReqs;
        return undefined;
    });
    const theme = useTheme();

    useEffect(()=>{
        (async()=>{
            // var response = await fetch(config.EXPRESS_APP_BASE_URL +'/users/'+loggedInUser._id);
            var friendReqs =[]; 
            var userResponse =await fetch(config.EXPRESS_APP_BASE_URL +'/users/'+loggedInUser._id);
            userResponse = await userResponse.json();
            // console.log(userResponse);
            if(userResponse.message=='success'){
                friendReqs =await Promise.all(userResponse.user.friendRequests.map(async(friendReqEle)=>{
                    var response = await fetch(config.EXPRESS_APP_BASE_URL +'/users/'+friendReqEle);
                    response = await response.json();
                    if(response.message=='success'){
                        return response.user;
                    }
                }));
                setUserFriendReqs(friendReqs);
            }else{

            }
        })();
    },[]);

    const AcceptFriendRequest= async(friendId)=>{
        var response = await fetch(config.EXPRESS_APP_BASE_URL+'/users/'+loggedInUser._id+'/friends/'+friendId,{
            method:'POST', headers:{'content-type':'application/json'}, mode:'cors'
        });
        response = await response.json();
        if(response.message=='success'){
            setUserFriendReqs((prevState)=>{
                var newState = [...prevState];
                var index = newState.findIndex(friendReq=> friendReq._id == friendId);
                console.assert(index>=0,'could no find index of friendReq frim friend state array ');
                newState.splice(index,1);
                // console.log(newState);
                return newState;
            });
        }
    }

    const RejectFriendRequest =async(friendReqId)=>{
        var response =await fetch(config.EXPRESS_APP_BASE_URL +'/users/'+loggedInUser._id+'/friendRequests/'+friendReqId,{
            mode:'cors',headers:{'content-type':'application/json'}, method:'DELETE',
        });
        response = await response.json();
        if(response.message=='success'){
            setUserFriendReqs((prevState)=>{
                var newState = [...prevState];
                var index = newState.findIndex(friendReq=> friendReq._id == friendReqId);
                console.assert(index>=0,'could no find index of friendReq frim friend state array ');
                newState.splice(index,1);
                // console.log(newState);
                return newState;
            });
        }
    }

    return (userFriendReqs!=undefined && 
        <Box sx={{backgroundColor:(theme.palette.mode=='light'?'white':'grey.800'),margin:'10px'}} mt='20px' borderRadius='5px'>
            <Box sx={{backgroundColor:(theme.palette.mode=='light'?'primary.main':'background.paper'),padding:'5px',paddingLeft:'0px',
                textAlign:'left',borderRadius:'5px 5px 0px 0px'}}>
                <Typography  color='white' ml='7px' style={{fontSize:'1.2rem'}}>Pending Friend Requests</Typography>
            </Box>
            {userFriendReqs.length!=0 && userFriendReqs.map((friendReqEle,index)=>{
                return <div key={index} style={{display:'flex',flexDirection:'row',padding:'5px',alignItems:'center',overflow:'hidden'}}> 
                    <div style={{display:'flex',flexDirection:'row',width:'0px',flexGrow:1,overflow:'hidden',verticalAlign:'center'}}>
                        <img src={config.EXPRESS_APP_BASE_URL+'/users/'+friendReqEle._id+'/profileImage'} style={{width:'35px',height:'35px',borderRadius:'50%',marginLeft:'10px'}}/>
                        <Typography color='text.primary' mt='5px' ml='10px' fontSize='1.1rem'>{friendReqEle.first_name+' '+friendReqEle.last_name}</Typography>
                    </div>
                    <div style={{display:'flex',flexDirection:'row', flexWrap:'nowrap',textAlign:'right',paddingRight:'10px',width:'max-content'}}>
                        <IconButton onClick={(e)=>{e.preventDefault();AcceptFriendRequest(friendReqEle._id);}}><Check sx={{color:'info.main'}}/> </IconButton>
                        <IconButton onClick={(e)=>{e.preventDefault();RejectFriendRequest(friendReqEle._id);}}><Close sx={{color:'error.main'}} /></IconButton>
                    </div>
                </div>
            })}
            {userFriendReqs.length==0 && <Typography color='text.secondary'> there are no pending requests </Typography>} 
        </Box>
    );
}
export default FriendRequestComponent;