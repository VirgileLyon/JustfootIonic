import { App } from "../controllers/Keystone";
import { File, Text } from "@keystonejs/fields";
import { LocalFileAdapter } from "@keystonejs/file-adapters";
import { AuthedRelationship } from "@keystonejs/fields-authed-relationship";
import { restrictedToUser } from "../helpers/access";

const fileAdapter = new LocalFileAdapter({
  src: process.env.STORAGE_PATH || "/storage",
  path: "/api/medias",
});

App.keystone.createList("Asset", {
  fields: {
    name: { type: Text, isRequired: true },
    file: { type: File, adapter: fileAdapter, isRequired: true },
    createdBy: {
      type: AuthedRelationship,
      ref: "User",
      isRequired: true,
    },
  },
  access: {
    update: restrictedToUser,
    delete: restrictedToUser,
    read: restrictedToUser,
  },
});
