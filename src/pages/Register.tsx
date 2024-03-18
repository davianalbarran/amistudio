import React, { useState } from 'react';
import { invoke } from '@tauri-apps/api/tauri';
import Banner from '../components/Banner/Banner';
import PageHeader from '../components/PageHeader/PageHeader';
import Textbox from '../components/Textbox/Textbox';
import Button from '../components/Button/Button';
import Error from '../components/Error/Error';
import { useNavigate } from 'react-router-dom';

const Registration: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);

    const handleEmailChange = (email: string) => {
        setEmail(email);
    };

    const handleUsernameChange = (username: string) => {
        setUsername(username);
    };

    const handlePasswordChange = (password: string) => {
        setPassword(password);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            await invoke('register_user', { email, username, password });
            navigate('/');
        } catch (error) {
            console.error('Error registering user:', error);
            setError('An error occurred while registering. Please try again.');
        }

        setIsSubmitting(false);
    };

    return (
        <>
            <Banner />
            <PageHeader text="Register An Account" />
            <form onSubmit={handleSubmit}>
            <Textbox text="Email..." onBlur={handleEmailChange} />
            <Textbox text="Username..." onBlur={handleUsernameChange} />
            <Textbox text="Password..." onBlur={handlePasswordChange} isPassword />
            <Button type="submit" buttonText="Register" disabled={isSubmitting} />
            </form>
            {error && <Error text={error} />}
        </>
    );
};

export default Registration;
