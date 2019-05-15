import React, { Component } from 'react';
import api from '../../services/api';
import { distanceInWords, closestIndexTo } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Dropzone from 'react-dropzone'
import socket from 'socket.io-client';


import { MdInsertDriveFile } from 'react-icons/md';

import "./styles.css"
import logo from "../../assets/logo.svg"

export default class Box extends Component {
  state = {box: {}};
  async componentDidMount() {
    this.subscribeToNewFiles();
    const boxid = this.props.match.params.id;
    const response = await api.get(`boxes/${boxid}`)

    this.setState({box: response.data})
  }
  
  subscribeToNewFiles = () =>{
    const boxid = this.props.match.params.id;
    const io = socket('https://dropcaixa-backend.herokuapp.com');
    io.emit('connectRoom', boxid);
    
    io.on('file', data =>{
      this.setState({box:{...this.state.box, files:[data, ...this.state.box.files]} })
    })
  }

  handleUpload = (files) =>{
    files.forEach(file =>{
      const data = new FormData();
      const boxid = this.props.match.params.id;


      data.append('file', file);

      api.post(`boxes/${boxid}/files`,data)
    })
  }
  
  render() {
    return (
      <div id="box-container">
        <header>
          <img src={logo} alt="" width="10%" height="10%"/>
          <h1>{this.state.box.title}</h1>
        </header>

        <Dropzone onDropAccepted ={this.handleUpload}>
          {({getRootProps, getInputProps}) => (
            <div className="upload" {...getRootProps()}>
            <input {...getInputProps()}/>
            <p>Arraste ou Clique aqui</p>
            </div>
          )}
        </Dropzone>

        <ul>
          {this.state.box.files && this.state.box.files.map(file =>(
            <li key={file._id}>
            <a className="fileInfo" href={file.url} target="_blank">
              <MdInsertDriveFile size={24} color= "#E91E63"/>
              <strong>{file.title}</strong>
              
            </a>
            <span>há{" "}{distanceInWords(file.createdAt, new Date(),{
              locale: pt
            })}</span>
          </li>
          ))}
        </ul>
      </div>
    )
  }
}
