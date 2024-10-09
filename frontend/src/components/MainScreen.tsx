import React from "react";
import CollectionObjectsDataGrid from "./ProTable.tsx";
import {AppBar, Box, Button, ButtonGroup, IconButton, Toolbar, Typography} from "@mui/material";
import {ThemeProvider, createTheme} from '@mui/material/styles';
import LogoutIcon from '@mui/icons-material/Logout';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import GroupRemoveIcon from '@mui/icons-material/GroupRemove';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import Diversity2Icon from '@mui/icons-material/Diversity2';
import AccessibleIcon from '@mui/icons-material/Accessible';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import {useNavigate} from "react-router-dom";
import axiosInstance from "../axiosConfig.ts";

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});

const createObject = () => {
    axiosInstance.post('api/study-groups', {
            "name": "string",
            "coordinates": {
                "x": 0,
                "y": 0
            },
            "studentsCount": 5,
            "expelledStudents": 2,
            "transferredStudents": 2,
            "formOfEducation": "DISTANCE_EDUCATION",
            "shouldBeExpelled": 1,
            "semesterEnum": "SECOND",
            "groupAdmin": {
                "name": "string",
                "eyeColor": "YELLOW",
                "hairColor": "YELLOW",
                "location": {
                    "x": 0,
                    "y": 0,
                    "z": 0,
                    "name": "string"
                },
                "weight": 3,
                "nationality": "RUSSIA"
            }
        }
        )
}

const buttons = [
    <Button key="two"><RemoveCircleOutlineIcon sx={{marginRight: 1}}/> Remove by should Be Expelled </Button>,
    <Button key="one"> <Diversity2Icon sx={{marginRight: 1}}/> Group by id</Button>,
    <Button key="five"> <ManageSearchIcon sx={{marginRight: 1}}/> Find name by substring </Button>,
    <Button key="three"><GroupRemoveIcon sx={{marginRight: 1}}/>Expel all from group</Button>,
    <Button key="four"><AccessibleIcon sx={{marginRight: 1}}/>Count all expelled</Button>,
];

const MainScreen: React.FC = () => {
    const navigate = useNavigate()
    return (
        <Box sx={{flexGrow: 1, minWidth: '100vw'}}>
            <AppBar position="static" sx={{textAlign: 'center'}}>
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                        Текущий пользователь: писька
                    </Typography>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        title="Выйти"
                        onClick={() => navigate('/login')}
                    >
                        <LogoutIcon/>
                    </IconButton>
                    {/*<Button color="inherit">Login</Button>*/}
                </Toolbar>
            </AppBar>





            <ThemeProvider theme={darkTheme}>

                <Button onClick={createObject} variant="contained" sx={{marginTop: 2, marginBottom: 2}}>
                    <AddCircleOutlineIcon sx={{marginRight: 1}}/>
                    Add group
                </Button>

                <CollectionObjectsDataGrid/>

            </ThemeProvider>



            <ButtonGroup size="large" aria-label="Large button group">
                {buttons}
            </ButtonGroup>
        </Box>


    );
}

export default MainScreen