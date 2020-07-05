import { Text, Relationship, Integer, Url } from "@keystonejs/fields";
import { App } from "../controllers/Keystone";
import * as moment from "moment";

const { DateTimeUtc } = require("@keystonejs/fields-datetime-utc");

App.keystone.createList("Ranking", {
  fields: {
    rank: { type: Integer },
    teamId: { type: Integer },
    teamName: { type: Text },
    logo: { type: Url },
    points: { type: Integer },
    updatedAt: { type: DateTimeUtc }, // date à laquelle le classement de la L1 a été mis à jour du côté API
    savedAt: { type: DateTimeUtc, defaultValue: () => moment.utc().toDate() }, // date à laquelle on sauvegarde sur notre serveur les données de l'API
  },
});
