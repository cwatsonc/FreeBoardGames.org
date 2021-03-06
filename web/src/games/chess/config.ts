import { IGameConfig } from 'gamesShared/definitions/game';
import { ChessGame } from './game';
import { Board as ChessBoard } from './board';

const config: IGameConfig = {
  bgioGame: ChessGame,
  bgioBoard: ChessBoard,
};

export default config;
