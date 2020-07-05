import { Text, Relationship } from "@keystonejs/fields";
import { App } from "../controllers/Keystone";
import { AuthedRelationship } from "@keystonejs/fields-authed-relationship";
import { restrictedToUser } from "../helpers/access";
import * as moment from "moment";

const { DateTimeUtc } = require("@keystonejs/fields-datetime-utc");

App.keystone.createList("Message", {
  fields: {
    content: {
      type: Text,
      isRequired: true,
    },
    createdBy: {
      type: AuthedRelationship,
      ref: "User",
      isRequired: true,
    },
    createdAt: {
      type: DateTimeUtc,
      isRequired: true,
      defaultValue: () => moment.utc().toDate(),
    },
    asset: { type: Relationship, ref: "Asset", isRequired: false },
  },
  access: {
    update: restrictedToUser,
    delete: restrictedToUser,
    read: restrictedToUser,
  },
});
