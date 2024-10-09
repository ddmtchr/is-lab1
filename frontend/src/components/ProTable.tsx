import React, {useState} from 'react';
import {DataGrid, GridColDef} from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography} from '@mui/material';
import {ruRU} from '@mui/x-data-grid/locales';
import {Color, Coordinates, Country, FormOfEducation, Person, Semester} from "../interfaces.ts";


interface RowData {
    id: number;
    name: string;
    coordinates: Coordinates;
    creationDate: Date;
    studentsCount: number;
    expelledStudents: number;
    transferredStudents: number;
    formOfEducation: FormOfEducation;
    shouldBeExpelled: number;
    semester: Semester;
    groupAdmin: Person;
}

const initialRows: RowData[] = [
    {
        id: 1,
        name: 'P3311',
        coordinates: {x: 10, y: 20},
        creationDate: new Date(),
        studentsCount: 13,
        expelledStudents: 3,
        transferredStudents: 2,
        formOfEducation: FormOfEducation.FULL_TIME_EDUCATION,
        shouldBeExpelled: 1,
        semester: Semester.SIXTH,
        groupAdmin: {
            name: 'Sergei',
            eyeColor: Color.WHITE,
            hairColor: Color.YELLOW,
            location: {
                x: 100,
                y: 20,
                z: 55,
                name: 'Knowhere'
            },
            weight: 62,
            nationality: Country.RUSSIA
        }
    },
];

const CollectionObjectsDataGrid: React.FC = () => {
    const [rows, setRows] = useState(initialRows);
    const [selectedRowIds, setSelectedRowIds] = useState<number[]>([]);
    const [open, setOpen] = useState(false)

    const handleClickOpen = () => {
        setOpen(true);
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
        { field: 'semester', headerName: 'Semester', width: 110 },
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
            <div>
                {selectedRowIds.length !== 0 &&
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleDelete}
                        disabled={selectedRowIds.length === 0}
                        style={{ marginTop: 10, marginLeft: 10 }}
                    >
                       <DeleteIcon/>
                    </Button>
                }

            </div>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Редактировать объект</DialogTitle>
                <DialogContent>
                    <Typography>
                        Свойства
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary" variant="contained">
                        Сохранить
                    </Button>
                </DialogActions>
            </Dialog>

        </div>
    );
};

export default CollectionObjectsDataGrid;
