import React, {useState} from "react";
import CollectionObjectsDataGrid from "./ProTable.tsx";
import {
    Box,
    Button,
    ButtonGroup,
    Dialog, DialogActions, DialogContent,
    DialogTitle,
    TextField,
} from "@mui/material";
import {ThemeProvider, createTheme} from '@mui/material/styles';
import GroupRemoveIcon from '@mui/icons-material/GroupRemove';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import Diversity2Icon from '@mui/icons-material/Diversity2';
import AccessibleIcon from '@mui/icons-material/Accessible';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import axiosInstance from "../axiosConfig.ts";
import Notification from "./reusable/Notification.tsx";
import CustomAppBar from "./reusable/CustomAppBar.tsx";

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});



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
                        if (response.status === 200) {
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
            setValidationError(true);
            setHelperText('Value must be a positive integer!');
        } else {
            setValidationError(false);
            setHelperText('');
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


    const buttons = [
        <Button key="1" onClick={() => handleSpecialButtonClick(1)}><RemoveCircleOutlineIcon sx={{marginRight: 1}}/> Remove by should Be Expelled </Button>,
        <Button key="2" onClick={groupById}> <Diversity2Icon sx={{marginRight: 1}}/> Group by id</Button>,
        <Button key="3" onClick={() => handleSpecialButtonClick(3)}> <ManageSearchIcon sx={{marginRight: 1}}/> Find name by substring </Button>,
        <Button key="4" onClick={() => handleSpecialButtonClick(4)}><GroupRemoveIcon sx={{marginRight: 1}}/>Expel all from group</Button>,
        <Button key="5" onClick={getCountAllExpelledStudents}><AccessibleIcon sx={{marginRight: 1}}/>Count all expelled</Button>,
    ];

    return (
                <Box sx={{flexGrow: 1, minWidth: '100vw'}}>
                    <CustomAppBar/>

                    <ThemeProvider theme={darkTheme}>

                        <CollectionObjectsDataGrid/>

                <ButtonGroup size="large" aria-label="Large button group" sx={{marginTop: 6, width: '90%'}}>
                    {buttons}
                </ButtonGroup>


                    <Notification
                        onNotificationClose={handleNotificationCLose}
                        openCondition={successRequest}
                        responseText={responseText}
                        severity={isInformationalMessage ? 'info' : 'success'}
                    />

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


                        <Notification
                            onNotificationClose={handleNotificationCLose}
                            openCondition={requestError}
                            responseText={responseText}
                            severity="error"
                        />
                </ThemeProvider>


</Box>


    );
}

export default MainScreen