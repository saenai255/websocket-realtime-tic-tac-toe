import React from 'react'

const mapPlayerCount = room => {
    if (room.players.length === 0) {
        return 'Empty';
    }

    if (room.round === 0 || room.isGameOver) {
        return room.players.length + ' Waiting';
    }

    return room.players.length + ' Playing';
}

const mapToJoinOrLeaveRoom = (currentRoom, joinedRoomId, onJoinRoom, onLeaveRoom) => {
    const canJoinRoom = currentRoom.players.length < 2;

    const joinRoom = id => {
        if (canJoinRoom) {
            onJoinRoom(id);
        }
    }

    if (!joinedRoomId) {
        return <span className={'btn-link ' + (canJoinRoom ? '' : 'disabled')} style={{ cursor: 'pointer' }} onClick={() => joinRoom(currentRoom.id)}>Join Room</span>
    }

    if (currentRoom.id === joinedRoomId) {
        return <span className="btn-link" style={{ cursor: 'pointer' }} onClick={() => onLeaveRoom(currentRoom.id)}>Leave Room</span>
    }

    return '';
}

const RoomList = ({ rooms, onCreateRoom, onJoinRoom, joinedRoom, onLeaveRoom, canCreateRoom }) => {

    const createRoom = () => {
        if (canCreateRoom) {
            onCreateRoom();
        }
    };

    return (
        <div>
            <div className="row">
                <div className="col-7">
                    <h6>Available Rooms:</h6>
                </div>
                <div className="col-5 text-right">
                    <h6 className={'btn-link ' + (canCreateRoom ? '' : 'disabled')} style={{ cursor: 'pointer' }} onClick={createRoom}>Create Room</h6>
                </div>
            </div>
            <ul className="list-group">
                {rooms.map(room =>
                    <li key={room.id} className="list-group-item">
                        <div className="row">
                            <div className="col">Room {room.id} ( {mapPlayerCount(room)} )</div>
                            <div className="col text-right">
                                {mapToJoinOrLeaveRoom(room, joinedRoom, onJoinRoom, onLeaveRoom)}
                            </div>
                        </div>


                    </li>)}
            </ul>
        </div>
    )
}

export default RoomList;
