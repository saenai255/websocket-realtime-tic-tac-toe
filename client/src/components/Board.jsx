import React from 'react'
import './Board.css';

const Board = ({ room, player, onSetMove, onStartGame }) => {
    const canStart = (room.isGameOver || room.round === 0) && room.players.length === 2;
    const isMyTurn = room?.turn?.id === player?.id;

    const setMove = (x, y) => {
        if (!isMyTurn) {
            return;
        }

        if (room.board[x][y] !== 'NONE') {
            return;
        }

        onSetMove(x, y);
    }

    return (
        <div className="mt-3">
            <button className="btn btn-outline-primary mb-3" onClick={onStartGame} disabled={!canStart}>Start Game</button>

            <div className="row">
                <div className="col text-right">Turn:</div>
                <div className="col">{room.turn?.name || 'Random'}</div>
            </div>

            <div className="row">
                <div className="col text-right">Round:</div>
                <div className="col">{room.round}</div>
            </div>

            {room.board.map((row, i) => <div key={i} className="row mx-auto">
                {row.map((cell, j) => <div key={j} onClick={() => setMove(i, j)} className="col-4 board-cell">
                    <span className={cell === 'NONE' ? 'text-muted' : ''}>{cell === 'NONE' ? '?' : cell}</span>
                </div>)}
            </div>)}
        </div>
    );
};

export default Board;
