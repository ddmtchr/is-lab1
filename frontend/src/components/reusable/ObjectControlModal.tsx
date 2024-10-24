import {
    Box,
    Button,
    Dialog,
    DialogContent,
    DialogTitle, FormControlLabel, FormGroup,
    InputLabel,
    MenuItem,
    Select, SelectChangeEvent, Switch,
    TextField,
    Typography
} from "@mui/material";
import React, {useEffect, useState} from "react";
import {Color, Coordinates, Country, FormOfEducation, Person, Semester, Location, RowData} from "../../interfaces.ts";
import axiosInstance from "../../axiosConfig.ts";
import Notification from "./Notification.tsx";

interface ModalProps {
    modalOpen: boolean;
    onModalCLose: () => void;
    chosenObject?: RowData | undefined,
    isNewGroup: boolean;
    onSendError: () => void;
    readonlyForCurrentUser: boolean
}


const ObjectControlModal: React.FC<ModalProps> = ({modalOpen, onModalCLose, chosenObject, isNewGroup, onSendError, readonlyForCurrentUser}) => {

    const [name, setName] = useState<string | undefined>(chosenObject?.name);
    const [coordinates, setCoordinates] = useState<Coordinates | undefined>(chosenObject?.coordinates);
    const [studentsCount, setStudentsCount] = useState<number | undefined>(chosenObject?.studentsCount);
    const [expelledStudents, setExpelledStudents] = useState<number | undefined>(chosenObject?.expelledStudents);
    const [transferredStudents, setTransferredStudents] = useState<number | undefined>(chosenObject?.transferredStudents);
    const [formOfEducation, setFormOfEducation] = useState<FormOfEducation | undefined>(chosenObject?.formOfEducation);
    const [shouldBeExpelled, setShouldBeExpelled] = useState<number | undefined>(chosenObject?.shouldBeExpelled);
    const [semesterEnum, setSemesterEnum] = useState<Semester | undefined>(chosenObject?.semesterEnum);
    const [groupAdmin, setGroupAdmin] = useState<Person | undefined>(chosenObject?.groupAdmin);
    const [adminCanEdit, setAdminCanEdit] = useState<boolean |undefined>(chosenObject?.adminCanEdit)

    const [requestError, setRequestError] = useState<boolean>(false)
    const [existingCoordinates, setExistingCoordinates] = useState<Coordinates[]>([])
    const [selectExistingCoordinates, setSelectExistingCoordinates] = useState<boolean>(false)



    useEffect(() => {
        axiosInstance.get('api/coordinates')
            .then((response) => {
                setExistingCoordinates(response.data)
            })
            .catch(() => setRequestError(true))
    }, []);

    const handleClose = () => {
        onModalCLose()
    }

    const handleNotificationClose = () => {
        setRequestError(false)
    }

    const handleObjectFormSubmit = async (event: React.FormEvent) => {
        event.preventDefault()

        const requestData = {
            "name": name,
            "coordinates": {
                "x": coordinates?.x,
                "y": coordinates?.y
            },
            "studentsCount": studentsCount,
            "expelledStudents": expelledStudents,
            "transferredStudents": transferredStudents,
            "formOfEducation": formOfEducation,
            "shouldBeExpelled": shouldBeExpelled,
            "semesterEnum": semesterEnum,
            "groupAdmin": {
                "name": groupAdmin?.name,
                "eyeColor": groupAdmin?.eyeColor,
                "hairColor": groupAdmin?.hairColor,
                "location": {
                    "x": groupAdmin?.location.x,
                    "y": groupAdmin?.location.y,
                    "z": groupAdmin?.location.z,
                    "name": groupAdmin?.location.name
                },
                "weight": groupAdmin?.weight,
                "nationality": groupAdmin?.nationality
            },
            "editableByAdmin": adminCanEdit

        }

        if (isNewGroup) {
            await axiosInstance.post('api/study-groups', requestData)
                .catch(() => {onSendError()})
            onModalCLose()
        } else {
            await axiosInstance.put(`api/study-groups/${chosenObject?.id}`, requestData)
                .catch(() => {onSendError()})
            onModalCLose()
        }
    }


    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
    };

    const handleCoordinatesChange = (field: keyof Coordinates, value: number) => {
        // @ts-ignore
        setCoordinates((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleCoordinatesChoosing = (event: SelectChangeEvent) => {
        setSelectExistingCoordinates(true)
        handleCoordinatesChange('x', Number(event.target.value.split(';')[0]))
        handleCoordinatesChange('y', Number(event.target.value.split(';')[1]))

    }


    const handleStudentsCountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setStudentsCount(Number(event.target.value));
    };

    const handleExpelledStudentsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setExpelledStudents(Number(event.target.value));
    };

    const handleTransferredStudentsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTransferredStudents(Number(event.target.value));
    };

    const handleFormOfEducationChange = (event: SelectChangeEvent) => {
        setFormOfEducation(event.target.value as FormOfEducation);
    };

    const handleShouldBeExpelledChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setShouldBeExpelled(Number(event.target.value));
    };

    const handleSemesterEnumChange = (event: SelectChangeEvent) => {
        setSemesterEnum(event.target.value as Semester);
    };

    const handleGroupAdminChange = (field: keyof Person, value: any) => {
        // @ts-ignore
        setGroupAdmin((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleGroupAdminLocationChange = (field: keyof Location, value: number | string) => {
        // @ts-ignore
        setGroupAdmin((prev) => ({
            ...prev,
            location: {
                // @ts-ignore
                ...prev.location,
                [field]: value,
            },
        }));
    };

    return (
        <Dialog open={modalOpen} onClose={handleClose} sx={{ '& .MuiDialog-paper': { width: '600px', maxWidth: 'none' } }}>
            {!isNewGroup && <DialogTitle>Edit group {chosenObject?.name}</DialogTitle>}
            {isNewGroup && <DialogTitle>Create new group</DialogTitle>}

            <DialogContent>
                <Box
                    sx={{display: 'flex', flexDirection: 'column', gap: '20px'}}
                    component="form"
                    onSubmit={handleObjectFormSubmit}
                >
                    {!isNewGroup && <TextField
                        label="Id"
                        disabled
                        defaultValue={isNewGroup ? undefined : chosenObject?.id}
                        sx={{marginTop: '5px'}}
                    ></TextField>}


                    <TextField
                        label="Name"
                        defaultValue={isNewGroup ? undefined : chosenObject?.name}
                        onChange={handleNameChange}
                        disabled={readonlyForCurrentUser}
                        sx={{marginTop: '5px'}}
                    ></TextField>

                    <Box sx={{display: 'flex', flexDirection: 'column'}}>
                        <Typography sx={{marginBottom: '10px'}}>
                            Coordinates
                        </Typography>

                        <Select
                            defaultValue=""
                            variant="standard"
                            onChange={handleCoordinatesChoosing}
                            disabled={readonlyForCurrentUser}
                            sx={{marginBottom: '20px'}}
                        >
                            {existingCoordinates.map((coordinatesPair, index) => (
                                <MenuItem value={coordinatesPair.id} key={index}>
                                    {coordinatesPair.x};{coordinatesPair.y}
                                </MenuItem>
                            ))}
                        </Select>

                        {!selectExistingCoordinates &&
                            <Box sx={{display: 'flex', flexDirection: 'row', gap: '5px'}}>
                                <TextField
                                    label="X"
                                    defaultValue={isNewGroup ? undefined : chosenObject?.coordinates.x}
                                    sx={{marginRight: '5px'}}
                                    onChange={(e) => handleCoordinatesChange('x', Number(e.target.value))}
                                    disabled={readonlyForCurrentUser}
                                ></TextField>

                                <TextField
                                    label="Y"
                                    defaultValue={isNewGroup ? undefined : chosenObject?.coordinates.y}
                                    onChange={(e) => handleCoordinatesChange('y', Number(e.target.value))}
                                    disabled={readonlyForCurrentUser}
                                ></TextField>
                            </Box>
                        }

                    </Box>

                    {!isNewGroup && <TextField
                        disabled
                        label="Creation date"
                        defaultValue={isNewGroup ? undefined : chosenObject?.creationDate}
                    ></TextField>}


                    <TextField
                        label="Students count"
                        type="number"
                        defaultValue={isNewGroup ? undefined : chosenObject?.studentsCount}
                        onChange={handleStudentsCountChange}
                        disabled={readonlyForCurrentUser}
                    ></TextField>

                    <TextField
                        label="Expelled students"
                        type="number"
                        defaultValue={isNewGroup ? undefined : chosenObject?.expelledStudents}
                        onChange={handleExpelledStudentsChange}
                        disabled={readonlyForCurrentUser}
                    ></TextField>

                    <TextField
                        label="Transferred students"
                        type="number"
                        defaultValue={isNewGroup ? undefined : chosenObject?.transferredStudents}
                        onChange={handleTransferredStudentsChange}
                        disabled={readonlyForCurrentUser}
                    ></TextField>

                        <InputLabel>Form of education</InputLabel>
                        <Select
                            defaultValue={isNewGroup ? undefined : chosenObject?.formOfEducation}
                            label="Form of education"
                            variant="standard"
                            disabled={readonlyForCurrentUser}
                            onChange={handleFormOfEducationChange}
                        >
                            {Object.values(FormOfEducation).map((form, index) => (
                                <MenuItem value={form} key={index}>
                                    {form}
                                </MenuItem>
                            ))}
                        </Select>

                    <TextField
                        label="Should be expelled"
                        type="number"
                        defaultValue={isNewGroup ? undefined : chosenObject?.shouldBeExpelled}
                        onChange={handleShouldBeExpelledChange}
                        disabled={readonlyForCurrentUser}
                    ></TextField>

                    <InputLabel>Semester</InputLabel>
                    <Select
                        defaultValue={isNewGroup ? undefined : chosenObject?.semesterEnum}
                        label="Semester"
                        variant="standard"
                        onChange={handleSemesterEnumChange}
                        disabled={readonlyForCurrentUser}
                    >
                        {Object.values(Semester).map((semester, index) => (
                            <MenuItem value={semester} key={index}>
                                {semester}
                            </MenuItem>
                        ))}
                    </Select>

                    <Box className="form-box-container">
                        <Typography sx={{marginBottom: '10px'}}>Group admin</Typography>
                        <TextField
                            label="Name"
                            defaultValue={isNewGroup ? undefined : chosenObject?.groupAdmin.name}
                            onChange={(e) => handleGroupAdminChange('name', e.target.value)}
                            disabled={readonlyForCurrentUser}
                        ></TextField>

                       <InputLabel>Eye color</InputLabel>
                    <Select
                        defaultValue={isNewGroup ? undefined : chosenObject?.groupAdmin.eyeColor}
                        label="Eye color"
                        variant="standard"
                        sx={{width: '100%'}}
                        onChange={(e) => handleGroupAdminChange('eyeColor', e.target.value as Color)}
                        disabled={readonlyForCurrentUser}
                    >
                        {Object.values(Color).map((color, index) => (
                            <MenuItem value={color} key={index}>
                                {color}
                            </MenuItem>
                        ))}
                    </Select>

                        <InputLabel>Hair color</InputLabel>
                        <Select
                            defaultValue={isNewGroup ? undefined : chosenObject?.groupAdmin.hairColor}
                            label="Hair color"
                            variant="standard"
                            sx={{width: '100%'}}
                            onChange={(e) => handleGroupAdminChange('hairColor', e.target.value as Color)}
                            disabled={readonlyForCurrentUser}
                        >
                            {Object.values(Color).map((color, index) => (
                                <MenuItem value={color} key={index}>
                                    {color}
                                </MenuItem>
                            ))}
                        </Select>

                        <Box className="form-box-container">
                            <Typography>Location</Typography>

                            <TextField
                                label="X"
                                defaultValue={isNewGroup ? undefined : chosenObject?.groupAdmin.location.x}
                                onChange={(e) => handleGroupAdminLocationChange('x', Number(e.target.value))}
                                disabled={readonlyForCurrentUser}
                            ></TextField>

                            <TextField
                                label="Y"
                                defaultValue={isNewGroup ? undefined : chosenObject?.groupAdmin.location.y}
                                onChange={(e) => handleGroupAdminLocationChange('y', Number(e.target.value))}
                                disabled={readonlyForCurrentUser}
                            ></TextField>

                            <TextField
                                label="Z"
                                defaultValue={isNewGroup ? undefined : chosenObject?.groupAdmin.location.z}
                                onChange={(e) => handleGroupAdminLocationChange('z', Number(e.target.value))}
                                disabled={readonlyForCurrentUser}
                            ></TextField>

                            <TextField
                                label="Name"
                                defaultValue={isNewGroup ? undefined : chosenObject?.groupAdmin.location.name}
                                onChange={(e) => handleGroupAdminLocationChange('name', e.target.value)}
                                disabled={readonlyForCurrentUser}
                            ></TextField>
                        </Box>

                        <InputLabel>Nationality</InputLabel>
                        <Select
                            defaultValue={isNewGroup ? undefined : chosenObject?.groupAdmin.nationality}
                            label="Nationality"
                            variant="standard"
                            sx={{width: '100%'}}
                            onChange={(e) => handleGroupAdminChange('nationality', e.target.value as Country)}
                            disabled={readonlyForCurrentUser}
                        >
                            {Object.values(Country).map((country, index) => (
                                <MenuItem value={country} key={index}>
                                    {country}
                                </MenuItem>
                            ))}
                        </Select>

                        <TextField
                            label="Weight"
                            defaultValue={isNewGroup ? undefined : chosenObject?.groupAdmin.weight}
                            onChange={(e) => handleGroupAdminChange('weight', Number(e.target.value))}
                            disabled={readonlyForCurrentUser}
                        ></TextField>
                    </Box>

                    <FormGroup>
                        <FormControlLabel control={
                            <Switch
                                defaultValue={isNewGroup ? 'false' : `${chosenObject?.adminCanEdit}`}
                                checked={adminCanEdit}
                                onChange={(e) => setAdminCanEdit(e.target.checked)}
                                inputProps={{ 'aria-label': 'controlled' }}
                                disabled={readonlyForCurrentUser}
                            />
                        }
                                          label="Item can be edited by admin"/>
                    </FormGroup>

                    <Box sx={{display: "flex", justifyContent: "space-between"}}>
                        <Button onClick={handleClose} color="error" variant="outlined">
                            Cancel
                        </Button>
                        <Button color="primary" variant="contained" type="submit" disabled={readonlyForCurrentUser}>
                            {isNewGroup ? 'Create' : 'Update'}
                        </Button>
                    </Box>


                </Box>


            </DialogContent>

            <Notification openCondition={requestError} onNotificationClose={handleNotificationClose} severity="error" responseText="Error while fetching existing related objects"/>
        </Dialog>


    )
}

export default ObjectControlModal;