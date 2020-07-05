import { Checkbox, Password, Text, Relationship } from "@keystonejs/fields";
import { App } from "../controllers/Keystone";
import { DateTimeUtc } from "@keystonejs/fields-datetime-utc";
import { userOnly } from "../helpers/access";
import * as moment from "moment";

App.keystone.createList("User", {
  labelField: "email",
  fields: {
    firstName: {
      type: Text,
    },
    lastName: {
      type: Text,
    },
    email: {
      type: Text,
      isUnique: true,
      isRequired: true,
    },
    password: {
      type: Password,
      isRequired: true,
    },
    createdAt: {
      type: DateTimeUtc,
      isRequired: true,
      defaultValue: () => moment.utc().toDate(),
    },
    isAdmin: {
      type: Checkbox,
    },
    team: { type: Relationship, ref: "Team", isRequired: true },
    avatar: { type: Relationship, ref: "Asset", isRequired: true },
    friends: { type: Relationship, ref: "User", isRequired: true },
  },
  // access: {
  //   update: userOnly,
  //   delete: userOnly,
  //   read: userOnly,
  // },
});
