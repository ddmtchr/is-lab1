import React, {useEffect, useState} from 'react';
import {DataGrid, GridColDef, GridEventListener} from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import {
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Typography
} from '@mui/material';
import {ruRU} from '@mui/x-data-grid/locales';
import {AccessRights, Coordinates, FormOfEducation, Person, RowData, Semester} from "../interfaces.ts";
import axiosInstance from "../axiosConfig.ts";
import ObjectControlModal from "./reusable/ObjectControlModal.tsx";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import HistoryIcon from '@mui/icons-material/History';
import CloseIcon from '@mui/icons-material/Close';
import {useSelector} from "react-redux";
import {RootState} from "../stores/store.ts";
import Notification from "./reusable/Notification.tsx";


const CollectionObjectsDataGrid: React.FC = () => {
    const [rows, setRows] = useState<RowData[]>([]);
    const [loading, setLoading] = useState(true)
    const [selectedRowIds, setSelectedRowIds] = useState<number[]>([]);
    const [open, setOpen] = useState(false)
    const [chosenObject, setChosenObject] = useState<RowData>()
    const [isNewGroup, setIsNewGroup] = useState<boolean>(false)
    const [requestError, setRequestError] = useState<boolean>(false)
    const [importFileActive, setImportFileActive] = useState<boolean>(false)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [importInProgress, setImportInProgress] = useState<boolean>(false)
    const [openImportHistory, setOpenImportHistory] = useState<boolean>(false)

    const user = useSelector((state: RootState) => state.user);

    const createData = (operationId: number, status: string, operationStarter: number, objectsAdded: number) => {
        return { operationId, status, operationStarter, objectsAdded };
    }

    const importHistoryRows = [
        createData(1, "success", 1, 5),
        createData(2, "failure", 2, 0),
        createData(3, "success", 7, 11),
        createData(4, "success", 52, 4),
    ];

    const fetchGroups = () => {
        axiosInstance.get('api/study-groups', {
        })
            .then((response) => {
                const rowData: RowData[] = response.data.map((item: any) => ({
                    id: item.id,
                    name: item.name,
                    coordinates: item.coordinates as Coordinates, // предполагаем, что координаты приходят корректно
                    creationDate: new Date(item.creationDate), // преобразование строки в объект Date
                    studentsCount: item.studentsCount,
                    expelledStudents: item.expelledStudents,
                    transferredStudents: item.transferredStudents,
                    formOfEducation: item.formOfEducation as FormOfEducation, // Приведение к типу FormOfEducation
                    shouldBeExpelled: item.shouldBeExpelled,
                    semesterEnum: item.semesterEnum as Semester, // Приведение к типу Semester
                    groupAdmin: item.groupAdmin as Person,
                    createdBy: item.createdBy,
                    adminCanEdit: item.editableByAdmin
                }));


                setRows(rowData)
                setLoading(false)
            })
    }

    useEffect(() => {
        fetchGroups()
        // const intervalId = setInterval(fetchGroups, 1000)
        //
        // return () => clearInterval(intervalId)
    }, [])

    if (loading) {
        return <div><CircularProgress size={24} sx={{marginTop: 2, marginBottom: 2}} /></div>;
    }

    const createObject = () => {
        setIsNewGroup(true)
        setOpen(true)
    }

    const openImportModal = () => {
        setImportFileActive(true)
    }

    const openImportHistoryModal = () => {
        setOpenImportHistory(true)
    }

    const handleClickOpen: GridEventListener<'rowClick'> = (params) => {
        setChosenObject(params.row);
        setIsNewGroup(false)
        setOpen(true)
    };

    const handleClose = () => {
        setOpen(false);
        setIsNewGroup(false)
    };


    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (file.type !== "application/json") {
                alert("Please choose a json file");
                return;
            }
            setSelectedFile(file);
        }
    };

    const handleFileUpload = async () => {
        if (!selectedFile) {
            console.log("No file selected.");
            return;
        }

        const formData = new FormData();
        formData.append("file", selectedFile);

        // Отправка файла через axios или любой другой механизм
        console.log("File to upload:", selectedFile);
        setImportInProgress(true)

        // try {
        //     const response = await axiosInstance.post("/upload-endpoint", formData, {
        //         headers: {
        //             "Content-Type": "multipart/form-data", // Убедитесь, что это правильно
        //         },
        //     });
        //     console.log("File uploaded successfully", response.data);
        // } catch (error) {
        //     console.error("Error uploading file", error);
        // }
    };

    const closeFileImport = () => {
        setImportFileActive(false)
        setSelectedFile(null)
        setImportInProgress(false) //TODO: брать отсюда, временно чтоб не мешал кружок
    }

    const closeImportHistory = () => {
        setOpenImportHistory(false)
    }

    const handleSelectionChange = (newSelection: any) => {
        setSelectedRowIds(newSelection);
    };

    const handleDelete = () => {
        // Удаляем выбранные строки
        setRows((prevRows) => prevRows.filter((row) => !selectedRowIds.includes(row.id) || !checkEditRights(row)));
        selectedRowIds.forEach(rowId => {
            axiosInstance.delete(`api/study-groups/${rowId}`)
        })
        // Очищаем выбранные строки после удаления
        setSelectedRowIds([]);
    };

    const handleRequestError = () => {
        setRequestError(true)
    }

    const handleNotificationClose = () => {
        setRequestError(false)
    }

    const isAdmin = () => {
        return user.roles.includes(AccessRights.ADMIN)
    }

    const checkEditRights = (item: RowData) => {
        return (isAdmin() && item.adminCanEdit) || (item.createdBy === user.id)
    }

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 90 },
        { field: 'name', headerName: 'Name', width: 150 },
        { field: 'coordinates', headerName: 'Coordinates', width: 150, renderCell: (params) => {
                return `(${params.value.x}, ${params.value.y})`
            } },
        { field: 'creationDate', headerName: 'Creation Date', width: 150, renderCell: (params) => {
                return `${params.value.getDate().toString().padStart(2, '0')}.${params.value.getMonth() + 1}.${params.value.getFullYear()}`
            } },
        { field: 'studentsCount', headerName: 'Students Count', width: 150 },
        { field: 'expelledStudents', headerName: 'expelledStudents', width: 150 },
        { field: 'transferredStudents', headerName: 'transferredStudents', width: 150 },
        { field: 'formOfEducation', headerName: 'formOfEducation', width: 200 },
        { field: 'shouldBeExpelled', headerName: 'shouldBeExpelled', width: 150 },
        { field: 'semesterEnum', headerName: 'Semester', width: 95 },
        { field: 'groupAdmin', headerName: 'Group admin', width: 110, renderCell: (params) => {
                return params.value.name
            } },

        { field: 'createdBy', headerName: 'createdBy', width: 90, renderCell: (params) => {
            return params.value === user.id ? `${params.value} (You)` : params.value
            } }
    ];


    return (
        <div style={{height: 700, width: '100%'}}>
            <div style={{display: 'flex', flexDirection: 'row', margin: '10px 5px', justifyContent: "space-between"}}>
                <div style={{display: 'flex', flexDirection: 'row', gap: '10px'}}>
                    <Button onClick={createObject} variant="contained">
                        <AddCircleOutlineIcon sx={{marginRight: 1}}/>
                        Add group
                    </Button>
                    <Button onClick={openImportModal} variant="contained">
                        <FileDownloadIcon sx={{marginRight: 1}}/>
                        Import from file
                    </Button>
                </div>

                <div style={{display: "flex", justifyContent: "right", flexGrow: 1, marginRight: "5px"}}>
                    <Button onClick={openImportHistoryModal} variant="contained">
                        <HistoryIcon sx={{marginRight: 1}}/>
                       Show import history
                    </Button>
                </div>

                <div>
                    {selectedRowIds.length !== 0 &&
                        <><Button
                            variant="outlined"
                            color="primary"
                            onClick={handleDelete}
                            disabled={selectedRowIds.length === 0}
                            title="Delete groups"
                        >
                            <DeleteIcon/>
                        </Button>

                        </>
                    }

                </div>
            </div>


            <DataGrid
                rows={rows}
                columns={columns}
                checkboxSelection
                disableRowSelectionOnClick
                onRowSelectionModelChange={handleSelectionChange}
                onRowClick={handleClickOpen}
                localeText={ruRU.components.MuiDataGrid.defaultProps.localeText}
            />

            {isNewGroup
                ? <ObjectControlModal
                    modalOpen={open}
                    onModalCLose={handleClose}
                    chosenObject={chosenObject}
                    isNewGroup={isNewGroup}
                    onSendError={handleRequestError}
                    readonlyForCurrentUser={false}
                />
                : chosenObject &&
                <ObjectControlModal
                    modalOpen={open}
                    onModalCLose={handleClose}
                    chosenObject={chosenObject}
                    isNewGroup={isNewGroup}
                    onSendError={handleRequestError}
                    readonlyForCurrentUser={!checkEditRights(chosenObject)}
                />
            }

            <Dialog open={importFileActive} onClose={closeFileImport}>
                <DialogTitle>Import groups from file</DialogTitle>
                <DialogContent>
                    {importInProgress ?
                        <div style={{display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", justifyContent: "center"}}>
                            <CircularProgress size={40}/>
                            <Typography>
                                Import in progress...
                            </Typography>
                        </div>

                        :
                        <div style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "20px"
                        }}>
                            <Button
                                variant="contained"
                                component="label"
                            >
                                Select file
                                <input
                                    type="file"
                                    hidden
                                    onChange={handleFileChange}
                                    accept=".json"
                                />
                            </Button>

                            {selectedFile ? <p>Selected file: {selectedFile.name}</p> : "No file selected"}
                        </div>

                    }


                </DialogContent>

                <DialogActions>
                    <Button
                        variant="outlined"
                        color="error"
                        onClick={closeFileImport}
                    >Cancel</Button>

                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleFileUpload}
                        disabled={!selectedFile}
                    >
                        Start import
                    </Button>
                </DialogActions>

            </Dialog>

            <Dialog open={openImportHistory} onClose={closeImportHistory} sx={{ '& .MuiDialog-paper': { width: '750px', maxWidth: 'none' } }}>
                <DialogTitle>
                    <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                        Import history
                        <IconButton onClick={closeImportHistory}>
                            <CloseIcon/>
                        </IconButton>
                    </div>

                </DialogTitle>
                <DialogContent>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Operation id</TableCell>
                                    <TableCell align="center">Status</TableCell>
                                    <TableCell align="center">Operation starter</TableCell>
                                    <TableCell align="center">Objects added</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {importHistoryRows
                                    .filter((row) => isAdmin() || row.operationId === user.id)
                                    .map((row) => (
                                    <TableRow
                                        key={row.operationId}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row">
                                            {row.operationId}
                                        </TableCell>
                                        <TableCell align="center">
                                            <p style={{margin: "0", color: row.status === 'success' ? "green" : "#C10020"}}>{row.status}</p>
                                        </TableCell>
                                        <TableCell align="center">{row.operationStarter}</TableCell>
                                        <TableCell align="center">{row.objectsAdded}</TableCell>
                                    </TableRow>
                                ))}

                                {importHistoryRows.length === 0 &&
                                <Typography>Nothing to show</Typography>
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {importHistoryRows.filter((row) => isAdmin() || row.operationId === user.id).length === 0 &&
                        <Typography color="#A9A9A9" fontSize="25px" fontStyle="italic" sx={{display: "flex", justifyContent: "center", marginTop: "10px"}}>
                            Nothing to show
                        </Typography>
                    }

                </DialogContent>

            </Dialog>


            <Notification openCondition={requestError} onNotificationClose={handleNotificationClose} severity="error" responseText="Operation on object failed, try again"/>


        </div>
    );
};

export default CollectionObjectsDataGrid;
