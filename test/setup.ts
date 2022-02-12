import { rm } from 'fs/promises';
import { join } from 'path';
import { getConnection } from 'typeorm';

global.beforeEach(async () => {
  try {
    await rm(join(__dirname, '..', 'test.sqlite'));
  } catch (error) {
    // Do nothing if the file doesn't exist
  }
});

global.afterEach(async () => {
  // Close the connect to the sqlite file (which TypeOrm keeps open).
  // The connection will be automatically reopen when a new end to end test runs
  const connection = getConnection();
  await connection.close();
});
