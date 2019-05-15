import React, { Component } from 'react';
import api from '../../services/api';

import logo from "../../assets/logo.svg"
import "./styles.css"

export default class Main extends Component {
    
    state = { //Contem todas as informações que são manipuladas pelo componente
        newBox: '',
    };

    handleSubmit = async (event) => { 
        event.preventDefault();
        
        const response = await api.post('boxes', { //o corpo da requisção já vai no formato JSON
            title: this.state.newBox,
        });
        this.props.history.push(`/box/${response.data._id}`); // joga o usuário para outra tela
    }

    handleInputChange = (event) => { //evento de troca do input
        this.setState({newBox: event.target.value}); // Objeto com todas as informações que queremos alterar
    }

    render() {
    return(
      <div id="main-container">
        <img src={logo} alt="" width="10%" height="10%"/>
          <form onSubmit={this.handleSubmit}>
            <input 
            placeholder= "Criar um Box"
            value ={this.state.newBox}
            onChange = {this.handleInputChange}
            />
            <button type="submit">Criar</button>
          </form>
      </div>  
    );
  }
}
