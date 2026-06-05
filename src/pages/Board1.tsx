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
export default function board1() {
  const [squares, setSquares] = useState<Array<string | null>>(
    Array(9).fill(null)
  );
  const [xIsNext, setXIsNext] = useState<boolean>(true);
  function handleClick(i: number) {
    if (squares[i] !== null) return;
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? "X" : "O";
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
  }
  return (
    <>
      <div className="board-row">
        <Square onSquareClick={() => handleClick(1)} value={squares[1]} />
        <Square onSquareClick={() => handleClick(2)} value={squares[2]} />
        <Square onSquareClick={() => handleClick(3)} value={squares[3]} />
      </div>
      <div className="board-row">
        <Square onSquareClick={() => handleClick(4)} value={squares[4]} />
        <Square onSquareClick={() => handleClick(5)} value={squares[5]} />
        <Square onSquareClick={() => handleClick(6)} value={squares[6]} />
      </div>
      <div className="board-row">
        <Square onSquareClick={() => handleClick(7)} value={squares[7]} />
        <Square onSquareClick={() => handleClick(8)} value={squares[8]} />
        <Square onSquareClick={() => handleClick(9)} value={squares[9]} />
      </div>
    </>
  );
}
