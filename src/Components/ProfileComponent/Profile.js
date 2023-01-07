import './Profile.css';
import Box from '@mui/material/Box';
import { useTheme } from '@emotion/react';
import { Button, Divider, IconButton, TextField, Typography } from '@mui/material';
import PostForm from '../PostForm/PostForm.js';
import Edit from '@mui/icons-material/Edit';
import Dialog from '@mui/material/Dialog';
import { useEffect, useReducer, useRef, useState } from 'react';
import { useParams,useLocation} from 'react-router-dom';
import config from '../../config.json';
import PostsContainer from '../PostsContainer/PostsContainer';
import FriendRequestComponent from '../FriendRequestComponent/FriendRequestComponent';
import FriendsComponent from '../FriendsComponent/FriendsComponent';

function Profile(props){

    const [editIsOpen,setEditIsOpen] = useState(false);
    const {personId} = useParams();
    // const [personId,setPersonId] = useState(()=>{});

    var theme = useTheme();
    const loggedInUser= JSON.parse(window.sessionStorage.getItem('user'));
    const [personProfile,setPersonProfile]=useState({...loggedInUser,_id:personId});


    useEffect(()=>{
        (async()=>{
            var response = await fetch(config.EXPRESS_APP_BASE_URL +'/users/'+personId);
            response = await response.json();
            if(response.message=='success'){
                await setPersonProfile(response.user);
                postsContainerRef.current.refreshPosts();
            }
        })();
    },[personId]);


    const onCloseEdit=()=>{
        setEditIsOpen(false);
    }
    function EditProfileModal(props){
        const {open, handleClose} = props;
        const [displayImageUrl, setDisplayImageUrl] = 
        useState(config.EXPRESS_APP_BASE_URL+'/users/'+personProfile._id+'/profileImage');

        const onChangeProfilePic =(e)=>{
            var reader =new FileReader();
            reader.addEventListener('load',()=>{
                const uploaded_image = reader.result;
                console.log(uploaded_image);
                setDisplayImageUrl(uploaded_image);
            });
            reader.readAsDataURL(e.target.files[0]);
        }

        const onFormSubmit=async(e)=>{
            e.preventDefault();
            const formData = new FormData(document.getElementById('edit-profile-form'));
            // console.log(formData['profilePicUrl'])
            var response = await fetch(config.EXPRESS_APP_BASE_URL + '/users/' +await JSON.parse(window.sessionStorage.getItem('user'))._id,
            {
                method:"PATCH",mode:'cors', body:formData, 
            });
            response = await response.json();
            // const base64String= btoa(String.fromCharCode(...new Uint8Array(response.user['profilePicUrl'].data.data)));
            // response.user['profilePicUrl']=`data:${response.user['profilePicUrl'].contentType};base64,${base64String}`;
            if(response.message=='success'){

                window.sessionStorage.setItem('user',JSON.stringify(response.user));
                handleClose();
            }
            else if(response.message=='error'){
                console.log(response);
            }
        }

        return (
        <Dialog open={open} onClose={handleClose} width='700px'>
            <Box sx={{padding:'10px',backgroundColor:(theme.palette.mode=='light'?'white':'background.paper')}}>
                <div>
                    <Typography color='text.primary' fontSize='1.2rem' padding='5px' sx={{textAlign:'center'}}>Edit Your Profile</Typography>
                </div>
                <form id='edit-profile-form' encType='multipart/form-data'>
                    <Box sx={{backgroundColor:(theme.palette.mode=='light'?'grey.300':'grey.800'),margin:'10px',borderRadius:'5px' }}>
                        <div style={{display:'flex',flexDirection:'column',alignItems:'center',overflow:'hidden',marginTop:'10px'}}>
                            <img id='edit-profile-img' src={displayImageUrl} style={{borderRadius:'50%'}}/>
                            <div style={{margin:'10px',display:'flex', flexDirection:'row',flexWrap:'wrap',width:'100%'}}>
                                <TextField label='First Name' defaultValue={loggedInUser.first_name} name='first_name' id='first_name' variant='outlined'
                                margin='dense' sx={{ width:'100px' ,flexGrow:1,margin:'5px'}} />
                                <TextField label='Last Name' defaultValue={loggedInUser.last_name} name='last_name' id='last_name' variant='outlined' 
                                margin='dense' sx={{ width:'100px',flexGrow:1,margin:'5px'}}/>    
                            </div>
                            <TextField label='Description' defaultValue={loggedInUser.description==undefined?'Hello there , I am using Odinbook':loggedInUser.description}
                            name='description' id='description' variant='outlined'  style={{width:'95%'}} margin='dense' minRows='2'/>
                            <TextField label='' sx={{margin:'5px',width:'95%',}} name='profilePicUrl' id='profilePicUrl' type='file' 
                            accept='image/png' onChange={onChangeProfilePic}/>
                            <Button sc={{color:'primary.main',margin:'5px'}}variant='contained' onClick={onFormSubmit}> Confirm Edit</Button>
                        </div>
                    </Box>
                </form>
            </Box>

        </Dialog>
        );
    }

    var postsContainerRef = useRef();
    const handlePostAddition=(postObj)=>{
        postsContainerRef.current.addNewPost(postObj);
    }

    async function fetchData(){
        var returnResult=undefined;
        var response = await fetch(config.EXPRESS_APP_BASE_URL+'/users/'+personProfile._id+'/posts/');
        response=await response.json();
        // console.log(response)
        if(response.message=='success'){
        // console.log(response.posts);
            if(response.posts.length==0){
                returnResult=[];
            }else{
                returnResult= [...response.posts];
            }
        }else{
            console.error("failed to fetch posts");
            returnResult=[];
        }
        return returnResult;
    }

    // const AddFriend=async(friendId)=>{
    //     var response = await fetch(config.EXPRESS_APP_BASE_URL+'/users/'+friendId+'/friendRequests',{
    //         method:'PUT', body:JSON.stringify({requestedBy:loggedInUser._id}),headers:{'content-type':'application/json'},mode:'cors',
    //     });
    //     response= await response.json();
    //     if(response.message=='success'){
    //         setPersonProfile((prevState)=>{
    //             var newState={...prevState};
    //             newState.friendRequests = response.friendRequests;
    //             return newState;
    //         });
    //     }
    // }

    return (
        <Box id='profile-flex'>
            <EditProfileModal open={editIsOpen} handleClose={onCloseEdit}/>
            <div id='small-div'>

                {/* PersonInfo */}
                <div style={{display:'flex',flexDirection:'row',alignItems:'center',overflow:'hidden',marginTop:'10px'}}>
                    <img src={config.EXPRESS_APP_BASE_URL+'/users/'+personProfile._id+'/profileImage'} style={{borderRadius:'50%',width:'100px'}}/>
                    <div>
                        <Typography color='text.primary' style={{fontSize:'1.3rem',fontWeight:'500',overflow:'hidden'}} > {personProfile.first_name +' '+personProfile.last_name} </Typography>
                        <Typography color='text.primary' style={{fontSize:'0.9rem',fontWeight:'400',overflow:'hidden'}}>{personProfile.email}</Typography>
                    </div>
                </div>

                {/* About Me  */}
                <Box mt='10px' sx={{backgroundColor:(theme.palette.mode=='light'?'white':'grey.800'),margin:'10px'}} borderRadius='5px' >
                    <Box sx={{backgroundColor:(theme.palette.mode=='light'?'primary.main':'background.paper'),textAlign:'left', borderRadius:'5px 5px 0px 0px'
                    ,display:'flex',flexDirection:'row'}}>
                        <div style={{display:'flex',alignItems:'center'}}>
                            <Typography color='white' ml='7px' style={{fontSize:'1.2rem'}}> About me</Typography> 
                        </div>
                        {loggedInUser._id==personProfile._id && <div style={{flexGrow:1,textAlign:'right',height:'fit-content'}}>
                            <IconButton onClick={(e)=>{setEditIsOpen(true);}}><Edit sx={{color:'white'}}/></IconButton>
                        </div>}
                    </Box>
                    <Typography color='text.primary' padding='5px' sx={{textAlign:'left',paddingLeft:'10px'}}>
                        {(personProfile.description==''||personProfile.description==undefined)?'Hello there , I am using Odinbook':personProfile.description}
                    </Typography>
                    <Divider/>
                    <Box color='text.secondary' style={{textAlign:'left',fontSize:'0.9rem',padding:'3px'}} ml='4px'> 
                        Member since {(personProfile.joinDate==undefined)?'August 2021':
                        personProfile.joinDate}
                    </Box>
                </Box>
                
                {/* Add Friend  */}
                {/* {loggedInUser._id!=personProfile._id && !personProfile.friendRequests.includes(loggedInUser._id) && <Box sx={{marginTop:'20px',textAlign:'right',paddingRight:'10px'}}>
                    <Button onClick={(e)=>{e.preventDefault();AddFriend(personProfile._id)}} variant='contained' > Add Friend </Button>
                </Box >} */}

                {/* Friend Req */}
                {loggedInUser._id==personId && <FriendRequestComponent/>}

                {/* Friend List */}
                <FriendsComponent showFriendsOfId={personId}/>
            </div>
            <div id='big-div'>
                {loggedInUser._id==personProfile._id && <PostForm handlePostAddition={handlePostAddition}/>}
                <PostsContainer populatePosts={fetchData} ref={postsContainerRef} isComments={false}/>
            </div>
        </Box>
    );
}

export default Profile;