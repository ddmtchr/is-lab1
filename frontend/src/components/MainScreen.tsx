import React from "react";
import {AppBar, Box, IconButton, Toolbar, Typography} from "@mui/material";
import LogoutIcon from '@mui/icons-material/Logout';
import {useNavigate} from "react-router-dom";

const MainScreen: React.FC = () => {
    const navigate = useNavigate()
    return (
        <Box sx={{ flexGrow: 1, minWidth: '100vw' }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
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
        </Box>
    )
}

export default MainScreen