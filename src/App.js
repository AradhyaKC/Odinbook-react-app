import './App.css';
import {useState} from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignInForm from './Components/SignInComponent/SignInForm.js';
import Navbar from './Components/NavbarComponent/Navbar.js';
import { ThemeProvider, createTheme,Button} from '@mui/material';
import Profile from './Components/ProfileComponent/Profile.js';
import Box from '@mui/material/Box';
import HomeComponent from './Components/HomeComponent/HomeComponent';

function App() {
  
  const darkTheme = createTheme({
    palette: {
      mode:'dark',
      grey:{
        '800':'#333333',
        'A700':'#121212'
      }
      // primary: {
        //   main:'#272727',
        // },
      },
  });
  const defaultTheme=createTheme({
    palette:{
      mode:'light',
    }
  });
  
  const [state, setState] = useState({theme:'default'});
    
  const ToggleTheme = async ()=>{
    await setState((prevState)=>{
      var newState= {...prevState};
      if(prevState.theme=='default')
        newState.theme='dark';
      else newState.theme='default';
      return newState;
    });
    return state.theme;
  }
  const setTheme = async(theme)=>{
    await setState(theme);
  }
  

  const TempIndexComponent=()=>{ return <div>you are now viewing the esteemed index page </div>}
  return (
    <div className="center">
      <ThemeProvider theme={state.theme=='default'?defaultTheme:darkTheme}>
        <BrowserRouter>
          <Navbar setTheme={setTheme} toggleTheme={ToggleTheme}/>
          <Box sx={{height:'100%',width:'100%',flexGrow:'1',display:'flex',flexDirection:'column',
          backgroundColor:(state.theme=='dark'?'grey.900':'grey.200')}}>
            <div style={{height:'40px',}}> hello there</div>
          {/* position:'relative',transform:'translate(-50%,0%)',left:'50%'}}> */}
            <Routes>
              <Route path='/' element={ <TempIndexComponent/>}/>
              <Route path='/LogIn' element={<SignInForm/>}/>
              <Route path='/Profile/:personId' element={<Profile/>}/>
              <Route path='/Home' element={<HomeComponent/>}/>
            </Routes>
          </Box>
        </BrowserRouter>
      </ThemeProvider>
    </div>
  );
}

export default App;
