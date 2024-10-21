import React, { FormEvent, useState } from 'react';
import { Container, Paper, Avatar, Typography, Box, TextField, Button, InputAdornment, IconButton } from '@mui/material';
import { LockOutlined as LockOutlinedIcon, VisibilityOff } from '@mui/icons-material';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { RegisterInput } from '../../models/model';
import { register } from '../../api/account';

const RegisterPage = () => {
    const [firstname, setFirstame] = useState("");
    const [lastname, setLastname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState<string[]>([]);
    const [registered, setRegistered] = useState(false)

    const navigate = useNavigate();

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const signUp = async (e: FormEvent) => {
        e.preventDefault();
        const newErrors: string[] = [];
        if (!firstname || !lastname || !email || !password || !confirmPassword) {
            newErrors.push("All fields must be filled.");
        }

        if (!validateEmail(email)) {
            newErrors.push("Please enter a valid email address.");
        }

        if (password !== confirmPassword) {
            newErrors.push("Passwords do not match.");
        }


        const input: RegisterInput = {
            firstName: firstname,
            lastName: lastname,
            email: email,
            password: password,
            role: "Admin"
        };
        try {
            const registerResponse = await register(input);
            navigate("/")
        } catch (data: any) {
            const errors = data.errors as any[]
            if (errors) {
                newErrors.push(errors[0].description)
            }
        }
        if (newErrors.length > 0) {
            setErrors(newErrors);
            return;
        }
    };

    return (
        <Container component="main" maxWidth="xs" sx={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Paper elevation={6} sx={{ padding: 4, borderRadius: 4, backgroundColor: '#fff', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Avatar sx={{ m: 1, bgcolor: 'rgb(91, 139, 197)' }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5"> Register </Typography>
                <Box component="form" noValidate sx={{ mt: 1 }}>
                    {errors.length > 0 && (
                        <Box sx={{ color: 'red', marginBottom: 2 }}>
                            {errors.map((error, index) => (
                                <span style={{ fontSize: "11px" }} key={index}>{error}</span>
                            ))}
                        </Box>
                    )}
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="firstName"
                        label="First Name"
                        name="firstName"
                        autoComplete="given-name"
                        autoFocus
                        variant="outlined"
                        onChange={(ev) => setFirstame(ev.target.value)}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="lastName"
                        label="Last Name"
                        name="lastName"
                        autoComplete="family-name"
                        variant="outlined"
                        onChange={(ev) => setLastname(ev.target.value)}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        variant="outlined"
                        onChange={(ev) => setEmail(ev.target.value)}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                       type="password"
                        id="password"
                        autoComplete="new-password"
                        variant="outlined"
                        onChange={(ev) => setPassword(ev.target.value)}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="confirmPassword"
                        label="Confirm Password"
                        type="password"
                        id="confirmPassword"
                        autoComplete="new-password"
                        variant="outlined"
                        onChange={(ev) => setConfirmPassword(ev.target.value)}
                    />

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ fontSize: "17px", mt: 3, mb: 2, color: "white", '&:hover': { backgroundColor: '#6ba9bf' } }}
                        onClick={signUp}
                    >
                        Register
                    </Button>
                    <div style={{ width: '100%', marginTop: '20px', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Link to="/" style={{ textDecoration: 'none', color: '#1976d2' }}>
                            <Typography variant="body2">Already have an account? Sign In</Typography>
                        </Link>
                    </div>
                </Box>
            </Paper>
        </Container>
    );
};

export default RegisterPage;
