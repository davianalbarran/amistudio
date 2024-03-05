import './Button.css';

export default function Button(props: { buttonText: string, type: "submit" | "reset" | "button" | undefined }) {
    return (
        <button className="custom-button" type={props.type} >{ props.buttonText } </button>
    );
}
