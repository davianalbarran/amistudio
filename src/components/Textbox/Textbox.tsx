import { useState } from 'react';
import './Textbox.css';

export default function Textbox(props: { isPassword?: boolean, text: string, onBlur: (text: string) => void } ) {
    const [ text, setText ] = useState<string>("");

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setText(event.target.value);
    }

    const handleBlur = () => {
        props.onBlur(text);
    }
    
    return (
    <div className='textbox-container'>
        <input 
            className='textbox-input' 
            value={text} 
            placeholder={props.text} 
            onChange={handleChange}
            onBlur={handleBlur}
            type={props.isPassword ? "password" : "text"}
        >
        </input>
    </div>
    );
}
