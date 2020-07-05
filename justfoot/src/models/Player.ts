import { Text, Relationship, Integer } from "@keystonejs/fields";
import { App } from "../controllers/Keystone";
import * as moment from "moment";

const { DateTimeUtc } = require("@keystonejs/fields-datetime-utc");

App.keystone.createList("Player", {
  fields: {
    apiId: {type: Integer},
    name: { type: Text },
    position: { type: Text },
    ratings: {
      type: Relationship,
      ref: "Rating.player",
      many: true,
      isRequired: true,
    },
    team: { type: Relationship, ref: "Team.players", isRequired: true },
    savedAt: { type: DateTimeUtc, defaultValue: () => moment.utc().toDate() },
  },
});
