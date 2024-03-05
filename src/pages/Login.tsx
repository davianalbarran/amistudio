import { useState } from "react";
import Banner from "../components/Banner/Banner";
import Textbox from "../components/Textbox/Textbox";
import PageHeader from "../components/PageHeader/PageHeader";
import Button from "../components/Button/Button";

export default function Login() {
    const [ username, setUsername ] = useState<string>("");
    const [ password, setPassword ] = useState<string>("");

    const handleUsernameChange = (text: string) => {
        setUsername(text);
    }

    const handlePasswordChange = (text: string) => {
        setPassword(text);
    }

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        console.log(username, !!password);
    }

    return (
        <>
            <Banner />
            <PageHeader text="Log In" />
            <form onSubmit={handleSubmit}>
                <Textbox text="Enter your username..." onBlur={handleUsernameChange} />
                <Textbox text="Enter your password..." onBlur={handlePasswordChange} isPassword />
                <Button type="submit" buttonText="Log In" />
            </form>
        </>
        );
}
