import React, {useEffect, useState} from 'react';
import {DataGrid, GridColDef, GridEventListener} from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import {Button, CircularProgress} from '@mui/material';
import {ruRU} from '@mui/x-data-grid/locales';
import {AccessRights, Coordinates, FormOfEducation, Person, RowData, Semester} from "../interfaces.ts";
import axiosInstance from "../axiosConfig.ts";
import ObjectControlModal from "./reusable/ObjectControlModal.tsx";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
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

    const user = useSelector((state: RootState) => state.user);

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
        // const intervalId = setInterval(fetchGroups, 2000)
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

    const handleClickOpen: GridEventListener<'rowClick'> = (params) => {
        setChosenObject(params.row);
        setIsNewGroup(false)
        setOpen(true)
    };

    const handleClose = () => {
        setOpen(false);
        setIsNewGroup(false)
    };



    const handleSelectionChange = (newSelection: any) => {
        console.log(newSelection)
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

    const checkEditRights = (item: RowData) => {
        return (AccessRights.ADMIN in user.roles && item.adminCanEdit) || (item.createdBy === user.id)
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
            <div style={{display: 'flex', flexDirection: 'row', gap: '10px', margin: '10px 5px'}}>
                <Button onClick={createObject} variant="contained">
                    <AddCircleOutlineIcon sx={{marginRight: 1}}/>
                    Add group
                </Button>
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

            <Notification openCondition={requestError} onNotificationClose={handleNotificationClose} severity="error" responseText="Operation on object failed, try again"/>


        </div>
    );
};

export default CollectionObjectsDataGrid;
