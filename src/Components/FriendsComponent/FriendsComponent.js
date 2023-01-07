import { useTheme } from "@emotion/react";
import Box from '@mui/material/Box';
import UserImg from "../../assets/User.png";
import {Divider, Typography} from '@mui/material';
import { useEffect, useState } from "react";
import config from '../../config.json';
import { Link } from "react-router-dom";


function FriendsComponent(props){
    const theme = useTheme();
    const [friends,setFriends] = useState(undefined);    
    const loggedInUser= JSON.parse(window.sessionStorage.getItem('user'));
    var idOfFriend1= loggedInUser._id;
    if(props.showFriendsOfId!=undefined) idOfFriend1=props.showFriendsOfId;


    useEffect(()=>{
        (async()=>{
            var response = await fetch(config.EXPRESS_APP_BASE_URL +'/users/'+idOfFriend1+'/friends');
            response=await response.json();
            if(response.message=='success'){
                setFriends(response.friends);
            }
        })();
    },[]);


    return (<Box sx={{backgroundColor:(theme.palette.mode=='light'?'white':'grey.800'),margin:'10px'}} mt='20px' borderRadius='5px'>
        <Box sx={{backgroundColor:(theme.palette.mode=='light'?'primary.main':'background.paper'),textAlign:'left'
        ,borderRadius:'5px 5px 0px 0px',padding:'5px',paddingLeft:'0px',}}>
            <Typography  color='white' ml='7px' style={{fontSize:'1.2rem'}}>Friends</Typography>
        </Box>

        {friends!=undefined && friends.length!=0 && friends.map((friend,index)=>{
            return <div key={index} style={{display:'flex',flexDirection:'row',padding:'5px'}}> 
                <img src={config.EXPRESS_APP_BASE_URL+'/users/'+friend._id+'/profileImage'} style={{width:'25px',borderRadius:'50%',marginLeft:'10px'}}/>
                <Link to={{pathname:'/Profile/'+friend._id}}>
                    <Typography color='text.primary' ml='10px' fontSize='1.1rem'>{friend.first_name +' '+friend.last_name}</Typography>
                </Link>
                <Divider variant="middle"/>
            </div>
        })}
        {friends!=undefined && friends.length==0 && <Typography color='text.secondary'>You have no friends at the moment</Typography>}
        
    </Box>
    );
}
export default FriendsComponent;