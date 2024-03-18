import React, { useState } from 'react';
import Banner from '../components/Banner/Banner';
import PageHeader from '../components/PageHeader/PageHeader';
import Textbox from '../components/Textbox/Textbox';
import Button from '../components/Button/Button';
import Error from '../components/Error/Error';

const Registration: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleEmailChange = (email: string) => {
    setEmail(email);
  };

  const handleUsernameChange = (username: string) => {
    setUsername(username);
  };

  const handlePasswordChange = (password: string) => {
    setPassword(password);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Handle registration form submission
  };

  return (
    <>
      <Banner />
      <PageHeader text="Register An Account" />
      <form onSubmit={handleSubmit}>
        <Textbox text="Email..." onBlur={handleEmailChange} />
        <Textbox text="Username..." onBlur={handleUsernameChange} />
        <Textbox text="Password..." onBlur={handlePasswordChange} isPassword />
        <Button type="submit" buttonText="Register" />
      </form>
      {error && <Error text={error} />}
    </>
  );
};

export default Registration;
