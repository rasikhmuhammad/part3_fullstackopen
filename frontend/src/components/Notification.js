import "./Notification.css";

const Notification = ({message}) => {
    if(message === null) {
        return null
    }

    return (
        <div className="error-message">
            {message}
        </div>
    )
}

export default Notification;

