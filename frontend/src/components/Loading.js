import React from "react";

export function Loading() {
    const pageStyle = {
        position: "fixed",
        zIndex: 2,
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(255, 255, 255, 0.5)",
    };

    const spinnerStyle = {
        position: "absolute",
        zIndex: 3,
        top: "50%",
        left: "50%",
        width: "100px",
        height: "50px",
        marginLeft: "-50px",
        marginTop: " -25px",
        textAlign: "center",
    };

    return (
        <div style={pageStyle}>
            <div style={spinnerStyle}>
                <div className="spinner-border" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
        </div>
    );
}
