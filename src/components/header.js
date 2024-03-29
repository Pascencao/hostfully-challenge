import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Auth from '../services/authentication'
import { useContext } from 'react';
import { pageContext } from '../App';

export const Header = ({onLogout, onLogin}) => {
    const {pageContent} = useContext(pageContext)
    const HandleLogout = () => {
        Auth.logout()
        onLogout()
    }
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    sx={{ mr: 2 }}
                >
                    <MenuIcon />
                </IconButton>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Calendar
                </Typography>

                {pageContent.user?.id ? 
                  <Button color="inherit" onClick={HandleLogout}>Logout</Button> 
                : <Button color="inherit" onClick={onLogin}>Login</Button>}
                </Toolbar>
            </AppBar>
        </Box>
    )
}