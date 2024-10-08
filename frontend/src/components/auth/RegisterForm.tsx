import React, {useState} from "react";
import {Box, Button, TextField, Typography} from "@mui/material";
import '../../styles/FormStyles.css'
import {useNavigate} from "react-router-dom";

const RegisterForm: React.FC = () => {
    const [username, setUsername] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string }>({});
    const navigate = useNavigate()


    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newPassword = event.target.value;
        setPassword(newPassword);

        // Проверка длины пароля
        if (newPassword.length < 4) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                password: 'Пароль должен быть не менее 4 символов',
            }));
        } else {
            setErrors((prevErrors) => ({ ...prevErrors, password: undefined }));
        }

        // Проверка совпадения с подтверждением
        if (confirmPassword && newPassword !== confirmPassword) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                confirmPassword: 'Пароли не совпадают',
            }));
        } else {
            setErrors((prevErrors) => ({ ...prevErrors, confirmPassword: undefined }));
        }
    };

    const handleConfirmPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newConfirmPassword = event.target.value;
        setConfirmPassword(newConfirmPassword);

        // Проверка совпадения с паролем
        if (newConfirmPassword !== password) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                confirmPassword: 'Пароли не совпадают',
            }));
        } else {
            setErrors((prevErrors) => ({...prevErrors, confirmPassword: undefined}));
        }
    };

    const handleLogin = async (event: React.FormEvent) => {
        event.preventDefault()

        if (!errors.password && !errors.confirmPassword) {
            console.log('Form submitted successfully');
            // Логика для отправки данных
        }
    }

    return (
        <div className="form-container">
            <Box
                className="base-form"
                component="form"
                onSubmit={handleLogin}
                sx={{display: 'flex', flexDirection: 'column', gap: 2, width: '300px'}}
            >
                <Typography variant="h5">Регистрация</Typography>
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
                    onChange={handlePasswordChange}
                    error={!!errors.password}
                    helperText={errors.password}
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
                    label="Подтверждение пароля"
                    variant="outlined"
                    type="password"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword}
                    sx={{
                        '& label': {
                            color: '#A0AAB4',
                        },
                        '& .MuiInputBase-input': {
                            color: '#A0AAB4',
                        },
                    }}
                />
                <Button variant="contained" type="submit">Зарегистрироваться</Button>

                <p style={{margin: 0}}>Уже есть аккаунт? <a className="redirect-link"
                                                            onClick={() => navigate('/login')}>Войти</a></p>
            </Box>
        </div>

    )
}

export default RegisterForm;