import * as React from 'react';
import { Box, Button, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material';
import { Add, Edit, Delete, Visibility } from '@mui/icons-material';

// Sample data for players
const playersData = [
  { id: 1, fullName: 'John Doe', teamName: 'Football Team A' },
  { id: 2, fullName: 'Jane Smith', teamName: 'Basketball Team B' },
  { id: 3, fullName: 'Alice Johnson', teamName: 'Baseball Team C' },
];

const PlayersPage = () => {
  const [filter, setFilter] = React.useState('');

  // Filter the players data based on the filter text
  const filteredPlayersData = playersData.filter(player =>
    player.fullName.toLowerCase().includes(filter.toLowerCase())
  );

  const handleAddPlayer = () => {
    // Logic to add a new player
    console.log('Add Player clicked');
  };

  const handleView = (id: any) => {
    // Logic to view details of the player
    console.log(`View details for player with ID: ${id}`);
  };

  const handleEdit = (id: any) => {
    // Logic to edit the player
    console.log(`Edit player with ID: ${id}`);
  };

  const handleDelete = (id: any) => {
    // Logic to delete the player
    console.log(`Delete player with ID: ${id}`);
  };

  const handleApprove = (id: any) => {
    // Logic to approve the player
    console.log(`Approve player with ID: ${id}`);
  };

  const handleReject = (id:any) => {
    // Logic to reject the player
    console.log(`Reject player with ID: ${id}`);
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
          onClick={handleAddPlayer}
          sx={{ color: "#8FC6DC" }}
        >
          Add Player
        </Button>
      </Box>
      <TableContainer sx={{ flexGrow: 1, borderRadius: 2, overflow: 'hidden', boxShadow: 1 }}>
        <Table sx={{ backgroundColor: 'white' }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ backgroundColor: '#8FC6DC', color: 'white', fontSize: "17px" }}>ID</TableCell>
              <TableCell sx={{ backgroundColor: '#8FC6DC', color: 'white', fontSize: "17px" }}>FULL NAME</TableCell>
              <TableCell sx={{ backgroundColor: '#8FC6DC', color: 'white', fontSize: "17px" }}>TEAM NAME</TableCell>
              <TableCell sx={{ backgroundColor: '#8FC6DC', color: 'white', fontSize: "17px" }}>ACTIONS</TableCell>
              <TableCell sx={{ backgroundColor: '#8FC6DC', color: 'white', fontSize: "17px" }}>STATUS</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPlayersData.map((player) => (
              <TableRow key={player.id}>
                <TableCell>{player.id}</TableCell>
                <TableCell>{player.fullName}</TableCell>
                <TableCell>{player.teamName}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleView(player.id)}>
                    <Visibility />
                  </IconButton>
                  <IconButton onClick={() => handleEdit(player.id)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(player.id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
                <TableCell>
                  <Button variant="outlined" color="success" onClick={() => handleApprove(player.id)} sx={{ marginRight: 1 }}>
                    Approve
                  </Button>
                  <Button variant="outlined" color="error" onClick={() => handleReject(player.id)}>
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

export default PlayersPage;
