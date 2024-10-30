import * as React from 'react';
import { Alert, Box, Button, Divider, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Typography } from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import CircularProgress from '@mui/material/CircularProgress';
import { useEffect, useState } from 'react';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import { addPlayer, DeletePlayer, editPlayer, getPlayers } from '../../api/player';
import { Category, EditPlayerInput, Player, PlayerInput } from '../../models/model';
import Autocomplete from '@mui/material/Autocomplete';
import { getCategories } from '../../api/category';
import { editableInputTypes } from '@testing-library/user-event/dist/utils';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Players = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [filter, setFilter] = useState('');
  const [loader, setLoader] = useState(false);
  const [categories, setCategories] = useState<Category[]>([])
  const [category, setCategory] = useState<Category>()
  const [addInput, setAddInput] = useState<PlayerInput>({
    firstName: "",
    lastName: "",
    categoryId: 0,
    email: "",
    phoneNumber: ""
  })
  const [editInput, setEditInput] = useState<EditPlayerInput>({
    id: 0,
    firstName: "",
    lastName: "",
    categoryId: 0,
    email: "",
    phoneNumber: "",
    category: "" as unknown as Category
  })

  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [errorAlert, setErrorAlert] = useState(false)
  const [openDelete, setOpenDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(0);
  const [successMessage, setSuccessMessage] = useState('');
  const [formExpanded, setFormExpanded] = useState(false);
  const [editFormExpanded, setEditFormExpanded] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);


  const handleChangePage = (event: any, newPage: any) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoader(true);

      const players = await getPlayers();
      setPlayers(players.payload);

      const categories = await getCategories();
      setCategories(categories.payload)

      setAddInput({
        firstName: "",
        lastName: "",
        categoryId: 0,
        email: "",
        phoneNumber: ""
      })
      setEditInput({
        id: 0,
        firstName: "",
        lastName: "",
        categoryId: 0,
        email: "",
        phoneNumber: "",
        category: "" as unknown as Category
      })
      setCategory({ id: 0, name: "", isArchived: false })
      setLoader(false);
    } catch (ex) {
      setLoader(false);
      console.error(ex);
    }
  };

  const filteredPlayers = players.filter((player) =>
    player?.firstName?.toLowerCase().includes(filter.toLowerCase())
  );

  const toggleForm = () => {
    setFormExpanded(!formExpanded);
  };
  const toggleEditForm = (input: Player) => {
    setEditInput({
      id: input.id,
      categoryId: input.categortId,
      email: input.email ?? "",
      firstName: input.firstName ?? "",
      lastName: input.lastName ?? "",
      phoneNumber: input.phoneNumber ?? "",
      category: input.category
    })
    setEditFormExpanded(!editFormExpanded);
  };
  const hanldeAddPlayer = async () => {
    try {
      setLoader(true)
      await addPlayer(addInput)
      setSuccessMessage("Player addedd successfully.")
      setSuccess(true)
      fetchData()
      setLoader(false)

    } catch (ex: any) {
      setLoader(false)
      if (ex && ex.errors && Array.isArray(ex.errors)) {
        const errorMessages = ex.errors.map((error: any) => error.description).join(', ');
        setErrorAlert(true)
        console.log(errorMessages)
        setError(errorMessages);
      }
    }
  }
  const hanldeEditPlayer = async () => {
    try {
      setLoader(true)
      await editPlayer(editInput)
      setSuccessMessage("Player updated successfully.")
      setSuccess(true)
      fetchData()
      setLoader(false)
      setEditFormExpanded(false)

    } catch (ex: any) {
      setLoader(false)
      if (ex && ex.errors && Array.isArray(ex.errors)) {
        const errorMessages = ex.errors.map((error: any) => error.description).join(', ');
        setErrorAlert(true)
        console.log(errorMessages)
        setError(errorMessages);
      }
    }
  }

  const handleClickOpen = (id: number) => {
    setDeleteId(id)
    setOpenDelete(true);
  };
  const handleClose = () => {
    setOpenDelete(false);
  };

  const handleDelete = async () => {
    try {
      setLoader(true)
      await DeletePlayer(deleteId)
      setOpenDelete(false)
      fetchData()
      setSuccessMessage("Player deleted successfully!")
      setSuccess(true)
      setLoader(false)
    } catch (ex: any) {
      if (ex && ex.errors && Array.isArray(ex.errors)) {
        const errorMessages = ex.errors.map((error: any) => error.description).join(', ');
        setErrorAlert(true)
        console.log(errorMessages)
        setError(errorMessages);
      }
    }
  };

  const paginatedData = filteredPlayers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  return (
    <Box sx={{ padding: 3, display: 'flex', flexDirection: 'row', width: '100%' }}>
      {/* Table Section */}
      <Box sx={{ flexGrow: 1, padding: 3 }}>
        <Dialog
          open={openDelete}
          TransitionComponent={Transition}
          keepMounted
          onClose={handleClose}
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle>{"Delete Category"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              Are you sure you want to delete this player?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDelete}>Delete</Button>
            <Button onClick={handleClose}>Close</Button>
          </DialogActions>
        </Dialog>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
          <TextField
            variant="outlined"
            placeholder="Filter by name"
            value={filter}
            size="small"
            onChange={(e) => setFilter(e.target.value)}
            sx={{ width: '200px', backgroundColor: 'white' }}
          />
          <Button onClick={toggleForm} variant="outlined">
            {formExpanded ? 'Close' : 'New Player'}
          </Button>
        </Box>
        {loader ? (
          <CircularProgress />
        ) : (
          <>
            {success &&
              <Alert severity="success" onClose={() => setSuccess(false)}>{successMessage}</Alert>
            }
            {errorAlert &&
              <Alert severity="error" onClose={() => setErrorAlert(false)}>{error}</Alert>
            }
            {filteredPlayers.length > 0 && (
              <TableContainer sx={{ flexGrow: 1, borderRadius: 2, overflow: 'hidden', boxShadow: 1, fontSize: "15px" }}>
                <Table sx={{ backgroundColor: 'white' }}>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ backgroundColor: 'rgba(91, 139, 197)', color: 'white', fontSize: "17px" }}>ID</TableCell>
                      <TableCell sx={{ backgroundColor: 'rgba(91, 139, 197)', color: 'white', fontSize: "17px" }}>FIRSTNAME</TableCell>
                      <TableCell sx={{ backgroundColor: 'rgba(91, 139, 197)', color: 'white', fontSize: "17px" }}>LASTNAME</TableCell>
                      <TableCell sx={{ backgroundColor: 'rgba(91, 139, 197)', color: 'white', fontSize: "17px" }}>EMAIL</TableCell>
                      <TableCell sx={{ backgroundColor: 'rgba(91, 139, 197)', color: 'white', fontSize: "17px" }}>PHONE NUMBER</TableCell>
                      <TableCell sx={{ backgroundColor: 'rgba(91, 139, 197)', color: 'white', fontSize: "17px" }}>CATEGORY</TableCell>
                      <TableCell sx={{ backgroundColor: 'rgba(91, 139, 197)', color: 'white', fontSize: "17px" }}>ACTIONS</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedData.map((player) => (
                      <TableRow key={player.id}>
                        <TableCell>{player.id}</TableCell>
                        <TableCell>{player.firstName}</TableCell>
                        <TableCell>{player.lastName}</TableCell>
                        <TableCell>{player.email}</TableCell>
                        <TableCell>{player.phoneNumber}</TableCell>
                        <TableCell>{player.category.name}</TableCell>
                        <TableCell>
                          <IconButton onClick={() => { toggleEditForm(player) }}>
                            <Edit />
                          </IconButton>
                          <IconButton onClick={() => handleClickOpen(player.id)}>
                            <Delete />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <TablePagination
                component="div"
                count={filteredPlayers.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 25]} />
            </TableContainer>
            )}
          </>
        )}
      </Box>

      {formExpanded && (
        <>
          <Divider orientation="vertical" flexItem sx={{ margin: 2 }} />
          <Box
            sx={{
              padding: 5,
              display: 'flex',
              flexDirection: 'column',
              transition: 'width 0.5s ease',
              width: formExpanded ? '300px' : '0px',
              overflow: 'hidden',
              backgroundColor: 'rgba(91, 139, 197, 0.1)',
              borderRadius: "15px",
              marginRight: "40px",
              alignItems: "center",
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: 6, alignItems: "center" }}>
              <Typography sx={{ color: 'rgba(91, 139, 197)', fontSize: "15px" }}>ADD NEW PLAYER</Typography>
              <TextField
                variant="outlined"
                placeholder="First Name"
                size="small"
                value={addInput.firstName}
                onChange={(ev) => {
                  setAddInput({
                    ...addInput,
                    firstName: ev.target.value
                  })
                }}
                sx={{ width: '250px', backgroundColor: 'white' }} />
              <TextField
                variant="outlined"
                placeholder="Last Name"
                size="small"
                value={addInput.lastName}
                onChange={(ev) => {
                  setAddInput({
                    ...addInput,
                    lastName: ev.target.value
                  })
                }}
                sx={{ width: '250px', backgroundColor: 'white' }} />
              <TextField
                variant="outlined"
                placeholder="Email"
                size="small"
                value={addInput.email}
                onChange={(ev) => {
                  setAddInput({
                    ...addInput,
                    email: ev.target.value
                  })
                }}
                sx={{ width: '250px', backgroundColor: 'white' }} />
              <TextField
                variant="outlined"
                placeholder="Phone Number"
                size="small"
                value={addInput.phoneNumber}
                onChange={(ev) => {
                  setAddInput({
                    ...addInput,
                    phoneNumber: ev.target.value
                  })
                }}
                sx={{ width: '250px', backgroundColor: 'white' }} />
              <Autocomplete
                disablePortal
                value={category}
                onChange={(event, newValue) => {
                  setAddInput({
                    ...addInput,
                    categoryId: newValue?.id as number
                  })
                  setCategory(newValue as unknown as Category)
                }}
                options={Object.values(categories)}
                getOptionLabel={(option) => option.name}
                renderInput={(params) => <TextField {...params} variant='outlined'
                  placeholder="Category" size="small" sx={{ width: '250px', backgroundColor: 'white' }} />}
              />
              <Button variant="contained"
                color="primary"
                onClick={hanldeAddPlayer}
                sx={{ color: 'white', width: '150px' }}>
                Add
              </Button>
            </Box>
          </Box>
        </>
      )}

      {editFormExpanded && (
        <>
          <Divider orientation="vertical" flexItem sx={{ margin: 2 }} />
          <Box
            sx={{
              padding: 5,
              display: 'flex',
              flexDirection: 'column',
              transition: 'width 0.5s ease',
              width: editFormExpanded ? '300px' : '0px',
              overflow: 'hidden',
              backgroundColor: 'rgba(91, 139, 197, 0.1)',
              borderRadius: "15px",
              marginRight: "40px",
              alignItems: "center",
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: 6, alignItems: "center" }}>
              <Typography sx={{ color: 'rgba(91, 139, 197)', fontSize: "15px" }}>EDIT PLAYER</Typography>
              <TextField
                variant="outlined"
                placeholder="First Name"
                size="small"
                value={editInput.firstName}
                onChange={(ev) => {
                  setEditInput({
                    ...editInput,
                    firstName: ev.target.value
                  })
                }}
                sx={{ width: '250px', backgroundColor: 'white' }} />
              <TextField
                variant="outlined"
                placeholder="Last Name"
                size="small"
                value={editInput.lastName}
                onChange={(ev) => {
                  setEditInput({
                    ...editInput,
                    lastName: ev.target.value
                  })
                }}
                sx={{ width: '250px', backgroundColor: 'white' }} />
              <TextField
                variant="outlined"
                placeholder="Email"
                size="small"
                value={editInput.email}
                onChange={(ev) => {
                  setEditInput({
                    ...editInput,
                    email: ev.target.value
                  })
                }}
                sx={{ width: '250px', backgroundColor: 'white' }} />
              <TextField
                variant="outlined"
                placeholder="Phone Number"
                size="small"
                value={editInput.phoneNumber}
                onChange={(ev) => {
                  setEditInput({
                    ...editInput,
                    phoneNumber: ev.target.value
                  })
                }}
                sx={{ width: '250px', backgroundColor: 'white' }} />
              <Autocomplete
                disablePortal
                value={editInput.category}
                onChange={(event, newValue) => {
                  setEditInput({
                    ...editInput,
                    categoryId: newValue?.id as number,
                    category: newValue as unknown as Category
                  })
                }}
                options={Object.values(categories)}
                getOptionLabel={(option) => option.name}
                renderInput={(params) => <TextField {...params} variant='outlined'
                  placeholder="Category" size="small" sx={{ width: '250px', backgroundColor: 'white' }} />}
              />
              <Button variant="contained"
                color="primary"
                onClick={hanldeEditPlayer}
                sx={{ color: 'white', width: '150px' }}>
                SAVE
              </Button>
            </Box>
          </Box>
        </>
      )}
    </Box>
  );

};

export default Players;
