import { IGameConfig } from 'gamesShared/definitions/game';
import { NineMensMorrisGame } from './game';
import { Board } from './board';

const config: IGameConfig = {
  bgioGame: NineMensMorrisGame,
  bgioBoard: Board,
};

export default config;
