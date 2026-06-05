// 从 React 导入 useState Hook，用于在组件中管理状态
import { useState } from "react";

// Square 组件的 props 类型
type SquareProps = {
  value: string | null;
  onSquareClick: () => void;
};

// Square 组件负责渲染单个棋格按钮
function Square({ value, onSquareClick }: SquareProps) {
  // 渲染一个按钮，显示传递进来的 value，并在点击时触发 onSquareClick
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

// Board 组件负责维护棋盘状态并渲染 3x3 棋格布局
function Board({
  xIsNext,
  squares,
  onPlay,
}: {
  xIsNext: boolean;
  squares: Array<string | null>;
  onPlay: (nextSquares: Array<string | null>) => void;
}) {
  function handleClick(i: number) {
    // 若点击位置已经有棋子，则直接返回，不做任何更改
    if (squares[i] || calculateWinner(squares)) return;

    // 复制一个新数组，避免直接修改原 state 引用
    const nextSquares = squares.slice();

    // 判断当前是哪一方落子，并切换下一方
    if (xIsNext) {
      nextSquares[i] = "O";
    } else {
      nextSquares[i] = "X";
    }

    // 更新棋盘状态为新数组
    onPlay(nextSquares);
  }
  const winner = calculateWinner(squares);
  // 根据 winner 状态显示游戏结果
  let status;
  if (winner) {
    status = `Winner: ${winner}`;
  } else {
    status = `Next player: ${xIsNext ? "O" : "X"}`;
  }
  // 渲染棋盘布局，3 行 3 列，每个 Square 都绑定点击事件
  return (
    <>
      {" "}
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

function calculateWinner(squares: Array<string | null>): string | null {
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

export default function Game() {
  // const [xIsNext, setXIsNext] = useState<boolean>(true);
  const [history, setHistory] = useState<Array<Array<string | null>>>([
    Array(9).fill(null),
  ]);
  const [currentMove, setCurrentMove] = useState<number>(0);
   const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  function handlePlay(nextSquares: Array<string | null>) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }
  function jumpTo(nextMove: number) {
    setCurrentMove(nextMove);
  }
  const moves = history.map((squares, move) => {
    console.log("history move " + squares);
    let description;
    if (move > 0) {
      description = "Go to move #" + move;
    } else {
      description = "Go to game start";
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });
  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}
