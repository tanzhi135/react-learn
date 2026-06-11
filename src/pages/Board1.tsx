import { useState } from "react";

/**
 * Square 组件的 props 类型
 * @property value - 方格中显示的内容（"X"、"O" 或 null）
 * @property onSquareClick - 方格点击时的回调函数
 */
type SquareProps = {
  value: string | null;
  onSquareClick: () => void;
};

/**
 * Square（方格）组件
 * 渲染一个 3x3 棋盘中的单个方格按钮
 */
function Square({ onSquareClick, value }: SquareProps) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

/**
 * 计算当前棋盘上的胜负结果
 * @param squares - 长度为9的数组，表示3x3棋盘的所有格子（索引0-8）
 * @returns 获胜方 "X" 或 "O"，若无获胜方则返回 null
 *
 * 判断逻辑：遍历所有可能获胜的连线组合（横、竖、斜共8条），
 * 如果某条线上的三个格子值相同且不为 null，则该值对应的玩家获胜。
 */
function calculateWinner(squares: Array<string | null>): string | null {
  // 所有可能获胜的连线组合（每个子数组为一条线上的3个格子索引）
  const lines: Array<[number, number, number]> = [
    // 横向
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    // 纵向
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    // 斜向
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]; // 返回获胜方 "X" 或 "O"
    }
  }
  return null; // 无获胜方
}

/**
 * Board1（棋盘展示）组件
 * 负责渲染 3x3 的井字棋棋盘界面
 *
 * @param handleClick - 点击方格时的处理函数（参数为方格位置 1-9，基于1的索引）
 * @param status - 当前游戏状态文本（如 "Next player: X" 或 "Winner: O"）
 * @param squares - 棋盘数据，长度为9的数组，每项为 "X"、"O" 或 null
 */
