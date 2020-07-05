import { Text, Relationship, Integer } from "@keystonejs/fields";
import { App } from "../controllers/Keystone";
import * as moment from 'moment';

const { DateTimeUtc } = require("@keystonejs/fields-datetime-utc");

App.keystone.createList("Game", {
  fields: {
    homeTeam: {type: Relationship, ref: "Team", isRequired: true},
    awayTeam: {type: Relationship, ref: "Team", isRequired: true},
    eventDate: { type: DateTimeUtc },
    round: { type: Text }, // c'est le numéro de la journée de Ligue 1
    score: { type: Text }, // "2 - 0", "1 - 1"
    status: { type: Text }, // "Match finished", " Not Started", ...
    savedAt: { type: DateTimeUtc, defaultValue: () => moment.utc().toDate() },
  },
});
