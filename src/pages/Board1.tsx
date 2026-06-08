import { useState } from "react";
// Square 组件的 props 类型
type SquareProps = {
  value: string | null;
  onSquareClick: () => void;
};
function Square({ onSquareClick, value }: SquareProps) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}
function calculateWinner(squares: Array<string | null>) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
function Board1({
  handleClick,
  status,
  squares,
}: {
  handleClick: (i: number) => void;
  status: string;
  squares: Array<string | null>;
}) {
  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square onSquareClick={() => handleClick(1)} value={squares[0]} />
        <Square onSquareClick={() => handleClick(2)} value={squares[1]} />
        <Square onSquareClick={() => handleClick(3)} value={squares[2]} />
      </div>
      <div className="board-row">
        <Square onSquareClick={() => handleClick(4)} value={squares[3]} />
        <Square onSquareClick={() => handleClick(5)} value={squares[4]} />
        <Square onSquareClick={() => handleClick(6)} value={squares[5]} />
      </div>
      <div className="board-row">
        <Square onSquareClick={() => handleClick(7)} value={squares[6]} />
        <Square onSquareClick={() => handleClick(8)} value={squares[7]} />
        <Square onSquareClick={() => handleClick(9)} value={squares[8]} />
      </div>
    </>
  );
}

export default function Game() {
  const [squares, setSquares] = useState<Array<string | null>>(
    Array(9).fill(null),
  );
  const [history, setHistory] = useState<Array<Array<string | null>>>([
    Array(9).fill(null),
  ]);
  const [currentMove, setCurrentMove] = useState<number>(0);
  const xIsNext = currentMove % 2 === 0;
  function jumpTo(move: number) {
    setSquares(history[move]);
    // setXIsNext(move % 2 === 0);
    setCurrentMove(move);
    if (move == 0) {
      setHistory([Array(9).fill(null)]);
      setSquares(Array(9).fill(null));
      // setXIsNext(false);
    }
  }
  const moves = history.map((_, move) => {
    const description = move ? `Go to move #${move}` : "Go to game start";
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });
  const winner = calculateWinner(squares);
  const status = winner
    ? `Winner: ${winner}`
    : `Next player: ${xIsNext ? "X" : "O"}`;
  function handleClick(i: number) {
    if (squares[i - 1] !== null || winner) return;
    const nextSquares = squares.slice();
    nextSquares[i - 1] = xIsNext ? "X" : "O";
    setSquares(nextSquares);
    // setXIsNext(currentMove % 2 === 0);
    console.log("当前历史记录", history);
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    console.log("更新后的历史记录", nextHistory);
    setHistory(nextHistory);
    setCurrentMove(currentMove + 1);
  }
  return (
    <div className="game">
      <div className="game-board">
        <Board1 handleClick={handleClick} status={status} squares={squares} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}
