import {
    Box,
    Button,
    Dialog,
    DialogContent,
    DialogTitle, FormControl, FormControlLabel,
    InputLabel,
    MenuItem,
    Select, SelectChangeEvent, Stack, Switch,
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
    const [adminCanEdit, setAdminCanEdit] = useState<boolean | undefined>(chosenObject?.adminCanEdit)

    const [requestError, setRequestError] = useState<boolean>(false)
    const [existingCoordinates, setExistingCoordinates] = useState<Coordinates[]>([])
    const [existingAdmins, setExistingAdmins] = useState<Person[]>([])
    const [selectExistingCoordinates, setSelectExistingCoordinates] = useState<boolean>(false)
    const [selectExistingLocations, setSelectExistingLocations] = useState<boolean>(false)
    const [selectExistingAdmins, setSelectExistingAdmins] = useState<boolean>(false)

    const [errors, setErrors] = useState<{ stringError?: string; numberError?: string; studentsCountError?: string;
        expelledStudentsError?: string;
        transferredStudentsError?: string;
        shouldBeExpelledError?: string}>({});


    useEffect(() => {
        axiosInstance.get('api/coordinates')
            .then((response) => {
                setExistingCoordinates(response.data)
            })
            .catch(() => setRequestError(true))

        axiosInstance.get('api/persons')
            .then((response) => {
                setExistingAdmins(response.data)
            })
            .catch(() => {
                setRequestError(true)
                setExistingAdmins([])
            })
        setExistingAdmins([])
    }, []);

    const handleClose = () => {
        setSelectExistingCoordinates(false)
        setSelectExistingAdmins(false)
        setSelectExistingLocations(false)
        setErrors((prevErrors) => ({ ...prevErrors,
            numberError: undefined,
            stringError: undefined,
            studentsCountError: undefined,
            expelledStudentsError: undefined,
            transferredStudentsError: undefined,
            shouldBeExpelledError: undefined
        }));
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
                ...(selectExistingCoordinates ? { id: coordinates?.id } : {}),
                "x": coordinates?.x,
                "y": coordinates?.y,
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
                    ...(selectExistingLocations ? { id: groupAdmin?.location?.id } : {}),
                    "x": groupAdmin?.location?.x,
                    "y": groupAdmin?.location?.y,
                    "z": groupAdmin?.location?.z,
                    "name": groupAdmin?.location?.name
                },
                "weight": groupAdmin?.weight,
                "nationality": groupAdmin?.nationality
            },
            "editableByAdmin": adminCanEdit

        }


        if (isNewGroup) {
            await axiosInstance.post('api/study-groups', requestData)
                .catch(() => {onSendError()})

        } else {
            await axiosInstance.put(`api/study-groups/${chosenObject?.id}`, requestData)
                .catch(() => {onSendError()})
        }

        setSelectExistingCoordinates(false)
        setSelectExistingAdmins(false)
        setSelectExistingLocations(false)
        setErrors((prevErrors) => ({ ...prevErrors,
            numberError: undefined,
            stringError: undefined,
            studentsCountError: undefined,
            expelledStudentsError: undefined,
            transferredStudentsError: undefined,
            shouldBeExpelledError: undefined
        }));
        onModalCLose()
    }



    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newName = event.target.value
        setName(newName);

        if (newName.trim().length < 1) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                stringError: "Name can't be empty!",
            }));
        } else {
            setErrors((prevErrors) => ({ ...prevErrors, stringError: undefined }));
        }
    };

    const handleCoordinatesChange = (field: keyof Coordinates, value: number) => {
        // @ts-ignore
        setCoordinates((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleAdminChoosing = (event: SelectChangeEvent) => {
        setGroupAdmin(existingAdmins.find(a => a.id === Number(event.target.value)))
    }


    const handleCoordinatesChoosing = (event: SelectChangeEvent) => {
        setCoordinates(existingCoordinates.find(pair => pair.id === Number(event.target.value)))
    }


    const handleStudentsCountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setStudentsCount(Number(event.target.value));

        if (Number(event.target.value) <= 0 || parseInt(event.target.value) !== Number(event.target.value)) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                studentsCountError: "Only positive integer numbers!",
            }));
        } else {
            setErrors((prevErrors) => ({ ...prevErrors, studentsCountError: undefined }));
        }
    };

    const handleExpelledStudentsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (Number(event.target.value) <= 0 || parseInt(event.target.value) !== Number(event.target.value)) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                expelledStudentsError: "Only positive integer numbers!",
            }));
        } else {
            setErrors((prevErrors) => ({ ...prevErrors, expelledStudentsError: undefined }));
        }
        setExpelledStudents(Number(event.target.value));
    };

    const handleTransferredStudentsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTransferredStudents(Number(event.target.value));
        if (Number(event.target.value) <= 0 || parseInt(event.target.value) !== Number(event.target.value)) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                transferredStudentsError: "Only positive integer numbers!",
            }));
        } else {
            setErrors((prevErrors) => ({ ...prevErrors, transferredStudentsError: undefined }));
        }

    };

    const handleFormOfEducationChange = (event: SelectChangeEvent) => {
        setFormOfEducation(event.target.value as FormOfEducation);
    };

    const handleShouldBeExpelledChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setShouldBeExpelled(Number(event.target.value));
        if (Number(event.target.value) <= 0 || parseInt(event.target.value) !== Number(event.target.value)) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                shouldBeExpelledError: "Only positive integer numbers!",
            }));
        } else {
            setErrors((prevErrors) => ({ ...prevErrors, shouldBeExpelledError: undefined }));
        }
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

        if (field === 'weight') {
            if (Number(value) <= 0) {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    numberError: "Value should be positive!",
                }));
            } else {
                setErrors((prevErrors) => ({ ...prevErrors, numberError: undefined }));
            }
        }
    };

    const handleGroupAdminLocationChange = (field: keyof Location, value: number | string) => {
        // @ts-ignore
        setGroupAdmin((prev) => ({
            ...prev,
            location: {
                ...prev?.location,
                [field]: value,
            },
        }));
    };

    const handleAdminCanEditChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAdminCanEdit(event.target.checked)
    }

    return (
        <Dialog open={modalOpen} onClose={handleClose} sx={{ '& .MuiDialog-paper': { width: '600px', maxWidth: 'none' } }}>
            {!isNewGroup && <DialogTitle>Edit group {chosenObject?.name} {readonlyForCurrentUser ? '(readonly access)' : ''}</DialogTitle>}
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
                        required
                        defaultValue={isNewGroup ? undefined : chosenObject?.name}
                        onChange={handleNameChange}
                        error={!!errors.stringError}
                        helperText={errors.stringError}
                        disabled={readonlyForCurrentUser}
                        sx={{marginTop: '5px'}}
                    ></TextField>

                    <Box sx={{display: 'flex', flexDirection: 'column'}}>
                        <Typography sx={{marginBottom: '10px'}}>
                            Coordinates
                        </Typography>

                        <Stack direction="row" spacing={1} sx={{ alignItems: 'center', marginBottom: '20px' }}>
                            <Typography>Create new coordinates</Typography>
                            <Switch
                                defaultValue={'false'}
                                checked={selectExistingCoordinates}
                                onChange={(e) => setSelectExistingCoordinates(e.target.checked)}
                                inputProps={{ 'aria-label': 'controlled' }}
                                disabled={readonlyForCurrentUser}
                            />
                            <Typography>Select existing coordinates</Typography>
                        </Stack>

                        {selectExistingCoordinates &&
                        <Select
                            defaultValue=""
                            variant="standard"
                            onChange={handleCoordinatesChoosing}
                            disabled={readonlyForCurrentUser}
                            sx={{marginBottom: '20px'}}
                            required
                        >
                            {existingCoordinates.map((coordinatesPair, index) => (
                                <MenuItem value={coordinatesPair.id} key={index}>
                                    ({coordinatesPair.x}, {coordinatesPair.y})
                                </MenuItem>
                            ))}
                        </Select>
                        }

                        {!selectExistingCoordinates &&
                                <FormControl>
                                    <Box sx={{display: 'flex', flexDirection: 'row', gap: '5px'}}>
                                    <TextField
                                        label="X"
                                        type="number"
                                        defaultValue={isNewGroup ? undefined : chosenObject?.coordinates.x}
                                        sx={{marginRight: '5px'}}
                                        onChange={(e) => handleCoordinatesChange('x', Number(e.target.value))}
                                        required
                                        disabled={readonlyForCurrentUser}
                                    />

                                    <TextField
                                        label="Y"
                                        type="number"
                                        defaultValue={isNewGroup ? undefined : chosenObject?.coordinates.y}
                                        onChange={(e) => handleCoordinatesChange('y', Number(e.target.value))}
                                        required
                                        disabled={readonlyForCurrentUser}
                                    ></TextField>
                                    </Box>
                                </FormControl>
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
                        required
                        defaultValue={isNewGroup ? undefined : chosenObject?.studentsCount}
                        onChange={handleStudentsCountChange}
                        error={!!errors.studentsCountError}
                        helperText={errors.studentsCountError}
                        inputProps={{
                            min: 1,
                            step: 1,
                            pattern: "^[1-9][0-9]*$", // Только положительные целые числа
                        }}
                        disabled={readonlyForCurrentUser}
                    ></TextField>

                    <TextField
                        label="Expelled students"
                        type="number"
                        required
                        defaultValue={isNewGroup ? undefined : chosenObject?.expelledStudents}
                        onChange={handleExpelledStudentsChange}
                        error={!!errors.expelledStudentsError}
                        helperText={errors.expelledStudentsError}
                        inputProps={{
                            min: 1,
                            step: 1,
                            pattern: "^[1-9][0-9]*$", // Только положительные целые числа
                        }}
                        disabled={readonlyForCurrentUser}
                    ></TextField>

                    <TextField
                        label="Transferred students"
                        type="number"
                        required
                        defaultValue={isNewGroup ? undefined : chosenObject?.transferredStudents}
                        onChange={handleTransferredStudentsChange}
                        error={!!errors.transferredStudentsError}
                        helperText={errors.transferredStudentsError}
                        inputProps={{
                            min: 1,
                            step: 1,
                            pattern: "^[1-9][0-9]*$", // Только положительные целые числа
                        }}
                        disabled={readonlyForCurrentUser}
                    />

                        <InputLabel>Form of education</InputLabel>
                        <Select
                            defaultValue={isNewGroup ? undefined : chosenObject?.formOfEducation}
                            label="Form of education"
                            variant="standard"
                            required
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
                        required
                        defaultValue={isNewGroup ? undefined : chosenObject?.shouldBeExpelled}
                        onChange={handleShouldBeExpelledChange}
                        error={!!errors.shouldBeExpelledError}
                        helperText={errors.shouldBeExpelledError}
                        disabled={readonlyForCurrentUser}
                    ></TextField>

                    <InputLabel>Semester</InputLabel>
                    <Select
                        defaultValue={isNewGroup ? undefined : chosenObject?.semesterEnum}
                        label="Semester"
                        required
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

                    <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                        <Typography>Create new group admin</Typography>
                        <Switch
                            defaultValue={'false'}
                            checked={selectExistingAdmins}
                            onChange={(e) => setSelectExistingAdmins(e.target.checked)}
                            inputProps={{ 'aria-label': 'controlled' }}
                            disabled={readonlyForCurrentUser}
                        />
                        <Typography>Select existing admin</Typography>
                    </Stack>

                    {selectExistingAdmins &&
                        <Select
                        defaultValue=""
                        variant="standard"
                        required
                        onChange={handleAdminChoosing}
                        disabled={readonlyForCurrentUser}
                        sx={{marginBottom: '20px'}}
                    >
                        {existingAdmins.map((admin, index) => (
                            <MenuItem value={admin.id} key={index}>
                                {admin.name}
                            </MenuItem>
                        ))}
                    </Select>
                    }

                    {!selectExistingAdmins &&
                        <Box className="form-box-container">
                            <Typography sx={{marginBottom: '10px'}}>Group admin</Typography>
                            <TextField
                                label="Name"
                                required
                                defaultValue={isNewGroup ? undefined : chosenObject?.groupAdmin.name}
                                onChange={(e) => handleGroupAdminChange('name', e.target.value)}
                                disabled={readonlyForCurrentUser}
                            ></TextField>

                            <InputLabel>Eye color</InputLabel>
                            <Select
                                defaultValue={isNewGroup ? undefined : chosenObject?.groupAdmin.eyeColor}
                                label="Eye color"
                                required
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
                                required
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
                                    <FormControl>
                                        <Stack direction="column" spacing={2} sx={{ marginBottom: '20px' }}>
                                            <TextField
                                                label="X"
                                                type="number"
                                                required
                                                defaultValue={isNewGroup ? undefined : chosenObject?.groupAdmin.location.x}
                                                onChange={(e) => handleGroupAdminLocationChange('x', Number(e.target.value))}
                                                disabled={readonlyForCurrentUser}
                                            ></TextField>

                                            <TextField
                                                label="Y"
                                                type="number"
                                                required
                                                defaultValue={isNewGroup ? undefined : chosenObject?.groupAdmin.location.y}
                                                onChange={(e) => handleGroupAdminLocationChange('y', Number(e.target.value))}
                                                disabled={readonlyForCurrentUser}
                                            ></TextField>

                                            <TextField
                                                label="Z"
                                                type="number"
                                                required
                                                defaultValue={isNewGroup ? undefined : chosenObject?.groupAdmin.location.z}
                                                onChange={(e) => handleGroupAdminLocationChange('z', Number(e.target.value))}
                                                disabled={readonlyForCurrentUser}
                                            ></TextField>

                                            <TextField
                                                label="Name"
                                                required
                                                defaultValue={isNewGroup ? undefined : chosenObject?.groupAdmin.location.name}
                                                onChange={(e) => handleGroupAdminLocationChange('name', e.target.value)}
                                                disabled={readonlyForCurrentUser}
                                            ></TextField>
                                        </Stack>
                                    </FormControl>

                            </Box>

                            <InputLabel>Nationality</InputLabel>
                            <Select
                                defaultValue={isNewGroup ? undefined : chosenObject?.groupAdmin.nationality}
                                label="Nationality"
                                required
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
                                required
                                type="number"
                                defaultValue={isNewGroup ? undefined : chosenObject?.groupAdmin.weight}
                                onChange={(e) => handleGroupAdminChange('weight', Number(e.target.value))}
                                error={!!errors.numberError}
                                helperText={errors.numberError}
                                inputProps={{
                                    min: 1,
                                }}
                                disabled={readonlyForCurrentUser}
                            ></TextField>
                        </Box>
                    }


                    <FormControlLabel control={
                        <Switch
                            defaultChecked={isNewGroup ? false : chosenObject?.adminCanEdit}
                            onChange={handleAdminCanEditChange}
                            disabled={readonlyForCurrentUser}
                        />
                    } label="Item can be edited by admins" />


                    <Box sx={{display: "flex", justifyContent: "space-between"}}>
                        <Button onClick={handleClose} color="error" variant="outlined">
                            Cancel
                        </Button>
                        <Button
                            color="primary"
                            variant="contained"
                            type="submit"
                            disabled={readonlyForCurrentUser ||
                                !!errors.stringError ||
                                !!errors.numberError ||
                                !!errors.shouldBeExpelledError ||
                        !!errors.studentsCountError ||
                        !!errors.expelledStudentsError ||
                        !!errors.transferredStudentsError}>
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