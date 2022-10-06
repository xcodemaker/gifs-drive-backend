const { v4: uuidv4 } = require('uuid');
const { dbClient } = require('../utils/dbConnection');

async function createUser(email, name) {
  const id = uuidv4();
  const command = {
    TableName: 'Users',
    Item: {
      id: {
        S: id,
      },
      name: {
        S: name,
      },
      email: {
        S: email,
      },
    },
  };
  try {
    await dbClient.putItem(command).promise();
    return id;
  } catch (err) {
    return err;
  }
}

/**
 * Login with username and password
 * @param {string} email
 * @param {string} name
 * @returns {Promise<User>}
 */
const register = async (email, name) => {
  try {
    const id = await createUser(email, name);
    return { body: 'Successfully created item!', success: true, userId: id };
  } catch (err) {
    return { error: err, success: false };
  }
};

module.exports = {
  register,
};
