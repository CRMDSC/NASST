import * as React from 'react';
import { Box, Button, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import { Add, Edit, Delete, Visibility } from '@mui/icons-material';

// Sample data for sports
const sportsData = [
  { id: 1, name: 'Football', playersCount: 22, teamsCount: 2 },
  { id: 2, name: 'Basketball', playersCount: 10, teamsCount: 2 },
  { id: 3, name: 'Baseball', playersCount: 18, teamsCount: 2 },
];

const SportsType = () => {
  const [filter, setFilter] = React.useState('');

  // Filter the sports data based on the filter text
  const filteredSportsData = sportsData.filter(sport => 
    sport.name.toLowerCase().includes(filter.toLowerCase())
  );

  const handleAddTeam = () => {
    // Logic to add a new team
    console.log('Add Team clicked');
  };

  const handleEdit = (id: number) => {
    // Logic to edit the sport type
    console.log(`Edit sport type with ID: ${id}`);
  };

  const handleDelete = (id: number) => {
    // Logic to delete the sport type
    console.log(`Delete sport type with ID: ${id}`);
  };

  const handleView = (id: number) => {
    // Logic to view details of the sport type
    console.log(`View details for sport type with ID: ${id}`);
  };

  return (
    <Box sx={{ padding: 3, display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
        <TextField
          variant="outlined"
          placeholder="Filter by name"
          value={filter}
          size='small'
          onChange={(e) => setFilter(e.target.value)}
          sx={{ width: '200px', backgroundColor: 'white' }} // White background for the input
        />
        <Button
          variant="outlined"
          color="primary"
          startIcon={<Add />}
          onClick={handleAddTeam}
          sx={{ color: "#8FC6DC" }}
        >
          Add Sport Type
        </Button>
      </Box>
      <TableContainer sx={{ flexGrow: 1, borderRadius: 2, overflow: 'hidden', boxShadow: 1 }}>
        <Table sx={{ backgroundColor: 'white' }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ backgroundColor: '#8FC6DC', color: 'white',  fontSize:"17px" }}>ID</TableCell>
              <TableCell sx={{ backgroundColor: '#8FC6DC', color: 'white', fontSize:"17px" }}>NAME</TableCell>
              <TableCell sx={{ backgroundColor: '#8FC6DC', color: 'white', fontSize:"17px" }}>PLAYERS COUNT</TableCell>
              <TableCell sx={{ backgroundColor: '#8FC6DC', color: 'white', fontSize:"17px"  }}>TEAMS COUNT</TableCell>
              <TableCell sx={{ backgroundColor: '#8FC6DC', color: 'white', fontSize:"17px" }}>ACTIONS</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredSportsData.map((sport) => (
              <TableRow key={sport.id}>
                <TableCell>{sport.id}</TableCell>
                <TableCell>{sport.name}</TableCell>
                <TableCell>{sport.playersCount}</TableCell>
                <TableCell>{sport.teamsCount}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleView(sport.id)}>
                    <Visibility />
                  </IconButton>
                  <IconButton onClick={() => handleEdit(sport.id)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(sport.id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default SportsType;