function Board1({
  handleClick,
  status,
  squares,
}: {
  handleClick: (position: number) => void;
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

/**
 * Game（游戏主容器）组件
 * 井字棋游戏的顶层组件，管理游戏状态、历史记录和逻辑
 *
 * 功能特性：
 * - 支持双方交替落子（X 先手）
 * - 自动判断胜负
 * - 支持悔棋（回退到历史任意一步）
 * - 支持重新开始游戏
 */
export default function Game() {
  // 当前棋盘状态（长度为9的数组，对应9个格子）
  const [squares, setSquares] = useState<Array<string | null>>(
    Array(9).fill(null)
  );

  // 历史记录：记录每一步之后的完整棋盘状态
  const [history, setHistory] = useState<Array<Array<string | null>>>([
    Array(9).fill(null),
  ]);

  // 当前所在的步数索引（0 = 初始状态，1 = 第一步之后，依此类推）
  const [currentMove, setCurrentMove] = useState<number>(0);

  // 根据步数奇偶判断当前该谁落子（偶数步 -> X，奇数步 -> O）
  const xIsNext: boolean = currentMove % 2 === 0;

  /**
   * 跳转到指定历史步数
   * @param move - 目标步数索引
   *
   * 当跳转到第 0 步时，同时清空历史记录（重新开始游戏）
   */
  function jumpTo(move: number): void {
    setSquares(history[move]);
    setCurrentMove(move);

    if (move === 0) {
      setHistory([Array(9).fill(null)]);
      setSquares(Array(9).fill(null));
    }
  }

  /**
   * 生成历史操作按钮列表
   * 每个按钮对应游戏的一步，点击可跳转到该步状态
   */
  const moves = history.map((_, move) => {
    const description = move ? `Go to move #${move}` : "Go to game start";
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  // 计算当前是否有获胜方
  const winner: string | null = calculateWinner(squares);

  // 根据游戏状态生成状态文本
  const status: string = winner
    ? `Winner: ${winner}`
    : `Next player: ${xIsNext ? "X" : "O"}`;

  /**
   * 处理方格点击事件
   * @param position - 点击的方格位置（1-9，基于1的索引，对应 squares 数组索引 position - 1）
   *
   * 处理逻辑：
   * 1. 如果该格已被占用或已有获胜方，则忽略本次点击
   * 2. 在当前棋盘副本上标记落子
   * 3. 更新棋盘状态和步数
   * 4. 截断当前位置之后的历史记录，追加新状态
   */
  function handleClick(position: number): void {
    if (squares[position - 1] !== null || winner) return;

    const nextSquares = squares.slice();
    nextSquares[position - 1] = xIsNext ? "X" : "O";

    setSquares(nextSquares);

    // 截断当前位置之后的历史，追加新的棋盘状态
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(currentMove + 1);
  }

  return (
    <>
      <div className="game">
        <div className="game-board">
          <Board1 handleClick={handleClick} status={status} squares={squares} />
        </div>
        <div className="game-info">
          <ol>{moves}</ol>
        </div>
      </div>

      {/* React 学习笔记：以下是 React 核心概念的简要总结 */}
      <div>
        <div>
        react
        <p>
          1.react使用jsx语法，jsx是js的语法扩展，jsx允许我们在js代码中直接写html标签，jsx会被编译成js代码，jsx的本质就是js对象，所以jsx可以嵌套，可以使用表达式，可以使用条件渲染，可以使用循环渲染，可以使用函数组件，可以使用类组件，可以使用hooks等等。
        </p>
        <p>
          2.react组件分为函数组件和类组件，函数组件是一个普通的js函数，函数组件可以使用hooks，函数组件没有生命周期，函数组件没有this，函数组件没有state，函数组件没有props，函数组件没有ref，函数组件没有context，函数组件没有error
          boundary，函数组件没有shouldComponentUpdate，函数组件没有componentDidMount，函数组件没有componentDidUpdate，函数组件没有componentWillUnmount，函数组件没有getDerivedStateFromProps，函数组件没有getSnapshotBeforeUpdate，函数组件没有componentDidCatch等等。
        </p>
        <p>
          3.react组件的props是只读的，props是父组件传递给子组件的数据，props是不可变的，props是单向数据流的，props是函数组件的参数，props是类组件的属性，props是组件之间通信的方式，props可以是任意类型的数据，可以是字符串，可以是数字，可以是布尔值，可以是对象，可以是数组，可以是函数等等。
        </p>
        <p>
          4.react组件的state是可变的，state是组件内部维护的数据，state是组件的私有数据，state是组件的状态，state是组件的生命周期的一部分，state是组件的更新的一部分，state是组件的渲染的一部分，state可以是任意类型的数据，可以是字符串，可以是数字，可以是布尔值，可以是对象，可以是数组等等。
        </p>
        <p>
          5.react的useState是一个hook，useState是一个函数，useState接受一个初始值，useState返回一个数组，数组的第一个元素是当前的状态值，数组的第二个元素是一个函数，用于更新状态值，调用这个函数会触发组件的重新渲染，useState可以接受任意类型的数据，可以是字符串，可以是数字，可以是布尔值，可以是对象，可以是数组等等。
        </p>
        <p>
          6.使用数组作为useState的值时，通常使用filter方法来删除数组中的元素，使用map方法来更新数组中的元素，使用concat方法来添加数组中的元素，使用slice方法来截取数组中的元素等等。
        </p>
        <p>
          7.使用对象作为useState的值时，通常使用展开运算符或者Object.assign来创建一个新的对象，使用点语法或者方括号语法来访问对象的属性，使用点语法或者方括号语法来更新对象的属性等等。
        </p>
        <p>
          8.在react中，对象如果嵌套层数过多，可能会导致性能问题，因为react需要比较前后两次的状态值来决定是否需要重新渲染组件，如果状态值是一个复杂的对象或者数组，react需要进行深比较，这可能会导致性能问题。为了避免这个问题，可以使用useMemo或者useCallback来缓存计算结果，或者使用immutable数据结构来避免直接修改状态值，或者想方法将对象数据扁平化（如将所有节点数据扁平化，使所有真实数据只在第一层，使用id进行嵌套追踪）。
        </p>
        <p>
          9.使用context在组件中传递参数，在顶层定义后，所有子组件均可直接使用，且可多次传递参数，子组件会自动引用最近一层父组件定义的值
        </p>
        <p>
          10.在react中reducer是一个整合状态逻辑的外部函数。通常在将对同一个数据进行多次不同操作时，会将这些操作整合进reducer函数中，定义一个dispatch，传参为type以及其它任何需要使用的参数
        </p>
      </div>
      </div>
    </>
  );
}