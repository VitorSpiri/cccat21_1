import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [document, setDocument] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  async function confirm() {
    const input = {
      name,
      email,
      document,
      password
    }
    const response = await fetch('http://localhost:3001/signup', {
      method: 'post',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(input)
    });
    const output = await response.json();
    console.log(input);
    setMessage("success");
  }

  function fill(){
    setName('John Doe');
    setEmail('john.doe@gmail.com');
    setDocument('97456321558');
    setPassword('asdQWE123');
  }

  return (
    <>
    <div style={{display: 'flex', flexDirection: 'column'}}>
      <input className="input-name" value={name} onChange={(e) => setName(e.target.value)} />
      <input className="input-email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input className="input-document" value={document} onChange={(e) => setDocument(e.target.value)} />
      <input className="input-password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button className="button-confirm" onClick={() => fill()}>Preencher</button>
      <button className="button-confirm" onClick={() => confirm()}>Confirmar</button>
      <span className="span-message"> {message} </span>
    </div>
    </>
  )
}

export default App
