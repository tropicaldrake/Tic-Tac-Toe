import React, { useState } from 'react';

import styles from './App.module.css';


function App(props){


  // Gracze

  const[players,setPlayers] = useState([

    {name: "Gracz1", icon: <h1 className={styles.spin}>X</h1>},
    {name: "Gracz2", icon: <h1 className={styles.spin}>O</h1>},


  ]);


  // Tabela z grą

  const[board,setBoard] = useState([

    {value: 1, player: null, winning: false},
    {value: 2, player: null, winning: false},
    {value: 3, player: null, winning: false},
    {value: 4, player: null, winning: false},
    {value: 5, player: null, winning: false},
    {value: 6, player: null, winning: false},
    {value: 7, player: null, winning: false},
    {value: 8, player: null, winning: false},
    {value: 9, player: null, winning: false},

  ]);


  // Blokada

  const[lock,setLock] = useState(false);

  // Tury

  const[rounds,setRounds] = useState({

    current: {

      player:players[0],
      number:0

    },

    history: []

  });


  function markWinning(player){

    let newBoard = [...board];

    newBoard.forEach((item)=>{

      if(item.player === player){

        item.winning = true;

      }


    });

    setBoard(newBoard);


  }


  function checkWin(player){

    let winningSets = [

      [1,2,3],
      [4,5,6],
      [7,8,9],
      [1,4,7],
      [2,5,8],
      [3,6,9],
      [1,5,9],
      [3,5,7],

    ];

    let playerPicks = [];

    board.forEach((item)=>{

      if(item.player === player){

        playerPicks.push(item.value);

      }

    });

    let match = false;

    for(let a = 0; a < winningSets.length; a++){

      let matching = 0;

      for(let b = 0; b < winningSets[a].length; b++){

        if(playerPicks.includes(winningSets[a][b])){

          matching++;

        }

      }

      if(matching === 3){

        match = true;

      }


    }

    return match;

  }

  function checkWin2(player){

    let winningSets = [

      [0,1,2],
      [3,4,5],
      [6,7,8],
      [0,3,6],
      [1,4,7],
      [2,5,8],
      [0,4,8],
      [2,4,6],

    ];


    let playerPicks = [];

    board.forEach((item,index)=>{

      if(item.player === player){

        playerPicks.push(index);

      }

    });


    let winningPicks = [];


    winningSets.forEach((a,ai)=>{

      let matching = [];

      a.forEach((b,bi)=>{

        if(playerPicks.includes(b)){

          matching.push(b);

        }

      });

      if(matching.length === 3){

        winningPicks = matching;

      }

    });


    return winningPicks.length > 0 ? winningPicks : null;

  }

  function clickHandler(event,index){

    if( !board[index].player && !lock ){

      let newBoard = [...board];

      newBoard[index].player = rounds.current.player;

      let winningSet = checkWin2(newBoard[index].player);
      
      if(winningSet){

        endGame(newBoard[index].player,winningSet);

      }else{

        if(rounds.current.number !== 9){

          advanceTurn();
  
        }else{
  
          endGame();
  
        }

      }

      setBoard(newBoard);

    }

  }

  function clearGame(){

    let newBoard = [...board];

    newBoard.forEach((item)=>{

      item.player = null;
      item.winning = false;

    });

    setBoard(newBoard);

    let newRounds = rounds;

    newRounds.current.number = 0;

    setRounds(newRounds);

    advanceTurn();

  }

  function advanceTurn(){

    let newRounds = rounds;

    pushHistory(`Początek tury: ${newRounds.current.number}`);

    newRounds.current.player = newRounds.current.player === players[0] ? players[1] : players[0];
    newRounds.current.number++;

    setRounds(newRounds);

  }


  function markWinning2(winningSet){

    console.log(winningSet);

    let newBoard = [...board];

    winningSet.forEach((item)=>{

      newBoard[item].winning = true;

    });

    setBoard(newBoard);

  }

  function pushHistory(message){

    let newRounds = rounds;

      newRounds.history.push(message);

    setRounds(newRounds);


  }


  function someTime(){

    return new Promise(resolve => {

      setTimeout(resolve,2000);

    });

  }

  async function endGame(winningPlayer,winningSet){


    setLock(true);

    if(winningPlayer){

      pushHistory(`Gra się kończy, wygrywa ${winningPlayer.name}`);

      if(winningSet){

        markWinning2(winningSet);

      }

    }else{

      pushHistory(`Gra się kończy, brak zwycięzców`);

    }

    console.log("Pokazuję wiadomość");

    await someTime();

    console.log("Czyszczę planszę");
    console.log("Nowa gra się rozpoczyna...");

    clearGame();

    setLock(false);

  }


  return(

    <div className={styles.content}>

      <div className={styles.board}>

        <div className={styles.board__grid}>


          { board.map((item,index)=>{return(

            <div key={index} onClick={ (e)=>clickHandler(e,index) } className={`${styles.board__grid__item} ${item.winning ? styles.win : null}`}><div>{ item.player ? item.player.icon : null }</div></div>

          )})}

        </div>

        { false ? (

        <div className={styles.modal}>

          <div>abba</div>

        </div>

        ): null}


      </div>
      <div className={styles.history}>

          <ul>

            { rounds.history.map((item,index)=>{return(

              <li key={index}>{item}</li>

            )})}

          </ul>

      </div>

    </div>

  );




}

export default App;
