import React from 'react';
import { Box, Button, TextField, Typography, Container, Grid, Paper, Avatar } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Link } from 'react-router-dom';


const LoginPage = () => {
    return (
        <div>
            <Container component="main" maxWidth="xs" sx={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Paper elevation={6} sx={{ padding: 4, borderRadius: 4, backgroundColor: '#fff', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Avatar sx={{ m: 1, bgcolor: '#8FC6DC' }}> <LockOutlinedIcon /> </Avatar>
                    <Typography component="h1" variant="h5"> Sign in </Typography>
                    <Box component="form" noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            variant="outlined"
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            variant="outlined"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{fontSize: "17px", mt: 3, mb: 2, backgroundColor: '#8FC6DC', color: "white",'&:hover': { backgroundColor: '#6ba9bf' }, }}>
                            Sign In
                        </Button>
                        <div style={{ width: '100%', marginTop: '20px', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Link to="/reset-password" style={{ textDecoration: 'none', color: '#1976d2' }}>
                                <Typography variant="body2">Forgot password?</Typography>
                            </Link>
                            <Link to="/signUp" style={{ textDecoration: 'none', color: '#1976d2' }}>
                                <Typography variant="body2">Don't have an account? Register</Typography>
                            </Link>
                        </div>
                    </Box>
                </Paper>
            </Container>
        </div>
    );
};

export default LoginPage;
