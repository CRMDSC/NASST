import React, { FormEvent } from "react";
import { Navigate } from "react-router-dom";
import { inject } from "mobx-react";
import { UserStore } from "../../store/user";
import { LoginInput } from "../../models/model";
import { Box, Button, TextField, Typography, Container, Grid, Paper, Avatar, InputAdornment, IconButton } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Link } from 'react-router-dom';


interface ILoginState {
    email: string;
    password: string;
    hasLoggedIn: boolean;
    emailError: string;
    passwordError: string;
    passwordDialogOpen: boolean;
    showPass: boolean;
    firstLogin: boolean;
    loading: boolean;
    error: boolean;
}

type Props = Readonly<{ user?: UserStore; }>;

@inject("user")
class Login extends React.Component<Props, ILoginState> {

    constructor(props: Props) {
        super(props);
        this.state = {
            showPass: false,
            passwordDialogOpen: false,
            email: "",
            password: "",
            emailError: "",
            passwordError: "",
            hasLoggedIn: false,
            firstLogin: false,
            loading: false,
            error: false,
        };
    }

    validateForm = () => {
        const { email, password } = this.state;
        return email.length > 0 && password.length > 0;
    };

    submit = async (e: FormEvent) => {
        e.preventDefault()
        this.setState({ loading: true })
        var firstLogin = false;
        try {
            console.log("LOGIN")
            var loginResponse = await this.props.user?.login({
                email: this.state.email,
                password: this.state.password,
                fcmToken: ""
            } as LoginInput);
        } catch (data: any) {
            const errors = data.errors as any[];
            if (errors) {
                this.setState({
                    error: true,
                    emailError: errors.filter((x) => x.code === "NotFound")[0]?.description ?? "",
                    passwordError: errors.filter((x) => x.code === "IncorrectPassword")[0]?.description ?? "",
                });
            }
        }
        this.setState({ hasLoggedIn: this.props.user?.isLoggedIn || false, firstLogin, loading: false });
    };

    render() {
        if (this.props.user?.isLoggedIn) {
            if(this.props.user?.role == "Admin")
            return <Navigate to={`/AdminDashboard`} />;

        }

        return (
            <div>
                <Container component="main" maxWidth="xs" sx={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Paper elevation={6} sx={{ padding: 4, borderRadius: 4, backgroundColor: '#fff', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Avatar sx={{ m: 1, bgcolor: 'rgb(91, 139, 197)' }}> <LockOutlinedIcon /> </Avatar>
                        <Typography component="h1" variant="h5"> Sign in </Typography>
                        <Box component="form" noValidate sx={{ mt: 1 }}>
                            {this.state.error ?
                                <><span style={{fontSize:"11px", color:"red"}}>{this.state.emailError}</span><span style={{fontSize:"11px", color:"red"}}>{this.state.passwordError}</span></>
                                : <></>
                            }
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
                                onChange={(ev) => this.setState({ email: ev.target.value })}
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
                                onChange={(ev) => this.setState({ password: ev.target.value })}
                            />
                            <Button
                                onClick={(e) => this.submit(e)}
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ fontSize: "17px", mt: 3, mb: 2, color: "white", '&:hover': { backgroundColor: '#6ba9bf' }, }}>
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
    }
}
export default (Login);