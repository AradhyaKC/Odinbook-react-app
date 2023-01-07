import { Box } from "@mui/system";
import './HomeComponent.css';
import config from '../../config.json';
import { Typography } from "@mui/material";
import PostForm from "../PostForm/PostForm";
import { useTheme } from "@emotion/react";
import FindFriendsComponent from "../FindFriendsComponent/FindFriendsComponent";
import FriendRequestComponent from "../FriendRequestComponent/FriendRequestComponent";
import FriendsComponent from "../FriendsComponent/FriendsComponent";
import PostsContainer from "../PostsContainer/PostsContainer";
import { useRef } from "react";

function HomeComponent(props){
    const loggedInUser= JSON.parse(window.sessionStorage.getItem('user'));
    const theme = useTheme();
    const postsContainerRef=useRef();

    async function fetchData(){
        var returnResult=[];
        var response = await fetch(config.EXPRESS_APP_BASE_URL+'/users/'+loggedInUser._id);
        response=await response.json();
        
        // console.log(response);
        var friendsPosts = [];
        friendsPosts = await Promise.all(response.user.friends.map(async(friend,index)=>{
            var friendResponse = await fetch(config.EXPRESS_APP_BASE_URL+'/users/'+friend+'/posts');
            friendResponse= await friendResponse.json();
            if(friendResponse.message=='success') return [...friendResponse.posts];
        }));

        friendsPosts.forEach(((array)=>{ returnResult.push(...array);}));

        var newResponse = await fetch(config.EXPRESS_APP_BASE_URL+'/users/'+loggedInUser._id+'/posts');
        newResponse= await newResponse.json();
        if(newResponse.message=='success') returnResult.push(...newResponse.posts);
        
        // console.log(returnResult);
        return returnResult;
    }
    const handlePostAddition=(postObj)=>{
        postsContainerRef.current.addNewPost(postObj);
    }

    return (
    <Box id='home-flex'>
        <div id='big-div'>
            <PostForm handlePostAddition={handlePostAddition}/>
            <FindFriendsComponent style={{marginTop:'10px'}}/>
            <PostsContainer mt='20px' populatePosts={fetchData} ref={postsContainerRef} isComments={false}/>
        </div>
        <div id='small-div'>
            <div id='user-info' >
                <img src={config.EXPRESS_APP_BASE_URL+'/users/'+loggedInUser._id+'/profileImage'} style={{borderRadius:'50%',width:'100px'}}/>
                <div>
                    <Typography color='text.primary' style={{fontSize:'1.3rem',fontWeight:'500',overflow:'hidden'}} > {loggedInUser.first_name +' '+loggedInUser.last_name} </Typography>
                    <Typography color='text.primary' style={{fontSize:'0.9rem',fontWeight:'400',overflow:'hidden'}}>{loggedInUser.email}</Typography>
                </div>
            </div>
            <FriendRequestComponent/>
            <FriendsComponent/>
        </div>
    </Box>);
}
export default HomeComponent;