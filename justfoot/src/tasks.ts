import * as Cron from "cron";
import * as rp from "request-promise";
import { App } from "./controllers/Keystone";

async function makeRequest(uri): Promise<any> {
  const options = {
    uri: "https://api-football-v1.p.rapidapi.com/v2" + uri,
    headers: {
      "x-rapidapi-key": "4aa86b88c3msh2053853cf787188p164f21jsnfa3541f39573",
    },
    json: true, // Automatically parses the JSON string in the response
  };

  return await rp(options);
}

export async function runTasks() {
  const keystone = App.keystone;
  console.log("task run");

  try {
    // GET: le classement de la ligue 1
    const classementLigue1 = await makeRequest("/leagueTable/525");

    const rankingDatas = classementLigue1.api.standings[0].map((item) => {
      let newItem = {
        rank: item.rank,
        teamId: item.team_id,
        teamName: item.teamName,
        logo: item.logo,
        points: item.points,
        updatedAt: item.lastUpdate,
      };
      return newItem;
    });

    // // Peupler la base de données avec le classement de la L1
    await keystone.createItems({
      Ranking: rankingDatas,
    });

    // GET: toutes les teams de L1 (ne contient pas les joueurs)
    const allTeams = await makeRequest("/teams/league/525");

    // Transformation des datas obtenues pour coller au modèle Team
    const teamsDatas: Array<any> = allTeams.api.teams.map((item) => {
      let newItem = {
        apiId: item.team_id,
        name: item.name,
        logo: item.logo,
        stadium: item.venue_name,
      };
      return newItem;
    });

    //Attendre 1 minute
    await new Promise((resolve) => setTimeout(resolve, 60001));

    // Initialisation d'un tableau vide pour le stockage des datas des players
    let playersDatas = [];

    for (const team of allTeams.api.teams) {
      // GET: tous les players de chaque team (1 call par team)
      let teamPlayers = await makeRequest(
        `/players/squad/${team.team_id}/2019-2020`
      );

      // Transformation des datas obtenues pour coller au modèle Player et push dans le tableau vide
      const newTab = teamPlayers.api.players.map((player) => {
        let players = {
          apiId: player.player_id,
          name: player.player_name,
          position: player.position,
          team: { where: { apiId: team.team_id } },
        };
        playersDatas.push(players);
      });
    }

    //Attendre 1 minute
    await new Promise((resolve) => setTimeout(resolve, 60001));

    // Initialisation d'un tableau vide pour le stockage des datas des games
    let gamesDatas = [];

    for (const team of allTeams.api.teams) {
      // GET: tous les games de chaque team (1 call par team)
      let teamGames = await makeRequest(
        `/fixtures/team/${team.team_id}/525?timezone=Europe/Paris`
      );

      // Transformation des datas obtenues pour coller au modèle Game et push dans le tableau vide
      const newTab = teamGames.api.fixtures.map((game) => {
        let games = {
          homeTeam: { where: { apiId: game.homeTeam.team_id } },
          awayTeam: { where: { apiId: game.awayTeam.team_id } },
          eventDate: game.event_date,
          round: game.round,
          status: game.status,
          score: game.score.fulltime,
        };
        gamesDatas.push(games);
      });
    }

    // Peupler la base de données avec les teams, les players et les games
    await keystone.createItems({
      Team: teamsDatas,
      Player: playersDatas,
      Game: gamesDatas,
    });
  } catch (error) {
    console.log(error);
  }

  console.log("done");
}

// A UTILISER PLUS TARD POUR AUTOMATISER LES CALL API TOUS LES JOURS A MINUIT
// ___________________________________________________________________________
//
// *** CRONJOB ***
// field  allowed values
// -----          -------------
// second         0-59
// minute         0-59
// hour           0-23
// day of month   0-31
// month          0-12
// day of week    0-7

// *** Lance les appels à l'API foot tous les jours à minuit ***
// const job = new Cron.CronJob("00 00 00 * * *", runTasks);
// job.start();
