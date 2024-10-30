import * as React from 'react';
import { Alert, Autocomplete, Box, Button, Divider, IconButton, List, ListItem, Table, TableBody, TableCell, TablePagination, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import { Add, Edit, Delete, Visibility, Height, Rowing, FlashOnRounded } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { AdditionalInformation, Category, DocumentType, SportAdditionalInfo, SportPlayersCategory, SportType, SportTypeInput, SportTypeView, UpdateSportTypeInput, UserView } from '../../models/model';
import { addSportType, deleteSportType, editSportType, getAllSportsTypes, getAllUsers, getSportType } from '../../api/sportType';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { getCategories } from '../../api/category';
import { getInformation } from '../../api/information';
import { getDocs } from '../../api/document';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';


const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<unknown>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});


const SportsType = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [filter, setFilter] = useState('');
  const [loader, setLoader] = useState(false);
  const [sportsData, setSportsData] = useState<SportTypeView[]>([])
  const [sportType, setSportType] = useState<SportTypeView>()
  const [formExpanded, setFormExpanded] = useState(false);
  const [editFormExpanded, setEditFormExpanded] = useState(false);
  const [users, setUsers] = useState<UserView[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [information, setInformation] = useState<AdditionalInformation[]>([]);
  const [documentType, setDocumentType] = useState<DocumentType[]>([]);
  const [openDelete, setOpenDelete] = useState(false)
  const [rowsCategories, setRowsCategories] = useState<SportPlayersCategory[]>([]);
  const [viewFormExpanded, setViewFormExpanded] = useState(false);
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [errorAlert, setErrorAlert] = useState(false)
  const [successMessage, setSuccessMessage] = useState('');
  const [deleteId, setDeleteId] = useState(0)
  const [sportTypeInputEdit, setSportTypeInputEdit] = useState<UpdateSportTypeInput>({
    id: 0,
    name: "",
    registrationTime: new Date(),
    replacementTime: new Date(),
    sportAdditionalInfo: [],
    sportDocumentType: [],
    sportPlayersCategories: [],
    teamsCount: 0,
    teamAdminId: "",
    teamAdmin: undefined
  })
  const [sportTypeInput, setSportTypeInput] = useState<SportTypeInput>({
    name: "",
    registrationTime: new Date(),
    replacementTime: new Date(),
    sportAdditionalInfo: [],
    sportDocumentType: [],
    sportPlayersCategories: [],
    teamsCount: 0,
    teamAdminId: "",
  })

  const handleChangePage = (event: any, newPage: any) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleAddRowCategories = () => {
    setRowsCategories([...rowsCategories, { id: 0, categoryId: 0, playersCount: 0, category: {} as Category, isArchived: false }]);
  };

  const handleChangeCategories = (index: number, event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const updatedRows = [...rowsCategories];
    const { name, value } = event.target;
    console.log(name, value)
    if (name === "playersCount") {
      if (updatedRows[index].playersCount != undefined) {
        updatedRows[index].playersCount = Number(value);
      }
    } else if (name === "categoryId") {
      updatedRows[index].categoryId = Number(value);
    }
    console.log(updatedRows)
    setRowsCategories(updatedRows);
    setSportTypeInput({ ...sportTypeInput, sportPlayersCategories: updatedRows })
  };

  const handleClickOpen = () => {
    setFormExpanded(true);
  };

  const fetchData = async () => {
    setLoader(true)
    try {
      var sportsTypes = (await getAllSportsTypes()).payload
      setSportsData(sportsTypes);

      const users = (await getAllUsers()).payload
      setUsers(users)

      const categories = (await getCategories()).payload
      setCategories(categories)

      const information = (await getInformation()).payload
      setInformation(information)

      const documentType = (await getDocs()).payload
      setDocumentType(documentType)
      setLoader(false)

    } catch (ex: any) {
      setError("Something went wrong please contact your adminstrator")
      setErrorAlert(true)
      setLoader(false)
    }
  }
  const getSportById = async (id: number, view: string) => {
    if (view == "view") {
      try {
        setLoader(true)
        var sportType = (await getSportType(id)).payload
        setSportType(sportType)
        setViewFormExpanded(true)
        setLoader(false)
      } catch (ex: any) {
        setError("Something went wrong, please contact the administrator.")
        setErrorAlert(true)
        setLoader(false)
      }
    }
    else if (view = "edit") {
      try {
        setLoader(true)
        var sportType = (await getSportType(id)).payload
        var sportTypeInput: UpdateSportTypeInput = {
          name: sportType.name,
          registrationTime: sportType.registrationTime,
          replacementTime: sportType.replacementTime,
          sportAdditionalInfo: sportType.sportAdditionalInfo.map((info) => info.additionalInformation),
          sportDocumentType: sportType.sportDocumentType.map((doc) => doc.documentType),
          sportPlayersCategories: sportType.sportPlayersCategories,
          teamsCount: sportType.teamsCount,
          teamAdminId: sportType.teamAdminId,
          teamAdmin: sportType.teamAdmin,
          id: sportType.id
        }
        setRowsCategories(sportType.sportPlayersCategories)
        setSportTypeInputEdit(sportTypeInput)
        setEditFormExpanded(true)
        setLoader(false)
      } catch (ex) {
        setError("Something went wrong, please contact the administrator.")
        setErrorAlert(true)
        setLoader(false)
      }
    }
  }

  const filteredSportsData = sportsData.filter(sport =>
    sport.name.toLowerCase().includes(filter.toLowerCase())
  );

  const handleAddSportsType = async () => {
    try {
      setLoader(true)
      await addSportType(sportTypeInput)
      setFormExpanded(false)
      await fetchData()
      setSuccessMessage("Sport Type added succesfully!")
      setSuccess(true)
      setLoader(false)
    } catch (ex: any) {
      if (ex && ex.errors && Array.isArray(ex.errors)) {
        const errorMessages = ex.errors.map((error: any) => error.description).join(', ');
        setErrorAlert(true)
        console.log(errorMessages)
        setError(errorMessages);
        setLoader(false)
      }
      setFormExpanded(false)
    }
  };

  const handleEdit = async () => {
    try {
      setLoader(true)
      await editSportType(sportTypeInputEdit)
      await fetchData()
      setEditFormExpanded(false)
      setSuccessMessage("Sport type updated successfully!")
      setSuccess(true)
      setLoader(false)
    } catch (ex: any) {
      if (ex && ex.errors && Array.isArray(ex.errors)) {
        const errorMessages = ex.errors.map((error: any) => error.description).join(', ');
        setErrorAlert(true)
        console.log(errorMessages)
        setError(errorMessages);
        setLoader(false)
      }
      setEditFormExpanded(false)
    }
  };

  const handleDelete = async () => {
    try {
      setLoader(true)
      await deleteSportType(deleteId)
      await fetchData()
      setSuccessMessage("Sport Type deleted successfully!")
      setSuccess(true)
      setOpenDelete(false)
      setLoader(false)
    } catch (ex: any) {
      if (ex && ex.errors && Array.isArray(ex.errors)) {
        const errorMessages = ex.errors.map((error: any) => error.description).join(', ');
        setErrorAlert(true)
        console.log(errorMessages)
        setError(errorMessages);
        setOpenDelete(false)
        setLoader(false)
      }
      setOpenDelete(false)
    }
  };
  const handleOpenDelete = (id: number) => {
    setDeleteId(id)
    setOpenDelete(true)
  }

  useEffect(() => {
    fetchData();
  }, []);


  const paginatedData = filteredSportsData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  return (
    <Box sx={{ padding: 3, display: 'flex', flexDirection: 'row', width: '100%', position: 'relative' }}>
      <Dialog
        open={openDelete}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => { setOpenDelete(false) }}
        aria-describedby="alert-dialog-slide-description">
        <DialogTitle>{"Delete Category"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Are you sure you want to delete this sport type?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDelete}>Delete</Button>
          <Button onClick={() => { setOpenDelete(false) }}>Close</Button>
        </DialogActions>
      </Dialog>
      <Box sx={{ padding: 3, display: 'flex', flexDirection: 'column', flexGrow: 1, transition: 'opacity 0.5s ease', opacity: viewFormExpanded ? 0 : formExpanded ? 0 : editFormExpanded ? 0 : 1 }}>
        {success &&
          <Alert severity="success" onClose={() => setSuccess(false)}>{successMessage}</Alert>
        }
        {errorAlert &&
          <Alert severity="error" onClose={() => setErrorAlert(false)}>{error}</Alert>
        }
        {loader == true ? <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}><CircularProgress /> </Box> :
          <><Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
            <TextField variant="outlined" placeholder="Filter by name" value={filter} size='small' onChange={(e) => setFilter(e.target.value)} sx={{ width: '200px', backgroundColor: 'white' }} />
            <Button variant="outlined" color="primary" startIcon={<Add />} onClick={handleClickOpen} sx={{ color: "rgb(91, 139, 197)" }}>
              Add Sport Type
            </Button>
          </Box><TableContainer sx={{ flexGrow: 1, borderRadius: 2, overflow: 'hidden', boxShadow: 1 }}>
              <Table sx={{ backgroundColor: 'white' }}>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ backgroundColor: 'rgba(91, 139, 197)', color: 'white', fontSize: "17px" }}>ID</TableCell>
                    <TableCell sx={{ backgroundColor: 'rgba(91, 139, 197)', color: 'white', fontSize: "17px" }}>NAME</TableCell>
                    <TableCell sx={{ backgroundColor: 'rgba(91, 139, 197)', color: 'white', fontSize: "17px" }}>TEAMS COUNT</TableCell>
                    <TableCell sx={{ backgroundColor: 'rgba(91, 139, 197)', color: 'white', fontSize: "17px" }}>ACTIONS</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedData.map((sport) => (
                    <TableRow key={sport.id}>
                      <TableCell>{sport.id}</TableCell>
                      <TableCell>{sport.name}</TableCell>
                      <TableCell>{sport.teamsCount}</TableCell>
                      <TableCell>
                        <IconButton onClick={() => getSportById(sport.id, "view")}>
                          <Visibility />
                        </IconButton>
                        <IconButton onClick={() => getSportById(sport.id, "edit")}>
                          <Edit />
                        </IconButton>
                        <IconButton onClick={() => handleOpenDelete(sport.id)}>
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <TablePagination
                component="div"
                count={filteredSportsData.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 25]} />
            </TableContainer></>
        }
      </Box>

      {viewFormExpanded && (

        <Box
          sx={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '95%', sm: '85%', md: '75%' },
            height: "auto",
            maxHeight: '80vh',
            padding: { xs: 2, sm: 4 },
            backgroundColor: '#f9fafc',
            borderRadius: '12px',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0px 10px 25px rgba(0, 0, 0, 0.1)',
            overflowY: 'auto',
            zIndex: 10,
          }}>
          {loader ? <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}><CircularProgress /> </Box>  :
            <><Box sx={{ display: 'flex', justifyContent: "flex-end" }}>
              <Button variant="outlined" color="primary" onClick={() => setViewFormExpanded(false)}>
                Back
              </Button>
            </Box>
              <Typography sx={{ color: '#3b6fa0', fontSize: { xs: '18px', sm: '20px' }, fontWeight: '500', mb: 2 }}>
                General Information
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 2, mb: 3 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', width: { xs: '100%', sm: '48%', md: '220px' } }}>
                  <Typography sx={{ color: '#3b6fa0', fontSize: '15px', fontWeight: '500' }}>Title</Typography>
                  <TextField
                    disabled
                    variant="outlined"
                    placeholder="Title"
                    value={sportType?.name}
                    size="small"
                    sx={{ width: '100%', backgroundColor: 'white' }}
                  />
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', width: { xs: '100%', sm: '48%', md: '220px' } }}>
                  <Typography sx={{ color: '#3b6fa0', fontSize: '15px', fontWeight: '500' }}>Teams Count</Typography>
                  <TextField
                    disabled
                    variant="outlined"
                    placeholder="Teams Count"
                    value={sportType?.teamsCount}
                    size="small"
                    type="number"
                    sx={{ width: '100%', backgroundColor: 'white' }}
                  />
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', width: { xs: '100%', sm: '48%', md: '220px' } }}>
                  <Typography sx={{ color: '#3b6fa0', fontSize: '15px', fontWeight: '500' }}>Sport Type Admin</Typography>
                  <TextField
                    disabled
                    variant="outlined"
                    value={sportType?.teamAdmin?.fullName}
                    size="small"
                    type="text"
                    sx={{ width: '100%', backgroundColor: 'white' }}
                  />
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', width: { xs: '100%', sm: '48%', md: '220px' } }}>
                  <Typography sx={{ color: '#3b6fa0', fontSize: '15px', fontWeight: '500' }}>Registration Time</Typography>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker
                      disabled
                      sx={{ width: '100%', backgroundColor: 'white' }}
                      value={sportType?.registrationTime ? dayjs(sportType?.registrationTime) : null}
                      slotProps={{ textField: { size: 'small' } }}
                    />
                  </LocalizationProvider>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', width: { xs: '100%', sm: '48%', md: '220px' } }}>
                  <Typography sx={{ color: '#3b6fa0', fontSize: '15px', fontWeight: '500' }}>Replacement Time</Typography>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker
                      disabled
                      sx={{ width: '100%', backgroundColor: 'white' }}
                      value={sportType?.replacementTime ? dayjs(sportType?.replacementTime) : null}
                      slotProps={{ textField: { size: 'small' } }}
                    />
                  </LocalizationProvider>
                </Box>
              </Box>
              <Divider sx={{ my: 3 }} />
              <Typography sx={{ color: '#3b6fa0', fontSize: { xs: '18px', sm: '20px' }, fontWeight: '500', mb: 2 }}>
                Additional Information
              </Typography>
              <Typography sx={{ color: '#3b6fa0', fontSize: '14px', mb: 2 }}>
                Selected information to include when adding a new team.
              </Typography>
              <Autocomplete
                disabled
                value={sportType?.sportAdditionalInfo?.map((info) => info.additionalInformation)}
                multiple
                disablePortal
                options={information}
                getOptionLabel={(option) => option.name}
                onChange={(ev, props) => console.log("hiiii")}
                renderInput={(params) => <TextField {...params} size="small" sx={{ width: '100%', backgroundColor: 'white' }} />}
              />
              <Divider sx={{ my: 3 }} />
              <Typography sx={{ color: '#3b6fa0', fontSize: { xs: '18px', sm: '20px' }, fontWeight: '500', mb: 2 }}>
                Sports Documents
              </Typography>
              <Typography sx={{ color: '#3b6fa0', fontSize: '14px', mb: 2 }}>
                Select the documents to include when adding a new team.
              </Typography>
              <Autocomplete
                disabled
                value={sportType?.sportDocumentType?.map((info) => info.documentType)}
                multiple
                disablePortal
                options={documentType}
                getOptionLabel={(option) => option.type}
                renderInput={(params) => <TextField {...params} size="small" sx={{ width: '100%', backgroundColor: 'white' }} />}
              />
              <Divider sx={{ my: 3 }} />
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography sx={{ color: '#3b6fa0', fontSize: { xs: '18px', sm: '20px' }, fontWeight: '500' }}>
                  Sports Players Categories
                </Typography>
              </Box>
              {sportType?.sportPlayersCategories.map((row: any, index: any) => (
                <Box key={index} display="flex" gap={2} mb={1}>
                  <Autocomplete
                    disabled
                    value={row.category}
                    disablePortal
                    options={categories}
                    getOptionLabel={(option) => option.name}
                    renderInput={(params) => <TextField {...params} label="Category" size="small" sx={{ backgroundColor: 'white', width: "200px" }} />}
                  />
                  <TextField
                    disabled
                    size="small"
                    placeholder="Count"
                    type="number"
                    value={row.playersCount}
                    sx={{ width: '200px', backgroundColor: 'white' }}
                  />
                </Box>
              ))}</>
          }
        </Box>

      )}
      {formExpanded && (
        <Box
          sx={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '95%', sm: '85%', md: '75%' },
            height: "auto",
            maxHeight: '80vh',
            padding: { xs: 2, sm: 4 },
            backgroundColor: '#f9fafc',
            borderRadius: '12px',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0px 10px 25px rgba(0, 0, 0, 0.1)',
            overflowY: 'auto',
            zIndex: 10,
          }}>
          {loader ?  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}><CircularProgress /> </Box> :
            <><Box sx={{ display: 'flex', justifyContent: "flex-end" }}>
              <Button variant="outlined" color="primary" onClick={() => setFormExpanded(false)}>
                Back
              </Button>
            </Box>
              <Typography sx={{ color: '#3b6fa0', fontSize: { xs: '18px', sm: '20px' }, fontWeight: '500', mb: 2 }}>
                General Information
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 2, mb: 3 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', width: { xs: '100%', sm: '48%', md: '220px' } }}>
                  <Typography sx={{ color: '#3b6fa0', fontSize: '15px', fontWeight: '500' }}>Title</Typography>
                  <TextField
                    variant="outlined"
                    placeholder="Title"
                    value={sportTypeInput.name}
                    size="small"
                    onChange={(e) => setSportTypeInput({ ...sportTypeInput, name: e.target.value })}
                    sx={{ width: '100%', backgroundColor: 'white' }}
                  />
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', width: { xs: '100%', sm: '48%', md: '220px' } }}>
                  <Typography sx={{ color: '#3b6fa0', fontSize: '15px', fontWeight: '500' }}>Teams Count</Typography>
                  <TextField
                    variant="outlined"
                    placeholder="Teams Count"
                    value={sportTypeInput.teamsCount}
                    size="small"
                    type="number"
                    onChange={(e) => setSportTypeInput({ ...sportTypeInput, teamsCount: Number(e.target.value) })}
                    sx={{ width: '100%', backgroundColor: 'white' }}
                  />
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', width: { xs: '100%', sm: '48%', md: '220px' } }}>
                  <Typography sx={{ color: '#3b6fa0', fontSize: '15px', fontWeight: '500' }}>Sport Type Admin</Typography>
                  <Autocomplete
                    disablePortal
                    options={users}
                    getOptionLabel={(option) => option.fullName}
                    onChange={(e, props) => setSportTypeInput({ ...sportTypeInput, teamAdminId: props?.userId })}
                    renderInput={(params) => <TextField {...params} size="small" sx={{ width: '100%', backgroundColor: 'white' }} />}
                  />
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', width: { xs: '100%', sm: '48%', md: '220px' } }}>
                  <Typography sx={{ color: '#3b6fa0', fontSize: '15px', fontWeight: '500' }}>Registration Time</Typography>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker
                      sx={{ width: '100%', backgroundColor: 'white' }}
                      value={sportTypeInput.registrationTime ? dayjs(sportTypeInput.registrationTime) : null}
                      onChange={(newValue) => setSportTypeInput({ ...sportTypeInput, registrationTime: newValue?.toDate() || null as unknown as Date })}
                      slotProps={{ textField: { size: 'small' } }}
                    />
                  </LocalizationProvider>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', width: { xs: '100%', sm: '48%', md: '220px' } }}>
                  <Typography sx={{ color: '#3b6fa0', fontSize: '15px', fontWeight: '500' }}>Replacement Time</Typography>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker
                      sx={{ width: '100%', backgroundColor: 'white' }}
                      value={sportTypeInput.registrationTime ? dayjs(sportTypeInput.registrationTime) : null}
                      onChange={(newValue) => setSportTypeInput({ ...sportTypeInput, replacementTime: newValue?.toDate() || null as unknown as Date })}
                      slotProps={{ textField: { size: 'small' } }}
                    />
                  </LocalizationProvider>
                </Box>
              </Box>
              <Divider sx={{ my: 3 }} />
              <Typography sx={{ color: '#3b6fa0', fontSize: { xs: '18px', sm: '20px' }, fontWeight: '500', mb: 2 }}>
                Additional Information
              </Typography>
              <Typography sx={{ color: '#3b6fa0', fontSize: '14px', mb: 2 }}>
                Select the information to include when adding a new team.
              </Typography>
              <Autocomplete
                multiple
                disablePortal
                options={information}
                getOptionLabel={(option) => option.name}
                onChange={(ev, props) => { setSportTypeInput({ ...sportTypeInput, sportAdditionalInfo: props }) }}
                renderInput={(params) => <TextField {...params} size="small" sx={{ width: '100%', backgroundColor: 'white' }} />}
              />
              <Divider sx={{ my: 3 }} />
              <Typography sx={{ color: '#3b6fa0', fontSize: { xs: '18px', sm: '20px' }, fontWeight: '500', mb: 2 }}>
                Sports Documents
              </Typography>
              <Typography sx={{ color: '#3b6fa0', fontSize: '14px', mb: 2 }}>
                Select the documents to include when adding a new team.
              </Typography>
              <Autocomplete
                multiple
                disablePortal
                options={documentType}
                getOptionLabel={(option) => option.type}
                onChange={(ev, props) => { setSportTypeInput({ ...sportTypeInput, sportDocumentType: props }) }}
                renderInput={(params) => <TextField {...params} size="small" sx={{ width: '100%', backgroundColor: 'white' }} />}
              />
              <Divider sx={{ my: 3 }} />
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography sx={{ color: '#3b6fa0', fontSize: { xs: '18px', sm: '20px' }, fontWeight: '500' }}>
                  Sports Players Categories
                </Typography>
                <IconButton onClick={handleAddRowCategories} sx={{ color: '#3b6fa0', ml: 1 }}>
                  <AddCircleIcon />
                </IconButton>
              </Box>
              {rowsCategories.map((row: any, index: any) => (
                <Box key={index} display="flex" gap={2} mb={1}>
                  <Autocomplete
                    disablePortal
                    options={categories}
                    getOptionLabel={(option) => option.name}
                    onChange={(event, newValue) => {
                      const updatedRows = [...rowsCategories];
                      updatedRows[index].categoryId = newValue?.id as unknown as number;
                      updatedRows[index].category = newValue ?? null as unknown as Category;
                      setRowsCategories(updatedRows);
                    }}
                    renderInput={(params) => (
                      <TextField {...params} label="Category" size="small" sx={{ backgroundColor: 'white', width: "200px" }} />
                    )}
                  />
                  <TextField
                    name="playersCount"
                    size="small"
                    placeholder="Count"
                    type="number"
                    value={row.playersCount}
                    onChange={(e) => handleChangeCategories(index, e)}
                    sx={{ width: '200px', backgroundColor: 'white' }}
                  />
                </Box>
              ))}
              <Box sx={{ display: 'flex', justifyContent: "center", mt: 4 }}>
                <Button variant="contained" color="primary" onClick={handleAddSportsType} sx={{ fontWeight: '600', px: 4 }}>
                  Add Sport Type
                </Button>
              </Box></>
          }
        </Box>
      )}

      {editFormExpanded && (
        <Box
          sx={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '95%', sm: '85%', md: '75%' },
            height: "auto",
            maxHeight: '80vh',
            padding: { xs: 2, sm: 4 },
            backgroundColor: '#f9fafc',
            borderRadius: '12px',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0px 10px 25px rgba(0, 0, 0, 0.1)',
            overflowY: 'auto',
            zIndex: 10,
          }}
        >
          {loader ?  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}><CircularProgress /> </Box> :

            <><Box sx={{ display: 'flex', justifyContent: "flex-end" }}>
              <Button variant="outlined" color="primary" onClick={() => setEditFormExpanded(false)}>
                Back
              </Button>
            </Box>
              <Typography sx={{ color: '#3b6fa0', fontSize: { xs: '18px', sm: '20px' }, fontWeight: '500', mb: 2 }}>
                General Information
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 2, mb: 3 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', width: { xs: '100%', sm: '48%', md: '220px' } }}>
                  <Typography sx={{ color: '#3b6fa0', fontSize: '15px', fontWeight: '500' }}>Title</Typography>
                  <TextField
                    variant="outlined"
                    placeholder="Title"
                    value={sportTypeInputEdit?.name}
                    size="small"
                    onChange={(e) => setSportTypeInputEdit({ ...sportTypeInputEdit, name: e.target.value })}
                    sx={{ width: '100%', backgroundColor: 'white' }}
                  />
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', width: { xs: '100%', sm: '48%', md: '220px' } }}>
                  <Typography sx={{ color: '#3b6fa0', fontSize: '15px', fontWeight: '500' }}>Teams Count</Typography>
                  <TextField
                    variant="outlined"
                    placeholder="Teams Count"
                    value={sportTypeInputEdit.teamsCount}
                    size="small"
                    type="number"
                    onChange={(e) => setSportTypeInputEdit({ ...sportTypeInputEdit, teamsCount: Number(e.target.value) })}
                    sx={{ width: '100%', backgroundColor: 'white' }}
                  />
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', width: { xs: '100%', sm: '48%', md: '220px' } }}>
                  <Typography sx={{ color: '#3b6fa0', fontSize: '15px', fontWeight: '500' }}>Sport Type Admin</Typography>
                  <Autocomplete
                    disablePortal
                    value={sportTypeInputEdit.teamAdmin as unknown as UserView}
                    options={users}
                    getOptionLabel={(option) => option.fullName}
                    onChange={(e, props) => setSportTypeInputEdit({ ...sportTypeInputEdit, teamAdminId: props?.userId })}
                    renderInput={(params) => <TextField {...params} size="small" sx={{ width: '100%', backgroundColor: 'white' }} />}
                  />
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', width: { xs: '100%', sm: '48%', md: '220px' } }}>
                  <Typography sx={{ color: '#3b6fa0', fontSize: '15px', fontWeight: '500' }}>Registration Time</Typography>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker
                      sx={{ width: '100%', backgroundColor: 'white' }}
                      value={sportTypeInputEdit.registrationTime ? dayjs(sportTypeInputEdit.registrationTime) : null}
                      onChange={(newValue) => setSportTypeInputEdit({ ...sportTypeInputEdit, registrationTime: newValue?.toDate() || null as unknown as Date })}
                      slotProps={{ textField: { size: 'small' } }}
                    />
                  </LocalizationProvider>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', width: { xs: '100%', sm: '48%', md: '220px' } }}>
                  <Typography sx={{ color: '#3b6fa0', fontSize: '15px', fontWeight: '500' }}>Replacement Time</Typography>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker
                      sx={{ width: '100%', backgroundColor: 'white' }}
                      value={sportTypeInputEdit.replacementTime ? dayjs(sportTypeInputEdit.replacementTime) : null}
                      onChange={(newValue) => setSportTypeInputEdit({ ...sportTypeInputEdit, replacementTime: newValue?.toDate() || null as unknown as Date })}
                      slotProps={{ textField: { size: 'small' } }}
                    />
                  </LocalizationProvider>
                </Box>
              </Box>
              <Divider sx={{ my: 3 }} />
              <Typography sx={{ color: '#3b6fa0', fontSize: { xs: '18px', sm: '20px' }, fontWeight: '500', mb: 2 }}>
                Additional Information
              </Typography>
              <Typography sx={{ color: '#3b6fa0', fontSize: '14px', mb: 2 }}>
                Select the information to include when adding a new team.
              </Typography>
              <Autocomplete
                multiple
                disablePortal
                value={sportTypeInputEdit?.sportAdditionalInfo}
                options={information}
                getOptionLabel={(option) => option.name}
                onChange={(ev, props) => {
                  setSportTypeInputEdit({ ...sportTypeInputEdit, sportAdditionalInfo: props })
                }}
                renderInput={(params) => <TextField {...params} size="small" sx={{ width: '100%', backgroundColor: 'white' }} />}
              />
              <Divider sx={{ my: 3 }} />
              <Typography sx={{ color: '#3b6fa0', fontSize: { xs: '18px', sm: '20px' }, fontWeight: '500', mb: 2 }}>
                Sports Documents
              </Typography>
              <Typography sx={{ color: '#3b6fa0', fontSize: '14px', mb: 2 }}>
                Select the documents to include when adding a new team.
              </Typography>
              <Autocomplete
                multiple
                disablePortal
                value={sportTypeInputEdit?.sportDocumentType}
                options={documentType}
                getOptionLabel={(option) => option.type}
                onChange={(ev, props) => { setSportTypeInputEdit({ ...sportTypeInputEdit, sportDocumentType: props }) }}
                renderInput={(params) => <TextField {...params} size="small" sx={{ width: '100%', backgroundColor: 'white' }} />}
              />
              <Divider sx={{ my: 3 }} />
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography sx={{ color: '#3b6fa0', fontSize: { xs: '18px', sm: '20px' }, fontWeight: '500' }}>
                  Sports Players Categories
                </Typography>
                <IconButton onClick={handleAddRowCategories} sx={{ color: '#3b6fa0', ml: 1 }}>
                  <AddCircleIcon />
                </IconButton>
              </Box>
              {rowsCategories?.map((row: any, index: any) => (
                <Box key={index} display="flex" gap={2} mb={1}>
                  <Autocomplete
                    value={row.category}
                    disablePortal
                    options={categories}
                    getOptionLabel={(option) => option.name}
                    onChange={(event, newValue) => {
                      const updatedRows = [...rowsCategories];
                      updatedRows[index].categoryId = newValue?.id as unknown as number; // Assuming `id` exists in your category
                      updatedRows[index].category = newValue ?? null as unknown as Category;
                      setSportTypeInputEdit({ ...sportTypeInputEdit, sportPlayersCategories: updatedRows })   // Storing the full category object
                      setRowsCategories(updatedRows);
                    }}
                    renderInput={(params) => (
                      <TextField {...params} label="Category" size="small" sx={{ backgroundColor: 'white', width: "200px" }} />
                    )}
                  />
                  <TextField
                    name="playersCount"
                    size="small"
                    placeholder="Count"
                    type="number"
                    value={row?.playersCount ?? 0}
                    onChange={(e) => handleChangeCategories(index, e)}
                    sx={{ width: '200px', backgroundColor: 'white' }}
                  />
                </Box>
              ))}
              <Box sx={{ display: 'flex', justifyContent: "center", mt: 4 }}>
                <Button variant="contained" color="primary" onClick={handleEdit} sx={{ fontWeight: '600', px: 4 }}>
                  Edit Sport Type
                </Button>
              </Box></>
          }

        </Box>

      )}
    </Box>

  );
};

export default SportsType;
