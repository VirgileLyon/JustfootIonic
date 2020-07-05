import { Text, Relationship, Url, Integer } from "@keystonejs/fields";
import { App } from "../controllers/Keystone";
import * as moment from 'moment';

const { DateTimeUtc } = require("@keystonejs/fields-datetime-utc");

App.keystone.createList("Team", {
  fields: {
    apiId: {type: Integer},
    name: { type: Text },
    logo: { type: Url },
    stadium: { type: Text },
    players: {
      type: Relationship,
      ref: "Player.team",
      many: true,
      isRequired: true,
    },
    // games: {
    //   type: Relationship,
    //   ref: "Game",
    //   many: true,
    //   isRequired: true,
    // },
    savedAt: { type: DateTimeUtc, defaultValue: () => moment.utc().toDate() },
  },
});
