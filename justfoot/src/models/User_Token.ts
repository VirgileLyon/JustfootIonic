import { Text, Relationship, Select } from '@keystonejs/fields';
import { App } from '../controllers/Keystone';
import * as moment from 'moment';
import { DateTimeUtc } from "@keystonejs/fields-datetime-utc";

App.keystone.createList('User_Token', {
    fields: {
        user: { type: Relationship, ref: 'User', isRequired: true },
        expirationDate: { type: DateTimeUtc },
        type: { type: Select, options: 'reset_password,confirm_account' },
        createdAt: {
            type: DateTimeUtc,
            isRequired: true,
            defaultValue: () => moment.utc().toDate(),
        },
    },
});