import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Teams from '../Teams/TeamPage';
import SportsTypes from '../SportTypes/sportTypesPage';
import Players from '../Players/PlayersPage';
import { inject, observer } from 'mobx-react';
import { UserStore } from '../../store/user';

interface Props {
    user: UserStore;
}

const AdminDashboard = inject('user')(observer(({ user }: Props) => {

    const [value, setValue] = React.useState(0);
    const navigate = useNavigate();

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        console.log(newValue);
        setValue(newValue);
    };

    const handleLogout = () => {
        user.logout();
        navigate('/'); 
    };

    return (
        <Box>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '100%',
                    bgcolor: 'background.paper',
                    padding: '10px',
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {/* Logo */}
                    <Box component="img" src="path/to/logo.png" alt="Logo" sx={{ height: '40px', marginRight: 2 }} /> {/* Update with the correct logo path */}
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        variant="scrollable"
                        scrollButtons
                        allowScrollButtonsMobile
                        aria-label="scrollable force tabs example"
                    >
                        <Tab label="Sport Types" />
                        <Tab label="Teams" />
                        <Tab label="Players" />
                    </Tabs>
                </Box>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleLogout}
                    sx={{ width: '200px', marginRight: '30px', color: 'white' }}
                >
                    Logout
                </Button>
            </Box>
            <Divider />
            {value === 0 ? (
                <div style={{ backgroundColor : '#f9f9f9', height:"100vh"}}>   <SportsTypes /></div>
             
            ) : value === 1 ? (
                <Teams />
            ) : (
                <Players />
            )}
        </Box>
    );
}));

export default AdminDashboard; 
