import React, {useState} from "react";
import {Box, Button, TextField, Typography} from "@mui/material";
import { useNavigate } from 'react-router-dom';
import '../../styles/FormStyles.css'


const LoginForm: React.FC = () => {
    const [username, setUsername] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [error] = useState<string | null>(null)
    const navigate = useNavigate();

    const handleLogin = async (event: React.FormEvent) => {
        event.preventDefault()

        navigate('/main-screen')
    }

    return (
        <div className="form-container">
            <Box
                className="base-form"
                component="form"
                onSubmit={handleLogin}
                sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '300px'}}
            >
                <Typography variant="h5">Авторизация</Typography>
                <TextField
                    label="Имя пользователя"
                    variant="outlined"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    sx={{
                        '& label': {
                            color: '#A0AAB4',
                        },
                        '& .MuiInputBase-input': {
                            color: '#A0AAB4',
                        },
                    }}
                />
                <TextField
                    label="Пароль"
                    variant="outlined"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    sx={{
                        '& label': {
                            color: '#A0AAB4',
                        },
                        '& .MuiInputBase-input': {
                            color: '#A0AAB4',
                        },
                    }}
                />
                {error && <Typography color="error">{error}</Typography>}

                <Button variant="contained" type="submit">Войти</Button>

                <p style={{margin: 0}}>Еще нет аккаунта? <a className="redirect-link" onClick={() => navigate('/register')}>Зарегистрироваться</a></p>

            </Box>
        </div>

    )
}

export default LoginForm;