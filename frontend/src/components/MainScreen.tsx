import React, {useState} from "react";
import CollectionObjectsDataGrid from "./ProTable.tsx";
import {
    Alert,
    AppBar,
    Box,
    Button,
    ButtonGroup,
    Dialog, DialogActions, DialogContent,
    DialogTitle,
    IconButton, Snackbar,
    TextField,
    Toolbar,
    Typography
} from "@mui/material";
import {ThemeProvider, createTheme} from '@mui/material/styles';
import LogoutIcon from '@mui/icons-material/Logout';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import GroupRemoveIcon from '@mui/icons-material/GroupRemove';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import Diversity2Icon from '@mui/icons-material/Diversity2';
import AccessibleIcon from '@mui/icons-material/Accessible';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import CloseIcon from '@mui/icons-material/Close';
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



const MainScreen: React.FC = () => {
    //настройки параметров в модальном окне ввода значений
    const [intModalValue, setIntModalValue] = useState<string>('');
    const [validationError, setValidationError] = useState(true);
    const [successRequest, setSuccessRequest] = useState(false)
    const [responseText, setResponseText] = useState<string>('')
    const [helperText, setHelperText] = useState('');
    const [isInformationalMessage, setIsInformationalMessage] = useState(false)
    const [substringToSearch, setSubstringToSearch] = useState<string>('')
    const [requestError, setRequestError] = useState(false)

    const [openIndex, setOpenIndex] = useState<number>()

    const navigate = useNavigate()

    const defaultResponseErrorMessage = 'Request error, something went wrong...(('

    const handleSpecialButtonClick = (index: number) => {
        setOpenIndex(index)
    }


    const handleSpecialActionButtonClick = (actionIndex: number) => {
        switch (actionIndex) {
            case 1:
                axiosInstance.delete(`api/special/delete-by-should-be-expelled`, {params: {
                        value: intModalValue
                    }})
                    .then((response) => {
                        console.log(response)
                        if (response.status === 204) {
                            setSuccessRequest(true)
                            setResponseText(`Objects have been removed successfully!`)
                            setIsInformationalMessage(false)
                        }
                    })
                    .catch(() => {
                        setRequestError(true)
                        setResponseText(defaultResponseErrorMessage)
                    })
                setOpenIndex(0)
                setIntModalValue('')
                setValidationError(true)
                break
            case 3:
                axiosInstance.get(`api/special/search-by-name`, {params: {
                        prefix: substringToSearch
                    }})
                    .then((response) => {
                        if (response.status === 200) {
                            const matchesArray = response.data.length !== 0
                                ? response.data
                                    .map((item: { id: any; name: any; }) => `ID: ${item.id}. Name: ${item.name} <br>`)
                                    .join('')
                                : 'No matches'
                            setSuccessRequest(true)
                            setResponseText(`Found matches: <br> ${matchesArray}`)
                            setIsInformationalMessage(true)
                        }
                    })
                    .catch(() => {
                        setRequestError(true)
                        setResponseText(defaultResponseErrorMessage)
                    })
                setOpenIndex(0)
                setSubstringToSearch('')
                break
            case 4:
                axiosInstance.put(`api/special/expel/${intModalValue}`)
                    .then((response) => {
                        if (response.status === 200) {
                            setSuccessRequest(true)
                            setResponseText(`Students from group ${intModalValue} have been expelled!`)
                            setIsInformationalMessage(false)
                        }
                    })
                    .catch((error) => {
                        setRequestError(true)
                        if (error.response.status === 404) {
                            setResponseText(`Group with such ID not found`)
                        } else {
                            setResponseText(defaultResponseErrorMessage)
                        }
                    })
                setOpenIndex(0)
                setIntModalValue('')
                setValidationError(true)
                break

            default:
                setOpenIndex(0)
        }
    }

    const handleNotificationCLose = () => {
        setSuccessRequest(false)
        setRequestError(false)
    }

    const getCountAllExpelledStudents = () => {
        axiosInstance.get(`api/special/expelled`)
            .then((response) => {
                if (response.status === 200) {
                    setSuccessRequest(true)
                    setResponseText(`Total number of expelled students: ${response.data}`)
                    setIsInformationalMessage(true)
                }
            })
            .catch(() => {
                setRequestError(true)
                setResponseText(defaultResponseErrorMessage)
            })
    }

    const groupById = () => {
        axiosInstance.get(`api/special/count-group-by-id`)
            .then((response) => {
                if (response.status === 200) {
                    const formattedData = response.data
                        .map((item: { id: any; count: any; }) => `Группа ${item.id}: ${item.count} <br>`)
                        .join('')
                    setSuccessRequest(true)
                    setResponseText(formattedData)
                    setIsInformationalMessage(true)
                }
            })
            .catch(() => {
                setRequestError(true)
                setResponseText(defaultResponseErrorMessage)
            })
    }

    const validateIntModalValue = (value: string) => {
        if (parseInt(value) < 0 || !Number.isInteger(+value) || value.length === 0) {
            setValidationError(true); // Устанавливаем состояние ошибки
            setHelperText('Value must be a positive integer!');
        } else {
            setValidationError(false); // Ошибок нет
            setHelperText(''); // Очищаем текст ошибки
        }
    };

    // Обработка изменения значения в поле
    const handleIntModalValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = event.target.value;
        setIntModalValue(inputValue);
        validateIntModalValue(inputValue); // Валидируем при каждом изменении
    };

    const handleSubstringChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = event.target.value;
        setSubstringToSearch(inputValue);
    };

    const action = (
        <React.Fragment>
            <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={handleNotificationCLose}
            >
                <CloseIcon fontSize="small" />
            </IconButton>
        </React.Fragment>
    );


    const buttons = [
        <Button key="1" onClick={() => handleSpecialButtonClick(1)}><RemoveCircleOutlineIcon sx={{marginRight: 1}}/> Remove by should Be Expelled </Button>,
        <Button key="2" onClick={groupById}> <Diversity2Icon sx={{marginRight: 1}}/> Group by id</Button>,
        <Button key="3" onClick={() => handleSpecialButtonClick(3)}> <ManageSearchIcon sx={{marginRight: 1}}/> Find name by substring </Button>,
        <Button key="4" onClick={() => handleSpecialButtonClick(4)}><GroupRemoveIcon sx={{marginRight: 1}}/>Expel all from group</Button>,
        <Button key="5" onClick={getCountAllExpelledStudents}><AccessibleIcon sx={{marginRight: 1}}/>Count all expelled</Button>,
    ];

    return (
        <Box sx={{flexGrow: 1, minWidth: '100vw'}}>
            <AppBar position="static" sx={{textAlign: 'center'}}>
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                        Current user: писька
                    </Typography>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        title="Logout"
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

                <ButtonGroup size="large" aria-label="Large button group">
                    {buttons}
                </ButtonGroup>

                <Snackbar
                    open={successRequest}
                    autoHideDuration={6000}
                    onClose={handleNotificationCLose}
                    action={action}
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                >
                    <Alert
                        onClose={handleNotificationCLose}
                        severity={isInformationalMessage ? "info": "success"}
                        variant="filled"
                        sx={{ width: '100%' }}
                    >
                        <span dangerouslySetInnerHTML={{__html: responseText}}/>
                    </Alert>
                </Snackbar>

                <Dialog open={openIndex === 1} onClose={() => setOpenIndex(0)}>
                    <DialogTitle>Remove all groups with shouldBeExpelled value = </DialogTitle>
                    <DialogContent>
                        <TextField
                            required
                            label="shouldBeExpelled value"
                            type="number"
                            value={intModalValue}
                            onChange={handleIntModalValueChange}
                            error={validationError}
                            helperText={helperText}
                            sx={{marginTop: 2, width: '100%'}}
                        ></TextField>
                    </DialogContent>

                    <DialogActions>
                        <Button
                            disabled={validationError}
                            onClick={() => handleSpecialActionButtonClick(1)}
                        >
                            Delete
                        </Button>
                    </DialogActions>

                </Dialog>

                <Dialog open={openIndex === 3} onClose={() => {setOpenIndex(0); setSubstringToSearch('')}}>
                    <DialogTitle>Enter substring for search</DialogTitle>
                    <DialogContent>
                        <TextField
                            required
                            label="Seach string"
                            value={substringToSearch}
                            onChange={handleSubstringChange}
                            sx={{marginTop: 2}}
                        ></TextField>
                    </DialogContent>

                    <DialogActions>
                        <Button
                            disabled={substringToSearch.length < 1}
                            onClick={() => handleSpecialActionButtonClick(3)}
                        >
                            Search
                        </Button>
                    </DialogActions>

                </Dialog>

                <Dialog open={openIndex === 4} onClose={() => setOpenIndex(0)}>
                    <DialogTitle>Enter Group ID to expel students</DialogTitle>
                    <DialogContent>
                        <TextField
                            required
                            label="Group ID"
                            type="number"
                            value={intModalValue}
                            onChange={handleIntModalValueChange}
                            error={validationError}
                            helperText={helperText}
                            sx={{marginTop: 2}}
                        ></TextField>
                    </DialogContent>

                    <DialogActions>
                        <Button
                            disabled={validationError}
                            onClick={() => handleSpecialActionButtonClick(4)}
                        >
                            Expel
                        </Button>
                    </DialogActions>

                </Dialog>

                <Snackbar
                    open={requestError}
                    autoHideDuration={6000}
                    onClose={handleNotificationCLose}
                    action={action}
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                >
                    <Alert
                        onClose={handleNotificationCLose}
                        severity="error"
                        variant="filled"
                        sx={{ width: '100%' }}
                    >
                        {responseText}
                    </Alert>
                </Snackbar>



            </ThemeProvider>


        </Box>


    );
}

export default MainScreen