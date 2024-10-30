import * as React from 'react';
import { Alert, Box, Button, Divider, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Typography } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import CircularProgress from '@mui/material/CircularProgress';
import { useEffect, useState } from 'react';
import { AdditionalInformation, Category, DocumentType } from '../../models/model';
import { addCategory, deleteCategory, editCategory, getCategories } from '../../api/category';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import { addDocumentType, deleteDocumentType, getDocs, updateDocumentType } from '../../api/document';
import { addInformation, deleteAdditionalInformation, getInformation, updateAdditionalInformation } from '../../api/information';

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const Information = () => {

    const [information, setInformation] = useState<AdditionalInformation[]>([])
    const [newInfoType, setNewInfoType] = useState('')
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

    const handleClickOpen = (id: number) => {
        setDeleteId(id)
        setOpenDelete(true);
    };
    const handleEditOpen = (id: number, name: string) => {
        setEditId(id)
        setEditName(name)
        setOpenEdit(true)
    };
    const toggleForm = () => {
        setFormExpanded(!formExpanded);
    };
    const toggleEditForm = (input: AdditionalInformation) => {
        setEditId(input.id)
        setEditName(input.name)
        setEditFormExpanded(!editFormExpanded);
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
            var infos = await getInformation();
            setInformation(infos.payload)
            setNewInfoType("")

            setLoader(false)
        } catch (ex) {
            console.log(ex)
            setLoader(false)
        }
    }
    const filterInfo = information.filter(doc =>
        doc.name.toLowerCase().includes(filter.toLowerCase())
    );

    const handleAddInformation = async () => {
        try {
            setLoader(true)
            var info: AdditionalInformation = {
                id: 0,
                name: newInfoType,
                isArchived: false
            }
            await addInformation(info)
            await fetchData()
            setLoader(false)
            setSuccessMessage("Information type addedd successfully!")
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

    const handleEdit = async () => {
        try {
            setLoader(true)
            var info: AdditionalInformation = {
                id: editId,
                name: editName,
                isArchived: false,
            }
            await updateAdditionalInformation(info)
            fetchData()
            setOpenEdit(false)
            setEditFormExpanded(false)
            setLoader(false)
            setSuccessMessage("Information type edited successfully!")
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
            await deleteAdditionalInformation(deleteId)
            setOpenDelete(false)
            fetchData()
            setSuccessMessage("Information type deleted successfully!")
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

    const paginatedData = filterInfo.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    return (
        <Box sx={{ padding: 3, display: 'flex', flexDirection: 'row', width: '100%' }}>
            <Box sx={{ padding: 3, display: 'flex', flexDirection: 'column', flexGrow: 3 }}>
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
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                    <TextField
                        variant="outlined"
                        placeholder="Filter by name"
                        value={filter}
                        size='small'
                        onChange={(e) => setFilter(e.target.value)}
                        sx={{ width: '200px', backgroundColor: 'white' }} // White background for the input
                    />
                    <Button onClick={toggleForm} variant="outlined">
                        {formExpanded ? 'Close' : 'New Type'}
                    </Button>
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
                                        <TableCell sx={{ backgroundColor: 'rgba(91, 139, 197)', color: 'white', fontSize: "17px" }}>INFORMATION TYPE</TableCell>
                                        <TableCell sx={{ backgroundColor: 'rgba(91, 139, 197)', color: 'white', fontSize: "17px" }}>ACTIONS</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {paginatedData.map((doc) => (
                                        <TableRow key={doc.id}>
                                            <TableCell>{doc.id}</TableCell>
                                            <TableCell>{doc.name}</TableCell>
                                            <TableCell>
                                                <IconButton onClick={() => { toggleEditForm(doc) }}>
                                                    <Edit />
                                                </IconButton>
                                                <IconButton onClick={() => handleClickOpen(doc.id)}>
                                                    <Delete />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            <TablePagination
                                component="div"
                                count={filterInfo.length}
                                page={page}
                                onPageChange={handleChangePage}
                                rowsPerPage={rowsPerPage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                                rowsPerPageOptions={[5, 10, 25]} />
                        </TableContainer></>
                }
            </Box>
            {formExpanded && (
                <>
                    <Divider orientation="vertical" flexItem sx={{ margin: 2 }} />
                    <Box sx={{
                        padding: 5, display: 'flex',
                        flexDirection: 'column',
                        transition: 'width 0.5s ease',
                        width: formExpanded ? '300px' : '0px',
                        overflow: 'hidden',
                        backgroundColor: 'rgba(91, 139, 197, 0.1)',
                        borderRadius: "15px",
                        marginRight: "40px",
                        alignItems: "center",
                    }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '18px', marginTop: 6, alignItems: "center" }}>
                            <Typography sx={{ color: 'rgba(91, 139, 197)', fontSize: "15px" }}>ADD NEW TYPE</Typography>

                            <TextField
                                variant="outlined"
                                placeholder="Information Type"
                                value={newInfoType}
                                size='small'
                                onChange={(e) => setNewInfoType(e.target.value)}
                                sx={{ width: '250px', backgroundColor: 'white' }} // White background for the input
                            />
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleAddInformation}
                                sx={{ color: "white", width: "150px" }}
                            >
                                Add
                            </Button>
                        </Box>
                    </Box>
                </>
            )}
            {editFormExpanded && (
                <>
                    <Divider orientation="vertical" flexItem sx={{ margin: 2 }} /> {/* Vertical Divider */}
                    <Box sx={{
                        padding: 5, display: 'flex',
                        flexDirection: 'column',
                        transition: 'width 0.5s ease',
                        width: editFormExpanded ? '300px' : '0px',
                        overflow: 'hidden',
                        backgroundColor: 'rgba(91, 139, 197, 0.1)',
                        borderRadius: "15px",
                        marginRight: "40px",
                        alignItems: "center",
                    }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '18px', marginTop: 6, alignItems: "center" }}>
                            <Typography sx={{ color: 'rgba(91, 139, 197)', fontSize: "15px" }}>ADD NEW CATEGORY</Typography>

                            <TextField
                                variant="outlined"
                                placeholder="Category Name"
                                value={editName}
                                size='small'
                                onChange={(e) => setEditName(e.target.value)}
                                sx={{ width: '250px', backgroundColor: 'white' }} // White background for the input
                            />
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleEdit}
                                sx={{ color: "white", width: "150px" }}
                            >
                                SAVE
                            </Button>
                        </Box>
                    </Box>
                </>
            )}
        </Box>
    );
};

export default Information;
