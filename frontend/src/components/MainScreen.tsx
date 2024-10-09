import React from "react";
import CollectionObjectsDataGrid from "./ProTable.tsx";
import {AppBar, Box, IconButton, Toolbar, Typography} from "@mui/material";
import {ThemeProvider, createTheme} from '@mui/material/styles';
import LogoutIcon from '@mui/icons-material/Logout';
import {useNavigate} from "react-router-dom";

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});

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

                <CollectionObjectsDataGrid/>

            </ThemeProvider>
        </Box>


    );
}

export default MainScreen