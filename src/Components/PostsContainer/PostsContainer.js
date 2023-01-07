import { Box } from "@mui/system";
import { useEffect, useImperativeHandle, useState } from "react";
import Post from '../Post/Post.js';
import { CircularProgress, Typography } from "@mui/material";
import { forwardRef } from "react";
import Comment from "../Comment/Comment.js";


const PostsContainer = forwardRef((props,ref)=>{
    const newProps = {...props};
    const {populatePosts,isComments,onDeletePost} =newProps;
    const [refresh,setRefresh] = useState(true);
    newProps.populatePosts=undefined;
    newProps.onDeletePost=undefined;
    // const [postsArray,setPostsArray] = useState(()=>{
    //     (async()=>{
    //         var newPosts = await populatePosts();
    //         setPostsArray(newPosts);
    //     })();
    //     return [];
    //     // populatePosts.then((value)=>{setPostsArray(value)});
    //     // console.log(populatePosts);
    // });
    const [postsArray,setPostsArray] = useState(()=>{ return [];})

    useEffect(()=>{
        (async()=>{
            var newPosts = await populatePosts();
            setPostsArray(newPosts);
        })();
    },[refresh]);

    // useImperativeHandle(ref,()=>{
    //     var thisRef ={};
    //     thisRef.addNewPost=(postObj)=>{
    //         setPostsArray((prevState)=>{
    //             var newState = [...prevState];
    //             newState.push(postObj);
    //             return newState;
    //         });
    //     }
    //     return thisRef;
    // });
    useImperativeHandle(ref,()=>({
        addNewPost:(postObj)=>{
            setPostsArray((prevState)=>{
                var newState = [...prevState];
                newState.push(postObj);
                return newState;
            });
        },
        refreshPosts:()=>{
            setRefresh(!refresh);
        }
    }
    ));

    const handlePostDeletion=(index)=>{
        setPostsArray((prevState)=>{
            var newState = [...prevState];
            newState.splice(index,1);
            return newState;
        });
        if(onDeletePost!=undefined)
            onDeletePost(index);
    } 
    return (
        <Box {...props} >
            {postsArray!=undefined &&  <>
                {postsArray.length==0 && isComments==false && <Typography color='text.secondary'> There are no posts to show </Typography>}
                {postsArray.length==0 && isComments==true && <Typography color='text.secondary'> </Typography>}
                {isComments==false && postsArray.length!=0 &&  postsArray.map((element,index)=>{
                        return <Post keyindex={index} key={index} postobj={element} style={{marginTop:'10px'}} handlepostdeletion={handlePostDeletion}/>
                    }).reverse()}
                {isComments==true && postsArray.length!=0 &&  postsArray.map((element,index)=>{
                        return <Comment keyindex={index} key={index} commentobj={element} handlepostdeletion={handlePostDeletion}/>
                }).reverse()}
            </>}
        </Box>
    );
});
export default PostsContainer;