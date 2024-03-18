import Banner from "../components/Banner/Banner";
import Textbox from "../components/Textbox/Textbox";
import PageHeader from "../components/PageHeader/PageHeader";
import Button from "../components/Button/Button";
import Error from "../components/Error/Error";
import { invoke } from "@tauri-apps/api/tauri";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Login() {
    const [ username, setUsername ] = useState<string>("");
    const [ password, setPassword ] = useState<string>("");
    const [ error, setError ] = useState<boolean>(false);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);

    const navigate = useNavigate();
 

    const handleUsernameChange = (text: string) => {
        setUsername(text);
    }

    const handlePasswordChange = (text: string) => {
        setPassword(text);
    }

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (error) setError(false);

        try {
            const response = await invoke('validate_login', { username, password });
            const { user_id } = response as { user_id: number | null };

            if (user_id) {
                navigate("/Home", { state: { userId: user_id } });
            } else {
                setError(true);
                setIsSubmitting(false);
            }
        } catch (error) {
            console.error(error);
            setError(true);
            setIsSubmitting(false);
        }
    }


    return (
        <>
            <Banner />
            <PageHeader text="Log In" />
            <form onSubmit={handleSubmit}>
                <Textbox text="Enter your username..." onBlur={handleUsernameChange} />
                <Textbox text="Enter your password..." onBlur={handlePasswordChange} isPassword />
                <Button type="submit" buttonText="Log In" disabled={isSubmitting} />
            </form>
            { error ?
                <Error text="There was an error validating with the given credentials!" />
                : <></>
            }
        </>
        );
}
