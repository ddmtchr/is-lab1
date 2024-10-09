import React, {useEffect, useState} from 'react';
import {DataGrid, GridColDef, GridEventListener} from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import {Button} from '@mui/material';
import {ruRU} from '@mui/x-data-grid/locales';
import {Coordinates, FormOfEducation, Person, RowData, Semester} from "../interfaces.ts";
import axiosInstance from "../axiosConfig.ts";
import ObjectControlModal from "./reusable/ObjectControlModal.tsx";





const CollectionObjectsDataGrid: React.FC = () => {
    const [rows, setRows] = useState<RowData[]>([]);
    const [loading, setLoading] = useState(true)
    const [selectedRowIds, setSelectedRowIds] = useState<number[]>([]);
    const [open, setOpen] = useState(false)
    const [chosenObject, setChosenObject] = useState<RowData>()

    useEffect(() => {
        axiosInstance.get('api/study-groups')
            .then((response) => {

                console.log(response.data)

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
                    groupAdmin: item.groupAdmin as Person, // Приведение к типу Person
                }));


               setRows(rowData)
                setLoading(false)
            })
    }, [])

    if (loading) {
        return <div>Loading...</div>; // Отображаем загрузку до получения данных
    }

    const handleClickOpen: GridEventListener<'rowClick'> = (params) => {
        // Получаем ID строки, на которую кликнули
        console.log(params.row)
        setChosenObject(params.row);
        setOpen(true)
    };

    const handleClose = () => {
        setOpen(false);
    };



    const handleSelectionChange = (newSelection: any) => {
        setSelectedRowIds(newSelection);
    };

    const handleDelete = () => {
        // Удаляем выбранные строки
        setRows((prevRows) => prevRows.filter((row) => !selectedRowIds.includes(row.id)));
        // Очищаем выбранные строки после удаления
        setSelectedRowIds([]);
    };




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
        { field: 'formOfEducation', headerName: 'formOfEducation', width: 150 },
        { field: 'shouldBeExpelled', headerName: 'shouldBeExpelled', width: 150 },
        { field: 'semesterEnum', headerName: 'Semester', width: 110 },
        { field: 'groupAdmin', headerName: 'Group admin', width: 110, renderCell: (params) => {
            return params.value.name
            } },
    ];


    return (
        <div style={{ height: 400, width: '100%' }}>
            <DataGrid
                rows={rows}
                columns={columns}
                checkboxSelection
                disableRowSelectionOnClick
                onRowSelectionModelChange={handleSelectionChange}
                onRowClick={handleClickOpen}
                localeText={ruRU.components.MuiDataGrid.defaultProps.localeText}
            />
            <ObjectControlModal modalOpen={open} onModalCLose={handleClose} chosenObject={chosenObject}/>
            <div>
                {selectedRowIds.length !== 0 &&
                    <><Button
                        variant="contained"
                        color="primary"
                        onClick={handleDelete}
                        disabled={selectedRowIds.length === 0}
                        style={{marginTop: 10, marginLeft: 10}}
                    >
                        <DeleteIcon/>
                    </Button>

                    </>
                }

            </div>


        </div>
    );
};

export default CollectionObjectsDataGrid;
