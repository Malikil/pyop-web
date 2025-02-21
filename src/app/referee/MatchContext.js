const { createContext } = require("react");

const MatchContext = createContext({
   context: {
      player1: {
         name: "",
         score: 0
      },
      player2: {
         name: "",
         score: 0
      },
      nextPick: "",
      firstPick: 0
   },
   setContext: () => {}
});

export default MatchContext;
