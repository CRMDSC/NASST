import * as React from 'react';
import { Alert, Box, Button, Divider, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import { Add, Edit, Delete, Visibility, CategorySharp } from '@mui/icons-material';
import CircularProgress from '@mui/material/CircularProgress';
import { useEffect, useState } from 'react';
import { Category, Player } from '../../models/model';
import { addCategory, deleteCategory, editCategory, getCategories } from '../../api/category';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import { getPlayers } from '../../api/player';

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const Players = () => {

    const [players, setPlayers] = useState<Player[]>([])
    const [newCategoryName, setNewCategoryName] = useState('')
    const [filter, setFilter] = useState('');
    const [loader, setLoader] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState(false)
    const [errorAlert, setErrorAlert] = useState(false)
    const [openDelete, setOpenDelete] = useState(false)
    const [deleteId, setDeleteId] = useState(0)
    const [successMessage, setSuccessMessage] = useState("")
    const [editId, setEditId] = useState(0)
    const [editName, setEditName] = useState("")
    const [openEdit, setOpenEdit] = useState(false)

    const handleClickOpen = (id: number) => {
        setDeleteId(id)
        setOpenDelete(true);
    };
    const handleEditOpen = (id: number, name: string) => {
        setEditId(id)
        setEditName(name)
        setOpenEdit(true)
    };
    const handleClose = () => {
        setOpenDelete(false);
    };
    const handleEditClose = () => {
        setOpenEdit(false);
    };
    useEffect(() => {
        fetchData();
    }, []);


    const fetchData = async () => {
        try {
            setLoader(true)
            var players = await getPlayers();
            console.log(players)
            setPlayers(players.payload)
            setNewCategoryName("")

            setLoader(false)
        } catch (ex) {
            console.log(ex)
            setLoader(false)
        }
    }
    const filteredPlayers = players.filter(player =>
        player?.firstName?.toLowerCase().includes(filter.toLowerCase())
    );

    const handleAddCategory = async () => {
        try {
            setLoader(true)
            var category: Category = {
                id: 0,
                name: newCategoryName,
                isArchived: false
            }
            await addCategory(category)
            await fetchData()
            setLoader(false)
            setSuccessMessage("Category addedd successfully!")
            setSuccess(true)
        } catch (ex: any) {
            setLoader(false)
            if (ex && ex.errors && Array.isArray(ex.errors)) {
                const errorMessages = ex.errors.map((error: any) => error.description).join(', ');
                setErrorAlert(true)
                console.log(errorMessages)
                setError(errorMessages);
            }
        }
    };

    const handleEdit = async (id: any) => {
        try {
            setLoader(true)
            var category: Category = {
                id: editId,
                name: editName,
                isArchived: false,
            }
            await editCategory(category)
            fetchData()
            setOpenEdit(false)
            setLoader(false)
            setSuccessMessage("Category edited successfully!")
            setSuccess(true)
        } catch (ex: any) {
            setLoader(false)
            if (ex && ex.errors && Array.isArray(ex.errors)) {
                const errorMessages = ex.errors.map((error: any) => error.description).join(', ');
                setErrorAlert(true)
                console.log(errorMessages)
                setError(errorMessages);
            }
        }
    };

    const handleDelete = async () => {
        try {
            setLoader(true)
            await deleteCategory(deleteId)
            setOpenDelete(false)
            fetchData()
            setSuccessMessage("Category deleted successfully!")
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

    return (
        <Box sx={{ padding: 3, display: 'flex', flexDirection: 'row', width: '100%' }}>
            <Box sx={{ padding: 3, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
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
                            Are you sure ypu want to delete this category?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleDelete}>Delete</Button>
                        <Button onClick={handleClose}>Close</Button>
                    </DialogActions>
                </Dialog>
                <Dialog
                    open={openEdit}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={handleEditClose}
                    aria-describedby="alert-dialog-slide-description"

                >
                    <DialogTitle>{"Edit Category"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-slide-description">
                            Change the category name
                        </DialogContentText>
                        <br />
                        <TextField
                            variant="outlined"
                            placeholder="Filter by name"
                            value={editName}
                            size='small'
                            onChange={(e) => setEditName(e.target.value)}
                            sx={{ width: '300px', backgroundColor: 'white' }}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleEdit}>Edit</Button>
                        <Button onClick={handleEditClose}>Close</Button>
                    </DialogActions>
                </Dialog>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                    <TextField
                        variant="outlined"
                        placeholder="Filter by name"
                        value={filter}
                        size='small'
                        onChange={(e) => setFilter(e.target.value)}
                        sx={{ width: '200px', backgroundColor: 'white' }} // White background for the input
                    />
                </Box>
                {loader == true ?
                    <CircularProgress />
                    :
                    <>
                        {success &&
                            <Alert severity="success" onClose={() => setSuccess(false)}>{successMessage}</Alert>
                        }
                        {errorAlert &&
                            <Alert severity="error" onClose={() => setErrorAlert(false)}>{error}</Alert>
                        }

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
                                    {filteredPlayers.map((player) => (
                                        <TableRow key={player.id}>
                                            <TableCell>{player.id}</TableCell>
                                            <TableCell>{player.firstName}</TableCell>
                                            <TableCell>{player.lastName}</TableCell>
                                            <TableCell>{player.email}</TableCell>
                                            <TableCell>{player.phoneNumber}</TableCell>
                                            <TableCell>{player.category.name}</TableCell>
                                            <TableCell>
                                                <IconButton onClick={() => handleEditOpen(player.id, player.firstName ?? "")}>
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
                        </TableContainer></>
                }
            </Box>
            <Divider orientation="vertical" flexItem sx={{ margin: 2 }} /> {/* Vertical Divider */}
            <Box sx={{ padding: 5, display: 'flex', flexDirection: 'column', flexGrow: 1}}>
                <Box sx={{ display: 'flex', flexDirection: 'column', marginBottom: 2, gap: "16px" }}>
                    <Typography sx={{ color: 'rgba(91, 139, 197)', fontSize: "15px" }}>ADD NEW PLAYER</Typography>
                    <Box sx={{ display: "flex", gap: "12px", flexDirection:"column" }}>
                        <TextField
                            variant="outlined"
                            placeholder="First Name"
                            value={newCategoryName}
                            size='small'
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            sx={{ width: '250px', backgroundColor: 'white' }} // White background for the input
                        />
                           <TextField
                            variant="outlined"
                            placeholder="Last Name"
                            value={newCategoryName}
                            size='small'
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            sx={{ width: '250px', backgroundColor: 'white' }} // White background for the input
                        />
                         <TextField
                            variant="outlined"
                            placeholder="Email"
                            value={newCategoryName}
                            size='small'
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            sx={{ width: '250px', backgroundColor: 'white' }} // White background for the input
                        />
                        <TextField
                            variant="outlined"
                            placeholder="Phone Number"
                            value={newCategoryName}
                            size='small'
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            sx={{ width: '250px', backgroundColor: 'white' }} // White background for the input
                        />
                        <TextField
                            variant="outlined"
                            placeholder="Category"
                            value={newCategoryName}
                            size='small'
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            sx={{ width: '250px', backgroundColor: 'white' }} // White background for the input
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleAddCategory}
                            sx={{ color: "white", width: "150px" }}
                        >
                            Add Player
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default Players;
