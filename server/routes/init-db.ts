/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
// Dev only REST api endpoint
// 1. Drops all tables re-migrates prisma schema to postgres
// 2. Re-populates it with mock data

import { Request, Response } from 'express';
import util from 'util';
import prisma from '../db';
import mockUsers from '../mock-data/user-mock-data.json';
import mockEvents from '../mock-data/event-mock-data.json';
import tags from '../mock-data/tags-mock-data.json';

const bcrypt = require('bcrypt');

const SALT_NUMBER: number = Number(process.env.SALT_NUMBER) || 10;

const resetDb = async (req:Request, res:Response) => {
  try {
    await prisma.$queryRawUnsafe('DROP TABLE IF EXISTS "event" CASCADE');
    await prisma.$queryRawUnsafe('DROP TABLE IF EXISTS "user" CASCADE');
    await prisma.$queryRawUnsafe('DROP TABLE IF EXISTS "tag" CASCADE');
    await prisma.$queryRawUnsafe('DROP TABLE IF EXISTS "_participating_events" CASCADE');
    await prisma.$queryRawUnsafe('DROP TABLE IF EXISTS "_prisma_migrations" CASCADE');
    await prisma.$queryRawUnsafe('DROP TABLE IF EXISTS "_friends" CASCADE');

    // eslint-disable-next-line global-require
    const exec = util.promisify(require('child_process').exec);
    await exec('npx prisma generate');
    await exec('npx prisma migrate dev');

    const joinEventsList = [
      [1, 2],
      [1, 4],
      [1, 6],
      [2, 2],
      [2, 7],
      [2, 8],
      [2, 9],
      [3, 1],
      [3, 5],
      [3, 3],
      [4, 1],
      [4, 2],
      [4, 4],
      [4, 8],
      [6, 1],
      [6, 2],
      [7, 1],
      [7, 2],
      [7, 3],
      [7, 4],
      [7, 5],
      [7, 6],
      [7, 7],
      [7, 9],
      [7, 2],
    ];

    const addFriendsList = [
      [1, 2],
      [1, 4],
      [2, 6],
      [2, 7],
      [2, 8],
      [3, 5],
      [4, 1],
      [4, 2],
      [4, 4],
      [6, 1],
      [6, 2],
      [7, 2],
      [7, 4],
      [7, 5],
      [7, 7],
      [7, 9],
      [8, 2],
    ];

    const results:any = {};

    // const createAllUsers = await prisma.user.createMany({ data: mockUsers });
    // results.createUsers = createAllUsers;
    results.createUsers = { count: 0 };
    for (const newUser of mockUsers) {
      const salt = await bcrypt.genSalt(SALT_NUMBER);
      const hashedPassword = await bcrypt.hash(newUser.password, salt);

      // Adding hashed password to our user object
      const body = {
        ...newUser,
        password: hashedPassword,
      };
      await prisma.user.create({ data: { ...body } });

      results.createUsers.count += 1;
    }

    const createAllTags = await prisma.tag.createMany({ data: tags });
    results.createTags = createAllTags;

    const createAllEvents = await prisma.event.createMany({ data: mockEvents });
    results.createEvents = createAllEvents;

    results.joinEvents = { count: 0 };
    for (const el of joinEventsList) {
      await prisma.event.update({
        where: {
          id_event: el[0],
        },
        data: {
          participants: {
            connect: [{ id_user: el[1] }],
          },
        },

      });
      results.joinEvents.count += 1;
    }

    results.addFriends = { count: 0 };
    for (const el of addFriendsList) {
      await prisma.user.update({
        where: {
          id_user: el[0],
        },
        data: {
          friends: {
            connect: [{ id_user: el[1] }],
          },
        },

      });
      results.addFriends.count += 1;
    }

    return res.status(200).send({
      data: {
        message: 'linkup_db succesfully reset - all tables dropped, re-migrated and re-populated with mock data',
        results,
      },
    });
  } catch (err) {
    return res.status(200).send({ error: err });
  }
};

export default { resetDb };
