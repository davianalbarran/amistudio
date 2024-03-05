import './PageHeader.css';

export default function PageHeader(props: {text: string}) {
    return (
        <div className="header-container">
            <h3 className="header-text">{props.text}</h3>
        </div>
    );
}
