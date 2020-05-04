import React from 'react'

const PlayerList = ({ players, self, onSetName }) => {
    const setName = () => {
        onSetName(prompt('Your name:'))
    };

    return (
        <div>
            <div className="row">
                <div className="col-6">
                    <h6>Online Players:</h6>
                </div>
                <div className="col-6 text-right">
                    <h6 className="btn-link" style={{ cursor: 'pointer' }} onClick={setName}>Set Name</h6>
                </div>
            </div>
            <ul className="list-group">
                {players.map(player =>
                    <li key={player.id} className="list-group-item">
                        {player.name || 'Nameless One'} ( ID: {player.id} ) {player.id === self.id && <span className="badge badge-info">You</span>}
                    </li>)}
            </ul>
        </div>
    )
}

export default PlayerList;
