import Banner from "../components/Banner/Banner";
import Textbox from "../components/Textbox/Textbox";
import PageHeader from "../components/PageHeader/PageHeader";
import Button from "../components/Button/Button";
import Error from "../components/Error/Error";
import { invoke } from "@tauri-apps/api/tauri";
import { Link, useNavigate } from "react-router-dom";
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
        setIsSubmitting(true);

        try {
            const response: any = await invoke("validate_login", { username, password });
            const userId = response.user_id as number | undefined;
            console.log(userId);

            if (userId) {
                // Update user status to "ONLINE" on successful login
                await invoke("change_status", { userId, status: "ONLINE" });

                const hasAmi: boolean = await invoke("check_ami", { userId });
                console.log(hasAmi);

                if (!hasAmi) {
                    navigate("/AmiCreation", { state: { userId } });
                } else {
                    navigate("/Home", { state: { userId } });
                }
            } else {
                setError(true);
            }
        } catch (error) {
            console.error(error);
            setError(true);
        }

        setIsSubmitting(false);
    };


    return (
        <>
            <Banner />
            <PageHeader text="Log In" />
            <form onSubmit={handleSubmit}>
            <Textbox text="Enter your username..." onBlur={handleUsernameChange} />
            <Textbox text="Enter your password..." onBlur={handlePasswordChange} isPassword />
            <Button type="submit" buttonText="Log In" disabled={isSubmitting} />
            </form>
            {error && <Error text="There was an error validating with the given credentials!" />}
            <p>Want to join the party?</p>
            <Link to="/Registration">Register Now</Link>
        </>
    );
}
