import React, { useState, useEffect } from 'react';
import ConnectedLabel from './ConnectedLabel';
import PlayerList from './PlayerList';
import { Game, MessageTypes } from '../service/game';
import RoomList from './RoomList';
import Board from './Board';

const GameRoot = () => {
    const [connected, setConnected] = useState(false);
    const [players, setPlayers] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [player, setPlayer] = useState(null);
    const [game] = useState(new Game());

    useEffect(() => {
        game.connect();

        game.socket.onclose = game.socket.onerror = () => {
            setConnected(false);
        }

        game.socket.onopen = () => {
            setConnected(true);
        }

        game.register(MessageTypes.UPDATE_CONNECTED_PLAYERS, players => {
            setPlayers(players);
        });

        game.register(MessageTypes.CONNECTED, player => {
            setPlayer(player);
        });

        game.register(MessageTypes.UPDATE_OPEN_ROOMS, rooms => {
            setRooms(rooms);
        });

        game.register(MessageTypes.CREATE_ROOM_FAIL, () => {
            alert('There are already enough rooms!');
        })

        game.register(MessageTypes.ANNOUNCE_WINNER, player => {
            alert(`Winner is ${player.name || 'Nameless '} (ID: ${player.id})`);
        })
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        if (player && players.length > 0) {
            const self = players.find(other => other.id === player.id);
            setPlayer(self);
        }
    }, [player, players])

    const onSetName = name => {
        game.setPlayerName(name);
    }

    const onCreateRoom = () => {
        game.createRoom();
    }

    const onJoinRoom = id => {
        game.joinRoom(id);
    }

    const onLeaveRoom = () => {
        game.leaveRoom();
    }

    const onStartGame = () => {
        console.log('start')
        game.startGame();
    }

    const onSetMove = (x, y) => {
        game.setMove(x, y);
    }

    const renderBoard = () => {
        const room = rooms.find(room => player?.joinedRoom === room.id);
        if (!room) {
            return;
        }

        console.log(room)
        return <Board
            room={room}
            player={player}
            onStartGame={onStartGame}
            onSetMove={onSetMove}
        />;
    }

    return (
        <>
            <div className="row mt-1">
                <div className="col-md-6">
                    <ConnectedLabel connected={connected} />
                </div>
            </div>
            <div className="row mt-3">
                <div className="col-md-6">
                    <PlayerList players={players} self={player} onSetName={onSetName} />
                </div>
                <div className="col-md-6">
                    <RoomList
                        rooms={rooms}
                        onCreateRoom={onCreateRoom}
                        onJoinRoom={onJoinRoom}
                        joinedRoom={player?.joinedRoom}
                        onLeaveRoom={onLeaveRoom}
                        canCreateRoom={players.length > rooms.length}
                    />
                </div>
            </div>

            {renderBoard()}
        </>
    )
};

export default GameRoot;