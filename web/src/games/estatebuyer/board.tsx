import * as React from 'react';
import { IGameArgs } from 'components/App/Game/GameBoardWrapper';
import { GameLayout } from 'components/App/Game/GameLayout';
import { Ctx } from 'boardgame.io';
import { IG } from './game';
import { Scoreboard } from './Scoreboard';
import { PlayerHand } from './PlayerHand';
import { Phases, getScoreBoard, HighestBid } from './game';
import { BidPanelComponent } from './BidPanelComponent';
import { PlayerBadges } from './PlayerBadges';
import { Tableau } from './Tableau';
import { isOnlineGame, isLocalGame, isAIGame } from '../common/gameMode';

import css from './Board.css';

interface IBoardProps {
  G: IG;
  ctx: Ctx;
  moves: any;
  playerID: string;
  gameArgs?: IGameArgs;
}

export class Board extends React.Component<IBoardProps> {
  render() {
    console.log(this.props.ctx);
    console.log(this.props.G);

    if (this.props.ctx.gameover) {
      return <GameLayout
        gameOver={this._getGameOver()}
        extraCardContent={this._getScoreBoard()}
        gameArgs={this.props.gameArgs}
        />;
    }

    return (
      <GameLayout gameArgs={this.props.gameArgs} allowWiderScreen={true}>
        <div className={css.board}>
        <PlayerBadges
          players={this.props.G.players}
          playersMeta={this.props.gameArgs.players}
          scores={getScoreBoard(this.props.G)}
          playerID={this.props.playerID}
          ctx={this.props.ctx}
        />
        <Tableau
          G={this.props.G}
          ctx={this.props.ctx}
          playerID={this.props.playerID}
          moves={this.props.moves}
        />
        { this.getBidPanel() }
        <PlayerHand
          playerIndex={parseInt(this.props.playerID ?? this.props.ctx.currentPlayer)}
          player={this.props.G.players[this.props.playerID ?? this.props.ctx.currentPlayer]}
          selectCard={((this.props.ctx.phase && this.props.ctx.phase.includes(Phases.property_selection))) ? this._selectCard.bind(this) : null}
          />
        </div>
      </GameLayout>
    );
  }

  getBidPanel(){
    if (this.props.ctx.phase == Phases.auction){
      return (
        <BidPanelComponent
          players={this.props.G.players}
          currentPlayer={this.props.ctx.currentPlayer}
          moves={this.props.moves}
          playerID={this.props.playerID}
          currentHighBid={HighestBid(this.props.G.players)}
          />
      );
    }
  }

  _selectCard(playerIndex:number, i:number) {
    console.log("Player "+(playerIndex+1)+" selected building: ", i);
    this.props.moves.MoveSelectBuilding(playerIndex, i);
  }

  _getStatus() {
    if (isOnlineGame(this.props.gameArgs) || isAIGame(this.props.gameArgs)) {
      if (!this._canPlay()) {
        return 'Waiting for opponents...';
      }
      if (this.props.ctx.phase && this.props.ctx.phase.includes(Phases.property_selection)) {
        return 'Select Building';
      }
      return 'Bid or Pass';
    }
    const player:number = parseInt(this.props.ctx.currentPlayer);

    return "Player "+(player+1)+"'s Turn";
  }

  _canPlay() {
    if (this.props.ctx.phase && this.props.ctx.phase.includes(Phases.property_selection)) {
      return (
        this.props.ctx.activePlayers !== null &&
        Object.keys(this.props.ctx.activePlayers)?.includes(this.props.playerID)
      );
    } else {
      return this.props.playerID === this.props.ctx.currentPlayer;
    }
  }

  _getScoreBoard() {
    return (
      <Scoreboard
        scoreboard={getScoreBoard(this.props.G)}
        playerID={this.props.playerID}
        players={this.props.gameArgs.players}
      />
    );
  }

  _getGameOver() {
    const winner = this.props.ctx.gameover.winner;
    if (this.props.ctx.gameover.winner !== undefined) {
      if (this.props.playerID){
        if (this.props.ctx.gameover.winner === this.props.playerID) {
          return 'you won';
        } else {
          return 'you lost';
        }
      }
      return "Player "+(parseInt(this.props.ctx.gameover.winner)+1)+' won';
    }
    return "it is a tie"
  }
}
