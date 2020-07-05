import { Relationship, Integer } from "@keystonejs/fields";
import { App } from "../controllers/Keystone";
import { AuthedRelationship } from "@keystonejs/fields-authed-relationship";
import { restrictedToUser } from "../helpers/access";
import * as moment from "moment";

const { DateTimeUtc } = require("@keystonejs/fields-datetime-utc");

App.keystone.createList("Rating", {
  fields: {
    note: { type: Integer },
    game: { type: Relationship, ref: "Game", isRequired: true },
    player: { type: Relationship, ref: "Player.ratings", isRequired: true },
    createdBy: {
      type: AuthedRelationship,
      ref: "User",
      isRequired: true,
    },
    updatedAt: { type: DateTimeUtc, defaultValue: () => moment.utc().toDate() },
  },
  access: {
    update: restrictedToUser,
    delete: restrictedToUser,
  },
});
