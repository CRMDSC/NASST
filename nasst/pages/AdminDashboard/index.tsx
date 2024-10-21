import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Teams from '../../src/views/Teams/TeamPage';
import SportsTypes from '../../src/views/SportTypes/sportTypesPage';
import Players from '../../src/views/Players/PlayersPage';
import Cateories from '../../src/views/Categories/index';
import { inject, observer } from 'mobx-react';
import { UserStore } from '../../src/store/user';
import { useRouter } from 'next/router';


interface Props {
    user: UserStore;
}

const AdminDashboard = inject('user')(observer(({ user }: Props) => {

    const [value, setValue] = React.useState(0);
    const router = useRouter();

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        console.log(newValue);
        setValue(newValue);
    };

    const handleLogout = () => {
        user.logout();
        router.push('/'); 
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
                    <Box component="img" src="path/to/logo.png" alt="Logo" sx={{ height: 'auto', marginRight: 2 }} /> 
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        variant="scrollable"
                        scrollButtons
                        allowScrollButtonsMobile
                        aria-label="scrollable force tabs example"
                    >
                        <Tab label="Categories" />
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
            {/* <Divider /> */}
            {value === 0 ? (
                <div style={{ backgroundColor : '#f9f9f9', height:"100vh"}}>   <Cateories/></div>
             
            ) : value === 1 ? (
                <SportsTypes />
            )  : value === 2 ? (
                <Teams />
            ) : (
                <Players />
            )}
        </Box>
    );
}));

export default AdminDashboard; 
