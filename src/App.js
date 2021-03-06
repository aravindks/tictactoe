import logo from './logo.svg';
import './App.css';
import * as React from 'react'

function useLocalStorageState(
  key,
  defaultValue = '',
  {serialize= JSON.stringify, deserialize = JSON.parse} = {}
){
  const [state, setState] = React.useState(() =>{
    const valueInLocalStorage = window.localStorage.getItem(key);
    if(valueInLocalStorage){
      return deserialize(valueInLocalStorage);
    } else {
      return typeof defaultValue === 'function' ? defaultValue() : defaultValue
    }
  })

  const prevKeyRef = React.useRef(key);
  React.useEffect(() => {
    const prevKey = prevKeyRef.current;
    if(prevKey !== key){
      window.localStorage.removeItem(prevKey);
    }
    prevKeyRef.current = key;
    window.localStorage.setItem(key, serialize(state))
  }, [key, state, serialize])

  return [state, setState]
}

function App() {
  const [squares, setSquare] =  useLocalStorageState('squares', Array(9).fill(null),);

  React.useEffect(()=>{
    window.localStorage.setItem('squares', JSON.stringify(squares))
  },[squares])

  const nextValue = getNextValue(squares);
  const winner = getWinner(squares);
  const status = getStatus(squares, winner, nextValue);

  function handleClick(square) {
    if(winner || squares[square]){
      return
    }
    const squaresCopy = [...squares];
    squaresCopy[square] = nextValue;
    setSquare(squaresCopy);
  }

  function restart(){
    setSquare(Array(9).fill(null));
  }

  function renderSquare(i) {
    return(
      <div className='square-container'>
        <button className='square' onClick={() => handleClick(i)}>
          {squares[i]}
      </button>
      </div>
    );
  };
  return (
    <div className="App">
        <div>
          <div className='status'>{status}</div>
          <div className='border-row'>
            {renderSquare(0)}
            {renderSquare(1)}
            {renderSquare(2)}
          </div>
          <div className='border-row'>
            {renderSquare(3)}
            {renderSquare(4)}
            {renderSquare(5)}
          </div>
          <div className='border-row'>
            {renderSquare(6)}
            {renderSquare(7)}
            {renderSquare(8)}
          </div>
          <button className="restart" onClick={restart}>
            restart
          </button>
        </div>
    </div>
  );
  
  function getStatus(squares, winner, nextValue){
    if(winner){
      return 'Winner is '+ winner
    } 
    if(squares.filter(Boolean).length === 9){
      return 'Scratch cats game'
    } 
    if(nextValue){
      return 'Next to play '+ nextValue
    }
  }

  function getNextValue(squares){
    return squares.filter(Boolean).length % 2 === 0 ? 'X' : 'O';
  }

  function getWinner(squares){
    const lines = [
      [0,1,2],
      [3,4,5],
      [6,7,8],
      [0,3,6],
      [1,4,7],
      [2,5,8],
      [0,4,8],
      [2,4,6]
    ];
    for(let i= 0; i< lines.length; i++){
      const [a,b,c] = lines[i];
      if(squares[a] && squares[a] === squares[b] && squares[a]=== squares[c]){
        return squares[a];
      }
    }
    return null;
  }
}

export default App;
