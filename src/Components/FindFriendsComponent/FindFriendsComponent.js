import { Box } from "@mui/system";
import { useTheme } from "@emotion/react";
import { Button, CircularProgress, TextField, Typography } from "@mui/material";
import InputAdornment from '@mui/material/InputAdornment';
import Search from '@mui/icons-material/Search';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import UserImg from '../../assets/User.png';
import './FindFriendsComponent.css';
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import config from '../../config.json';

function FindFriendsComponent(props){

    const theme = useTheme();
    const [FriendList,setFriendList] = useState(undefined);
    const [searchValue,setSearchValue]=useState('');
    const loggedInUser= JSON.parse(window.sessionStorage.getItem('user'));
    var navigate = useNavigate();
    

    useEffect(()=>{
        (async()=>{
            var response=await fetch(config.EXPRESS_APP_BASE_URL+'/users/');
            response = await response.json();
            // console.log('called');
            if(response.message=='success'){
                var filteredUsers=response.users.filter((userElement)=>{
                    if(userElement._id==loggedInUser._id) return false;
                    else if(userElement.friends.includes(loggedInUser._id)) return false;
                    else if(userElement.friendRequests.includes(loggedInUser._id)) return false;
                    else return true;
                    // return !(userElement.friendRequests.includes(loggedInUser._id) || userElement.friends.includes(loggedInUser._id)); // also add not friedns later;
                });
                setFriendList(filteredUsers);
            }
        })();
    },[]);

    const AddFriend=async(friendId)=>{
        var response = await fetch(config.EXPRESS_APP_BASE_URL+'/users/'+friendId+'/friendRequests',{
            method:'PUT', body:JSON.stringify({requestedBy:loggedInUser._id}),headers:{'content-type':'application/json'},mode:'cors',
        });
        response= await response.json();
        if(response.message=='success'){
            setFriendList((prevState)=>{
                console.assert(FriendList!=undefined && FriendList.length!=0);
                let index= FriendList.findIndex((element)=>{
                    return element._id==friendId;
                });
                console.assert(index!=-1);
                var newState = [...prevState];
                newState.splice(index,1);
                return newState;
            });
        }
    }

    const handleSearchValueChange =async(e)=>{
        e.preventDefault();
        await setSearchValue(e.target.value);
        var response;
        if(e.target.value=='' || e.target.value==undefined){
        response=await fetch(config.EXPRESS_APP_BASE_URL+'/users/');
        }else{
            response=await fetch(config.EXPRESS_APP_BASE_URL+'/users/search/'+e.target.value);
        }
        response = await response.json();

        if(response.message=='success'){
            var filteredUsers=response.users.filter((userElement)=>{
                if(userElement._id==loggedInUser._id) return false;
                else if(userElement.friends.includes(loggedInUser._id)) return false;
                else if(userElement.friendRequests.includes(loggedInUser._id)) return false;
                else return true;
            });
            setFriendList(filteredUsers);
        }
    }

    return(
    <Box sx={{backgroundColor:(theme.palette.mode=='light'?'white':'grey.800'),padding:'10px',borderRadius:'5px'}} {...props}>
        <Box sx={{display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
            <Typography fontSize='1.4rem' color='text.primary' sx={{justifySelf:'flex-start',width:'max-content'}} > Find Friends </Typography>
            <TextField InputProps={{
                startAdornment: <InputAdornment position="start"><Search/></InputAdornment>,
            }} sx={{justifySelf:'flex-end',width:'0px',flexGrow:1,maxWidth:'250px',marginLeft:'20px'}} value={searchValue} onChange={handleSearchValueChange} size='small'/>
        </Box>
        
        <Box style={{overflow: 'auto',whiteSpace: 'nowrap',padding:'10px',position:'relative',minHeight:'75px'}}>
            {FriendList==undefined && <CircularProgress style={{position:'absolute',left:'50%',top:'50%',transform:'translate(-50%,-50%)'}}/>}
            {FriendList!=undefined && FriendList.length!=0 && <Box sx={{display:'flex',flexDirection:'row',columnGap: '10px',marginTop:'10px',}}>
                {FriendList.map((element,index)=>{ 
                    return <Card className="card" key={index}>
                        <CardContent>
                            <img className='card-img' src={config.EXPRESS_APP_BASE_URL+'/users/'+element._id+'/profileImage'}/>
                            <Link to={{pathname:'/Profile/'+element._id}}>
                                <Typography className="person-name" color='text.primary'>{element.first_name +' '+element.last_name}</Typography>
                            </Link>
                            <Typography className='at-addr' color="text.secondary">@{element.first_name} </Typography>
                            <Typography className="description" fontSize='0.7rem' color="text.secondary">
                                {element.description}
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button onClick={(e)=>{e.preventDefault();AddFriend(element._id);}}
                            style={{position:'relative',textAlign:'center',left:'50%',transform:'translate(-50%,0%)',width:'max-content'}}>Add Friend</Button>
                        </CardActions>
                    </Card> 
                })}
            </Box>}
            {FriendList!=undefined && FriendList.length==0 && <Typography color='text.secondary'> There are no users to friend at the moment </Typography>}
        </Box>
        

    </Box>);
}
export default FindFriendsComponent;