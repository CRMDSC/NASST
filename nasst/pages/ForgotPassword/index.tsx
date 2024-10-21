import React, { FormEvent, useState } from 'react';
import { Container, Paper, Avatar, Typography, Box, TextField, Button, InputAdornment, IconButton } from '@mui/material';
import { LockOutlined as LockOutlinedIcon, VisibilityOff } from '@mui/icons-material';
import { RegisterInput } from '../../src/models/model';
import { register } from '../../src/api/account';
import { useRouter } from 'next/router';
import Link from 'next/link';

const ForgotPassword = () => {
   
    return (
     <>Forgot password page to be constructed</>
    );
};

export default ForgotPassword;
