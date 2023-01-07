import { AppBar, Button, IconButton, Typography } from "@mui/material";
import "./Navbar.css";
import OdinbookImg from "../../assets/odinbook-logo-white.png";
import UserImg from "../../assets/User.png";
import useScrollTrigger from "@mui/material/useScrollTrigger";
// import * as React from 'react';
import { useState } from "react";
import { useTheme } from "@emotion/react";
import { cloneElement } from "react";
import Brightness4 from '@mui/icons-material/Brightness4';
import Brightness7 from '@mui/icons-material/Brightness7';
import Logout from '@mui/icons-material/Logout';
import { Link, useNavigate } from "react-router-dom";
import config from '../../config.json';


function ElevationScroll(props){
    const { children } = props;

    const trigger = useScrollTrigger({
      disableHysteresis: true,
      threshold: 0,
    });
    return cloneElement(children, {
      elevation: trigger ? 4 : 0,
    });
}

function Navbar(props){
    const [state,setState] = useState({theme:'default'});
    var {toggleTheme,setTheme} =props; 
    var theTheme = useTheme();
    const user = JSON.parse(window.sessionStorage.getItem('user'));
    var navigate = useNavigate();

    const onToggleTheme =async()=>{
        var currentTheme = await toggleTheme();
        await setState({theme:currentTheme});
    }
    const LogOut=async(e)=>{
        e.preventDefault();
        window.sessionStorage.setItem('user',JSON.stringify({}));
        await setTheme({theme:'default'});
        navigate('/login');
    }
    return (
        <ElevationScroll>
        <AppBar color='primary'>
            <div className="flex-container">
                <div style={{flexGrow:'1',textAlign:'left',paddingLeft:'7%',verticalAlign:'center'}}>
                    {
                        (user!=null &&user!=undefined && Object.keys(user).length!=0) && <Link to={{pathname:'/Home'}}>
                            <img id='odinbook-img' src={OdinbookImg}/>
                        </Link>
                    }
                    {(user==undefined ||Object.keys(user).length==0) &&  <img id='odinbook-img' src={OdinbookImg}/>}
                </div>
                {(user!=null &&user!=undefined && Object.keys(user).length!=0) && <div id='buttons'>
                    <img  id='user-img' src={config.EXPRESS_APP_BASE_URL+'/users/'+user._id+'/profileImage'}/> 
                    <Link to={{pathname:'/Profile/'+user._id}}>
                        <div id='username' style={{color:'white'}}> {user.first_name} </div>
                    </Link>
                    <IconButton onClick={onToggleTheme} color='inherit'>
                        {state.theme=='dark'?<Brightness4/>:<Brightness7/>}
                    </IconButton>
                    <IconButton onClick={LogOut}>
                        <Logout htmlColor="white"/>
                    </IconButton>
                </div>}
            </div>
        </AppBar>
        </ElevationScroll>
    );
}

export default Navbar;