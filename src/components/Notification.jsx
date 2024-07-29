import React from "react";

const Notification = ( { notifObjet }) => {
    const [message, type] = notifObjet
    if (message === null) {
        return null
    }

    return (
        <div className={type}>
            {message}
        </div>
    )
}

export default Notification