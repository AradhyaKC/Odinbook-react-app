import { useTheme } from "@emotion/react";
import { Button, TextField, Typography } from "@mui/material";
import Box from '@mui/material/Box';
import './PostForm.css';
import { TextareaAutosize } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import config from '../../config.json';

function PostForm(props){
    const theme = useTheme();
    const [color,setColor]=useState('text.secondary');
    const {handlePostAddition,parentpost,...newProps} = props;
    // const personProfile= JSON.parse(window.sessionStorage.getItem('user'));

    const onSubmitPost =async(e)=>{
        e.preventDefault();
        const user = JSON.parse(window.sessionStorage.getItem('user'));
        // console.log('post-form-'+`${parentPost!=undefined?parentPost._id:''}`);
        var formData = new FormData(document.getElementById('post-form'+`${parentpost!=undefined?'-'+parentpost:''}`));
        formData.append('postedBy',user._id);
        formData.append('postedOn',new Date(Date.now()));
        if(parentpost!=undefined){
            formData.append('parentPost',parentpost);
        }
        console.log(formData);
        
        var formObj ={};
        for(const [key,value] of formData){
            formObj[key]=value;
        }
        var response = await fetch(config.EXPRESS_APP_BASE_URL+'/users/'+user._id +'/posts/',{
            mode:'cors', body:JSON.stringify(formObj),method:'POST', headers:new Headers({'Content-Type':'application/json'}),
        });
        response = await response.json();
        if(response.message=='success'){
            handlePostAddition(response.post);
        }    
    }

    const changeColor=(e)=>{
        setColor('text.primary');
    }


    if(parentpost!=undefined){
        return (
            <Box>
                <form id={'post-form-'+parentpost} style={{display:'flex',flexDirection:'row',padding:'0px 5px',paddingBottom:'5px'}}>
                    <TextField sx={{flexGrow:1,}} name="description" id="description"/>
                <Button onClick={onSubmitPost} style={{width:'min-content',height:'min-content',alignSelf:'center',marginLeft:'5px'}} variant='contained'>Comment</Button>
                </form>
            </Box>
        );
    }
    return (
        <Box style={{position:'relative'}}
        sx={{backgroundColor:(theme.palette.mode=='light'?'white':'grey.800'),overflow:'hidden',height:'100px',textAlign:'left', padding:'10px'}} borderRadius='5px'>
            <form id="post-form" style={{display:'flex',flexDirection:'column',width:'100%',height:'100%'}}>
                <Box color={color}>
                    <TextareaAutosize defaultValue='Whats on your mind?' onChange={changeColor} minRows='3' style={{fontSize:'1.2rem',color:'inherit',
                    border:'0px solid black',backgroundColor:'rgba(0,0,0,0)',flexGrow:1,width:'100%', height:'100%'}} name="description" id="description"/>
                </Box>
                <Button onClick={onSubmitPost} style={{position:'absolute', bottom:'10px',right:'10px'}} variant='contained'>Post</Button>
            </form>
        </Box>
    );
}

export default PostForm;