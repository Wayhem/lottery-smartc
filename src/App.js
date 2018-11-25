import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import web3 from './web3.js';
import lottery from './lottery';

class App extends Component {
  state = {
    manager: '',
    players: [],
    balance: '',
    value: '',
    message: ''
  };

  async componentDidMount() {
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);
    this.setState({ manager, players, balance });
    window.ethereum.enable();
  }

  onSubmit = async event => {
    event.preventDefault();

    const accounts = await web3.eth.getAccounts();

    this.setState({ message: "Esperando transaccion..." });

    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value, 'ether')
    });

    this.setState({ message: "Has entrado en la lotería!" });
  };

  onClick = async () => {
    const accounts = await web3.eth.getAccounts();
    this.setState({ message: "Esperando transaccion..." });
    await lottery.methods.pickWinner().send({
      from: accounts[0]
    });

    this.setState({ message: 'Ya hay un ganador!'});
  }
  render() {
    return (
      <div>
        <h2>Contrato de Lotería</h2>
        <p>
          Este contrato es manejado por {this.state.manager}, hay actualmente{" "}
          {this.state.players.length} personas participando para ganar{" "}
          {web3.utils.fromWei(this.state.balance, 'ether')} ether!
        </p>

        <hr />

        <form onSubmit={this.onSubmit}>
          <h4>¿Quieres probar tu suerte?</h4>
          <div>
            <label>Cantidad de ether a introducir</label>
            <input
              value={this.state.value}
              onChange={event => this.setState({ value: event.target.value })}
            />
          </div>
          <button>Entrar</button>
        </form>

        <hr />

        <h4>¿Listo para el sorteo?</h4>
        <button onClick={this.onClick}>Escoge el ganador</button>

        <hr />

        <h1>{this.state.message}</h1>
      </div>
    );
  }
}

export default App;
