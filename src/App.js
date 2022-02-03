import logo from './logo.svg';
import './App.css';
import web3 from './web3';
import lottery from './lottery';
import {useState, useEffect} from 'react'

function App() {

  const [manager, setManager] = useState('')
  const [players, setPlayers] = useState('')
  const [balance, setBalance] = useState('')
  const [text, setText] = useState('')
  const [message, setMessage] = useState('')

  const handleOnChange = (e) => {
    setText(e.target.value)
  }

  const handleOnSubmit = async (e) => {
    e.preventDefault()
    const accounts = await web3.eth.getAccounts();

    setMessage('Waiting on transaction success....');

    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(text, 'ether'),
    })
    setMessage('You have been entered!');
  }
  useEffect(() => {
    async function getManager() {
      const m = await lottery.methods.manager().call()
      setManager(m)
    }
    getManager()
    async function getPlayers() {
      const p = await lottery.methods.getPlayers().call()
      setPlayers(p)
    }
    getPlayers()
    async function getBalance() {
      const b = await web3.eth.getBalance(lottery.options.address)
      setBalance(b)
    }
    getBalance()
  })

  const handleOnClick = async () => {
    const accounts = await web3.eth.getAccounts()

    setMessage('Waiting on transaction success....');
    await lottery.methods.pickWinner().send({
      from: accounts[0],
    });

    setMessage('Winner has been picked');
  }

  return (
    <div>
      <h2>Lottery Contract</h2>
      <p>This contract is managed by {manager}. 
      There are currently {players.length} people entered, competing to win {web3.utils.fromWei(balance, 'ether')} ether!
      </p>
      <hr />
      <form onSubmit={handleOnSubmit}>
        <h4>Want to try your luck?</h4>
        <div>
          <label>Amount of ether to enter</label>
          <input type="text" onChange={handleOnChange} value={text}/>
        </div>
        <button>Enter</button>
      </form>
      <hr/>
      <h4>Ready to pick a winner?</h4>
      <button onClick={handleOnClick}>Pick a Winner!</button>
      <hr/>
      <h1>{message}</h1>
    </div>
  );
}

export default App;
