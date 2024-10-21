import * as React from 'react';
import { Alert, Box, Button, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import { Add, Edit, Delete, Visibility } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { SportTypeInput, SportTypeView } from '../../models/model';
import { addSportType, getAllSportsTypes } from '../../api/sportType';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';


const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<unknown>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});


const SportsType = () => {
  const [filter, setFilter] = useState('');
  const [sportsData, setSportsData] = useState<SportTypeView[]>([])
  const [open, setOpen] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false)
  const [openError, setOpenError] = useState(false)
  const [name, setName] = useState("")
  const [teamsCount, setTeamsCount] = useState(0)
  const [playersCount, setPlayersCount] = useState(0)
  const [loading, setLoading] = useState(false)

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const getSports = async () => {
    var sportsTypes = (await getAllSportsTypes()).payload
    setSportsData(sportsTypes);
  }

  useEffect(() => {
    getSports();
  }, []);

  const filteredSportsData = sportsData.filter(sport =>
    sport.name.toLowerCase().includes(filter.toLowerCase())
  );

  const handleAddSportsType = async () => {
    try {
      var input: SportTypeInput = {
        name: name,
        teamsCount: teamsCount,
        playersCount: playersCount
      }
      await addSportType(input)
      setOpenSuccess(true)
    } catch (ex) {
      setOpenError
    }
  };

  const handleEdit = (id: number) => {
    console.log(`Edit sport type with ID: ${id}`);
  };

  const handleDelete = (id: number) => {
    console.log(`Delete sport type with ID: ${id}`);
  };

  const handleView = (id: number) => {
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
          sx={{ width: '200px', backgroundColor: 'white' }}
        />
        <Button
          variant="outlined"
          color="primary"
          startIcon={<Add />}
          onClick={handleClickOpen}
          sx={{ color: "rgb(91, 139, 197)" }}
        >
          Add Sport Type
        </Button>
      </Box>
      <TableContainer sx={{ flexGrow: 1, borderRadius: 2, overflow: 'hidden', boxShadow: 1 }}>
        <Table sx={{ backgroundColor: 'white' }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ backgroundColor: 'rgba(91, 139, 197,0.7)', color: 'white', fontSize: "17px" }}>ID</TableCell>
              <TableCell sx={{ backgroundColor: 'rgba(91, 139, 197,0.7)', color: 'white', fontSize: "17px" }}>NAME</TableCell>
              <TableCell sx={{ backgroundColor: 'rgba(91, 139, 197,0.7)', color: 'white', fontSize: "17px" }}>PLAYERS COUNT</TableCell>
              <TableCell sx={{ backgroundColor: 'rgba(91, 139, 197,0.7)', color: 'white', fontSize: "17px" }}>TEAMS COUNT</TableCell>
              <TableCell sx={{ backgroundColor: 'rgba(91, 139, 197,0.7)', color: 'white', fontSize: "17px" }}>ACTIONS</TableCell>
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
      {/* Add sport type */}

      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              NEW SPORT TYPE
            </Typography>
            <Button autoFocus color="inherit" onClick={handleClose}>
              DONE
            </Button>
          </Toolbar>
        </AppBar>
        {openSuccess ??
          <Alert sx={{ marginRight: "10px", marginLeft: "10px", marginTop: "10px" }} severity="success">Sports Type Added Successfully!</Alert>
        }
        {openError ??
          <Alert sx={{ marginRight: "10px", marginLeft: "10px", marginTop: "10px" }} severity="error">Something went wrong, please contat the administrator.</Alert>
        }
        <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: "30px" }}>
          <span style={{ fontSize: "13px", color: "rgba(0,0,0,0.5)", paddingRight: "170px" }}>*Fill all fields to add a new sports type.</span>
          <TextField
            label="Name"
            name="name"
            value={name}
            onChange={(ev) => { setName(ev.target.value) }}
            margin="normal"
            sx={{ width: "400px" }}
          />
          <TextField
            label="Teams Count"
            name="teamsCount"
            type="number"
            value={teamsCount}
            onChange={(ev) => { setTeamsCount(ev.target.value as unknown as number) }}
            margin="normal"
            sx={{ width: "400px" }}
          />
          <TextField
            label="Players Count"
            name="playersCount"
            type="number"
            value={playersCount}
            onChange={(ev) => { setPlayersCount(ev.target.value as unknown as number) }}
            margin="normal"
            sx={{ width: "400px" }}
          />
          <Button
            variant="contained"
            color="primary"
            // onClick={handleClickOpen}
            sx={{ color: "white", width: "200px", marginTop: "10px" }}>
            SUBMIT
          </Button>
        </Box>
      </Dialog>
    </Box>
  );
};

export default SportsType;
