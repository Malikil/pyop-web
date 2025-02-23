const { createContext } = require("react");

const MatchContext = createContext({
   context: {
      mp: '',
      player1: {
         name: "",
         score: 0,
         roll: 0
      },
      player2: {
         name: "",
         score: 0,
         roll: 0
      },
      nextPick: "",
      maps: [{
         map: 0,
         winner: ''
      }],
      bestOf: 7
   },
   setContext: () => {}
});

export default MatchContext;
