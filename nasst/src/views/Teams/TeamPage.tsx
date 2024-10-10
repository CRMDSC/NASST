import * as React from 'react';
import { Box, Button, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import { Add, Edit, Delete, Visibility } from '@mui/icons-material';

// Sample data for teams
const teamsData = [
  { id: 1, name: 'Team A', sportType: 'Football', players: ['Player 1', 'Player 2', 'Player 3'] },
  { id: 2, name: 'Team B', sportType: 'Basketball', players: ['Player 4', 'Player 5'] },
  { id: 3, name: 'Team C', sportType: 'Baseball', players: ['Player 6', 'Player 7', 'Player 8', 'Player 9'] },
];

const TeamsPage = () => {
  const [filter, setFilter] = React.useState('');

  // Filter the teams data based on the filter text
  const filteredTeamsData = teamsData.filter(team =>
    team.name.toLowerCase().includes(filter.toLowerCase())
  );

  const handleAddTeam = () => {
    // Logic to add a new team
    console.log('Add Team clicked');
  };

  const handleEdit = (id: number) => {
    // Logic to edit the team
    console.log(`Edit team with ID: ${id}`);
  };

  const handleDelete = (id: number) => {
    // Logic to delete the team
    console.log(`Delete team with ID: ${id}`);
  };

  const handleView = (id: number) => {
    // Logic to view details of the team
    console.log(`View details for team with ID: ${id}`);
  };

  const handleApprove = (id: number) => {
    // Logic to approve the team
    console.log(`Approve team with ID: ${id}`);
  };

  const handleReject = (id: number) => {
    // Logic to reject the team
    console.log(`Reject team with ID: ${id}`);
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
          Add Team
        </Button>
      </Box>
      <TableContainer sx={{ flexGrow: 1, borderRadius: 2, overflow: 'hidden', boxShadow: 1 }}>
        <Table sx={{ backgroundColor: 'white' }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ backgroundColor: '#8FC6DC', color: 'white', fontSize: "17px" }}>ID</TableCell>
              <TableCell sx={{ backgroundColor: '#8FC6DC', color: 'white', fontSize: "17px" }}>NAME</TableCell>
              <TableCell sx={{ backgroundColor: '#8FC6DC', color: 'white', fontSize: "17px" }}>SPORT TYPE</TableCell>
              <TableCell sx={{ backgroundColor: '#8FC6DC', color: 'white', fontSize: "17px" }}>PLAYERS</TableCell>
              <TableCell sx={{ backgroundColor: '#8FC6DC', color: 'white', fontSize: "17px" }}>ACTIONS</TableCell>
              <TableCell sx={{ backgroundColor: '#8FC6DC', color: 'white', fontSize: "17px" }}>STATUS</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTeamsData.map((team) => (
              <TableRow key={team.id}>
                <TableCell>{team.id}</TableCell>
                <TableCell>{team.name}</TableCell>
                <TableCell>{team.sportType}</TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ maxHeight: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {team.players.join(', ')}
                  </Typography>
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleView(team.id)}>
                    <Visibility />
                  </IconButton>
                  <IconButton onClick={() => handleEdit(team.id)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(team.id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
                <TableCell>
                  <Button variant="outlined" color="success" onClick={() => handleApprove(team.id)} sx={{ marginRight: 1 }}>
                    Approve
                  </Button>
                  <Button variant="outlined" color="error" onClick={() => handleReject(team.id)}>
                    Reject
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default TeamsPage;
