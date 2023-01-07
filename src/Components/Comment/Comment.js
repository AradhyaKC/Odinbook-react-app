import { useTheme } from "@emotion/react";
import { Collapse, Divider, Icon, IconButton, Typography } from "@mui/material";
import { Box } from "@mui/system";
import UserImg from "../../assets/User.png";
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import Delete from "@mui/icons-material/Delete";
import AddComment from '@mui/icons-material/AddComment';
import config from '../../config.json';


import TreeView from '@mui/lab/TreeView';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ChevronRight from '@mui/icons-material/ChevronRight';
import TreeItem, { useTreeItem } from '@mui/lab/TreeItem';
import PostsContainer from "../PostsContainer/PostsContainer";
import clsx from 'clsx';
import PostForm from "../PostForm/PostForm";
import { cloneElement } from "react";

const CustomContent = forwardRef(function CustomContent(props, ref) {
  const loggedInUser= JSON.parse(window.sessionStorage.getItem('user'));
  const theme = useTheme();
  const [showCommentForm,setShowCommentForm] = useState(false);
  // const {commentobj} = props;
  // const [commentObj,setCommentObj] =useState(()=>{
  //   const {_id,description,postedOn,postedBy,comments,parentPost,}=props;
  //   return {_id,description,postedOn,postedBy,comments,parentPost};
  // });
  // const buttonRef = useRef(undefined);
  // const customContentRef= useImperativeHandle(ref,()=>{
  //   var returnRef={};
  //   returnRef.commentDeletedOn=(index)=>{
  //     setCommentObj((prevState)=>{
  //       var newState ={...prevState};
  //       newState.comments.splice(index,1);
  //       return newState;
  //     });
  //     return returnRef;
  //   }
  //   returnRef.current={...buttonRef.current}
  // });

  useEffect(()=>{
    // const {_id,description,postedOn,postedBy,comments,parentPost}=props;
    // setCommentObj({_id,description,postedOn,postedBy,comments,parentPost});
  },[]);
  
  const {
    classes,
    className,
    label,
    nodeId,
    icon: iconProp,
    expansionIcon,
    displayIcon,
    keyindex,
    handlepostdeletion,
    ...newProps
  } = props;

  const {
    disabled,
    expanded,
    selected,
    focused,
    handleExpansion,
    handleSelection,
    preventSelection,
  } = useTreeItem(nodeId);


  // useEffect(()=>{
  //   if(props.comments.length==0)
  //     setIsCommentsExpanded(false);
  // },[]);

  const icon = iconProp || expansionIcon || displayIcon;

  const handleMouseDown = (event) => {
    preventSelection(event);
  };

  const handleExpansionClick = async(event) => {
    handleExpansion(event);
  };

  const handleSelectionClick = (event) => {
    handleSelection(event);
  };
  const onShowCommentClick=(e)=>{
    e.preventDefault(); 
    setShowCommentForm(!showCommentForm);
  }
  const onDeleteClick=async(e)=>{
    e.preventDefault();
    var response = await fetch(config.EXPRESS_APP_BASE_URL+'/users/'+props.postedBy._id+'/posts/'+props._id,{
        method:'DELETE',mode:'cors',body:JSON.stringify({deletedBy:loggedInUser._id}),headers:{'content-type':'application/json'}
    })
    response= await response.json();
    if(response.message=='success'){
      // console.log(props.keyindex);
      handlepostdeletion(props.keyindex);
    }
  }

  return (
  <Box  {...newProps} sx={{backgroundColor:(theme.palette.mode=='light'?'white':'grey.800'),borderRadius:'5px',
  display:'flex',flexDirection:'column',width:'-moz-available',marginTop:'5px'}} onMouseDown={handleMouseDown} ref={ref} style={{padding:'0px'}}>
    { (props._id!=undefined) && <>
      {/* {console.log(commentObj)} */}
      <Box sx={{display:'flex',flexDirection:'row',width:'stretch'}}>
        {props.comments.length!=0 && <Box sx={{color:'text.main',alignSelf:'center',marginLeft:'5px'}} onClick={handleExpansionClick} className={classes.iconContainer}>
          {icon}
        </Box>}
        <img src={config.EXPRESS_APP_BASE_URL+'/users/'+props.postedBy._id+'/profileImage'} style={{width:'22px',height:'22px',alignSelf:'center',marginLeft:'5px',marginRight:'3px'}}/>
        <div>
          <Typography color='text.primary' fontSize='0.8rem' sx={{alignSelf:'center',marginRight:'3px',textAlign:'left'}}>{props.postedBy.first_name+' '} 
          {props.postedBy.last_name}</Typography>
          <Typography color='text.secondary' fontSize='0.8rem' sx={{alignSelf:'center'}}> Commented on {props.postedOn.slice(0,16)} </Typography>
        </div>
        <div style={{flexGrow:1,textAlign:'right',minWidth:'max-content'}}>
          <IconButton onClick={onShowCommentClick}> <AddComment sx={{color:`${showCommentForm?'primary.dark':''}`}}/> </IconButton>
          {props.postedBy._id==loggedInUser._id && <IconButton onClick={onDeleteClick}> <Delete sx={{color:'error.dark'}}/></IconButton>}
        </div>
      </Box>
      
      <Divider style={{width:'100%'}} variant="middle"/>
      <Typography mt='2px' ml='5px' color='text.primary' sx={{textAlign:'left',alignSelf:'flex-start'}}>{props.description}</Typography>
      <Collapse in={showCommentForm}>
        <PostForm parentpost={props._id} handlePostAddition={props.handlePostAddition}/>
      </Collapse>
    </>}  
  </Box>
  );
});


function Comment(props){
    const postsContainerRef = useRef();
    const {commentobj,handlepostdeletion,...newProps} =props;
    const [commentObj,setCommentObj]=useState(commentobj);
    
    useEffect(()=>{
      setCommentObj(props.commentobj);
    },[props.commentobj])

    const onDeletePost=(index)=>{
      setCommentObj((prevState)=>{
        var newState = {...prevState};
        // console.log(index);
        newState.comments.splice(index,1);
        // console.log(newState.comments);
        return newState;
      });
    }
    const handlePostAddition=(postObj)=>{
      setCommentObj((prevState)=>{
          var newState = {...prevState};
          newState.comments.push(postObj);
          // console.log(newState.comments);
          return newState;
      });
    }
    const propsObject ={...commentObj,handlepostdeletion,handlePostAddition,keyindex:props.keyindex};

    var stringId = commentObj._id;
    return (
    <TreeItem nodeId={stringId} ContentProps={propsObject} label='something ' ContentComponent={CustomContent}>
      {commentObj.comments.map((element,index)=>{
        return <Comment keyindex={index} key={index} commentobj={element} handlepostdeletion={onDeletePost}/>
      })}
    </TreeItem>
    );
}

export default Comment;