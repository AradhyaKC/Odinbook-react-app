import Box from '@mui/material/Box';

// don not need it for now
function MyBox(props){
    const {children} =props;
    var newProps={...props};
    newProps.children=undefined;

    //add variants 
    return (
        // sx={{borderColor:'text.primary',borderWidth:'1px',borderStyle:'solid',borderRadius:'4px'}}
        <Box {...newProps}>
            {children}
        </Box>
    );
}

export default MyBox;