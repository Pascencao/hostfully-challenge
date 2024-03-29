import { Box, Button, FormControl, Input, InputLabel, Modal, Snackbar, Typography } from "@mui/material"
import { useState } from "react";
import Auth from '../services/authentication';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export const Login = ({open, onClose})=>{
    const users = Auth.getUsers();
    const [isOpen, setIsOpen] = useState(open);
    const [registerUser, setRegisterUser] = useState(!users.length)
    const [formError, setFormError] = useState('')
    const [newUserForm, setNewUserForm] = useState({user: '', password: '', confirmPassword: ''})
    const [loginForm, setLoginForm] = useState({user: '',password: ''}) 
    const handleClose = (user)=>{
        onClose(user)
    }
    const handleRegisterUser = (e)=>{
        e.preventDefault()
        if(newUserForm.user && newUserForm.password === newUserForm.confirmPassword){
            const newUser = Auth.register(newUserForm.user, newUserForm.password)
            handleClose(newUser)
            setIsOpen(false)
        } else {
            setFormError(!newUserForm.user ? "User can not be empty" : "Pasword doesn't match")
        }
    }
    const handleLogin = (e)=>{
        e.preventDefault()
        const user = Auth.login(loginForm.user, loginForm.password)
        if(user){
            handleClose(user)
            setIsOpen(false)
        } else {
            setFormError("Wrong username or password")
        }
    }
    return (
        <>
        <Modal
            open={isOpen}
            onClose={handleClose}
        >
            <Box sx={style}>
            {registerUser ? 
                <form onSubmit={handleRegisterUser}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">Register User</Typography>
                    <FormControl style={{width: '100%', marginTop: '30px'}}>
                        <InputLabel htmlFor="my-input">User</InputLabel>
                        <Input onChange={(e)=>setNewUserForm({...newUserForm, user: e.target.value})}
                            id="User" aria-describedby="User" />
                    </FormControl>
                    <FormControl style={{width: '100%', marginTop: '30px'}}>
                        <InputLabel htmlFor="my-input">Password</InputLabel>
                        <Input onChange={(e)=>setNewUserForm({...newUserForm, password: e.target.value})}
                            type="password" id="Password" aria-describedby="Password" />
                    </FormControl>
                    <FormControl style={{width: '100%', marginTop: '30px'}}>
                        <InputLabel htmlFor="my-input">Confirm Password</InputLabel>
                        <Input onChange={(e)=>setNewUserForm({...newUserForm, confirmPassword: e.target.value})}
                            type="password" id="confirmPassword" aria-describedby="Password" />
                    </FormControl>
                    <Button type="submit">Submit</Button>
                    {!!users.length && <Button type="button" onClick={()=>setRegisterUser(false)}>Cancel</Button>}
                </form>
                :
                <form onSubmit={handleLogin}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">Login</Typography>
                    <FormControl style={{width: '100%', marginTop: '30px'}}>
                        <InputLabel htmlFor="my-input">User</InputLabel>
                        <Input onChange={(e)=>setLoginForm({...loginForm, user: e.target.value})}
                            value={loginForm.user} 
                            id="User" aria-describedby="User" />
                    </FormControl>
                    <FormControl style={{width: '100%', marginTop: '30px'}}>
                        <InputLabel htmlFor="my-input">Password</InputLabel>
                        <Input onChange={(e)=>setLoginForm({...loginForm, password: e.target.value})}
                            type="password" id="Password" aria-describedby="Password" />
                    </FormControl>
                    <Button type="submit">Login</Button>
                    {!!users.length && <Button type="button"  onClick={(e)=>{
                        e.preventDefault(); 
                        setRegisterUser(true);
                    }}>Register</Button>}
                </form>
                
            }
        </Box>
        </Modal>
        <Snackbar
            open={!!formError}
            autoHideDuration={4000}
            message={formError}
        />
    </>
    )
}
