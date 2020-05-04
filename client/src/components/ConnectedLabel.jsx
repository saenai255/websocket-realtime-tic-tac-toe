import React from 'react';

const ConnectedLabel = props => (
    <>
        {
            props.connected ?
                <span className="badge badge-success">You are connected</span> : <span className="badge badge-danger">You are not connected</span>
        }
    </>
);

export default ConnectedLabel;