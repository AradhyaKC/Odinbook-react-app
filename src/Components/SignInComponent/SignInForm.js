import './SignInForm.css';
import odinbookImg from '../../assets/odinbook-logo-blue.png';
import MyButton from '../../assetComponents/MyButton';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import Divider from '@mui/material/Divider';
import { useState } from 'react';
import {Button } from '@mui/material';
import {GoogleLogin} from "@react-oauth/google";
import config from "../../config.json";
import { useNavigate } from 'react-router-dom';

function SignInForm(props){

    const [signInIsOpen,setSignInIsOpen] = useState(false);
    const [logInState,setLoginState] = useState({errors:[]});
    const [loginLoading,setLoginLoading] =useState(false);
    var navigate = useNavigate();

    function SignInModal(props){
        const {open, handleClose} = props;
        const [errorState,setErrorState] = useState([]);

        const SignIn=async(e)=>{
            e.preventDefault();
            var formData = new FormData(document.getElementById('signInForm'));
            var formObj ={};
            for(const [key,value] of formData){
                formObj[key]=value;
            }
            var response = await fetch(config.EXPRESS_APP_BASE_URL +'/users',{
                method:'POST', headers:new Headers({'Content-Type':'application/json'}),
                body:JSON.stringify(formObj),
            });
            response= await response.json();
            if(response.errors!=undefined && response.errors.length!=0){
                var errorFormObject={};
                for(var [key,value] of formData){
                    errorFormObject[key]='';
                    if(response.errors.find((element)=>{return element.param==key;})){
                        errorFormObject[key] = response.errors.findIndex((element)=>{return element.param==key});
                        errorFormObject[key] = response.errors[errorFormObject[key]].msg;
                    }
                }
                setErrorState(errorFormObject);
            }else {
                handleClose();
            }
        }
        const findIfErrorForInput=(elementName)=>{
            if(errorState[elementName]=='' || errorState[elementName]==undefined) return false;
            else return true;
        }

        return (
        <Dialog open={open} onClose={handleClose}>
            <div style={{padding:'15px', textAlign:'center'}}>
                <div style={{fontSize:'1.7rem', fontWeight:'600',color:'#247cf0'}}> Sign Up </div>
                <div> it's quick and easy</div>
                <Divider style={{marginTop:'3px',marginBottom:'3px'}}/>
                <form id='signInForm' className='sign-in-form'>
                    <div style={{display:'flex', flexDirection:'row',justifyContent:'space-evenly'}}>
                        <TextField required error={findIfErrorForInput('first_name')} helperText={errorState['first_name']}
                            name='first_name' style={{width:'200px',paddingRight:'5px'}} variant='outlined' label='First Name' id='first_name' margin='dense'/>
                        <TextField required error={findIfErrorForInput('last_name')} helperText={errorState['last_name']}
                        name='last_name' style={{width:'200px',paddingLeft:'5px'}} variant='outlined' label='Last Name' id='last_name' margin='dense'/>
                    </div>
                    <TextField required error={findIfErrorForInput('email')} helperText={errorState['email']}
                    name='email' style={{width:'100%'}} variant='outlined' label='Email' id='email' margin='dense'/>
                    <TextField required error={findIfErrorForInput('password')} helperText={errorState['password']}
                    name='password' style={{width:'100%'}} type='password' variant='outlined' label='password' id='password' margin='dense'/>
                    <Button style={{marginTop:'10px',width:'40%',textAlign:'center', position:'relative',
                        left:'50%',transform:'translate(-50%,0%)'}} variant='contained' onClick={SignIn}>Sign-Up
                    </Button>
                </form>
            </div>
        </Dialog>
        );
    }
    const onCloseModal =()=>{
        setSignInIsOpen(false);
    }

    const LogIn=async ()=>{
        var formData = new FormData(document.getElementById('log-in-form'));
        var formObj ={};
        for(const [key,value] of formData){
            formObj[key]=value;
        }
        var response = await fetch(config.EXPRESS_APP_BASE_URL +'/users/LogIn',{
            method:'POST',headers:new Headers({'content-type':'application/json'}),
            // body:JSON.stringify(`email=${formObj['email']}&password=${formObj['password']}`),
            body:JSON.stringify({email:formObj['email'],password:formObj['password']}),
        });
        // response= await response.json();
        response=await response.json();
        console.log(response);
        if(response.message!='success'){
            setLoginState({errors:[...response.message]})
        }else{
            if(response.user['profilePicUrl']!=undefined){
                const base64String= btoa(String.fromCharCode(...new Uint8Array(response.user['profilePicUrl'].data.data)));
                response.user['profilePicUrl']=`data:${response.user['profilePicUrl'].contentType};base64,${base64String}`;
            }
            window.sessionStorage.setItem('user',JSON.stringify(response.user));
            setLoginState({errors:[]});
            navigate('/Odinbook-react-app/Home');
        }
    }
    const responseSuccessGoogle=async(response)=>{
        var response =await fetch(config.REACT_APP_BASE_URL +'/users/auth/google/token', {
            method:'POST',headers:new Headers({'content-type':'application/json'}),mode:'cors',
            body:JSON.stringify({token:response.credential}),
        });
        response= await response.json();
        console.log(response);
        if(response.message=='success'){
            window.sessionStorage.setItem('user',JSON.stringify(response.user));
            //redirect to home
        }else{
            throw 'server error';
        }
    }
    const LoginExampleUser =async()=>{
        await setLoginLoading(true);
        var response = await fetch(config.EXPRESS_APP_BASE_URL +'/users/LogIn',{
            method:'POST',headers:new Headers({'content-type':'application/json'}),
            // body:JSON.stringify(`email=${formObj['email']}&password=${formObj['password']}`),
            body:JSON.stringify({email:'ExampleUser@mail.com',password:'ExampleUser@mail.com'}),
        });
        await setLoginLoading(false);
        response=await response.json();
        if(response.message=='success'){
            window.sessionStorage.setItem('user',JSON.stringify(response.user));
            setLoginState({errors:[]});
            navigate('/Odinbook-react-app/Home');
        }
    }
    

    return (
        <div className='flex-container'>
            <SignInModal open={signInIsOpen} handleClose={onCloseModal}/>
            <div className='heading'>
                <img src={odinbookImg} width="200px" height="50px"/>
                <div> Connect with friends and the world around you on Odinbook. </div>
            </div>
            <form id='log-in-form' className='my-form'>
                <TextField variant='outlined' required label='Email' name='email' id='email' margin='normal' style={{width:'100%'}}/>
                <TextField variant='outlined' type='password' required label='password' name='password' id='password' margin='normal' style={{width:'100%'}}/>              
                {logInState.errors.length!=0 && <div style={{color:'red',margin:'5px',fontSize:'0.9rem'}}>
                    {logInState.errors}
                    </div>}
                <MyButton onClick={LogIn}> Log In </MyButton>
                <MyButton onClick={(e)=>{ e.preventDefault();setSignInIsOpen(!signInIsOpen);}}
                 style={{backgroundColor:'rgb(72, 182, 54)'}}> Create an account </MyButton>
                <MyButton onClick ={(e)=>{e.preventDefault(); LoginExampleUser();}} style={{backgroundColor:'orange'}}>
                    {loginLoading?'Loading':'Test drive an existing account'} </MyButton>
                {/* <MyButton style={{backgroundColor:'blue'}} onClick={GoogleLogIn}>  Log in with Google</MyButton> */}
                <div style={{margin:'9px auto'}}>
                <GoogleLogin onSuccess={responseSuccessGoogle} onError={()=>{console.log('something went wrong');}}/>
                </div>
            </form>
        </div>
    );
}

export default SignInForm;