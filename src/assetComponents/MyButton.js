import '../styles/commonStyles.css';
import {Button} from '@mui/material';

function MyButton(props){
    return (
        <Button className='form-button' variant='contained' {...props}>{props.children}</Button>
    );
}

export default MyButton;
