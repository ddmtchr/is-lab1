import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography} from "@mui/material";
import React from "react";
import {RowData} from "../../interfaces.ts";

interface ModalProps {
    modalOpen: boolean;
    onModalCLose: (open: boolean) => void;
    chosenObject?: RowData | undefined;
}


const ObjectControlModal: React.FC<ModalProps> = ({modalOpen, onModalCLose, chosenObject}) => {

    const handleClose = () => {
        onModalCLose(false)
    }

    return (
        <Dialog open={modalOpen} onClose={handleClose}>
            <DialogTitle>Редактировать объект {chosenObject?.name}</DialogTitle>
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
    )
}

export default ObjectControlModal;