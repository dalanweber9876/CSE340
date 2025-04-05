const pool = require("../database/")

/* ***************************
 *  Get messages by account_id
 * ************************** */
async function getMessagesByAccountId(account_id) {
    try {
        const data = await pool.query(
        `SELECT * FROM public.message AS i 
        WHERE i.message_to = $1 AND i.message_archived = false`,
        [account_id]
        )
        return data.rows
    } catch (error) {
        console.error("getMessagesByAccountId " + error)
    }
}

/* *****************************
*   Add new classification
* *************************** */
async function addNewMessage(
    message_to, 
    message_subject, 
    message_body, 
    account_id){
    try {
      const sql = "INSERT INTO message (message_subject, message_body, message_to, message_from ) VALUES ($1, $2, $3, $4) RETURNING *"
      return await pool.query(sql, [message_subject, message_body, message_to, account_id])
    } catch (error) {
      return error.message
    }
}

/* ***************************
 *  Get all contacts
 * ************************** */
async function getContacts() {
  return await pool.query("SELECT * FROM public.account ORDER BY account_firstname")
}

/* ***************************
 *  Get a single message
 * ************************** */
async function getSingleMessage(message_id) {
  try {
    const data = await pool.query(
    `SELECT * FROM public.message AS i 
    WHERE i.message_id = $1`,
    [message_id]
    )
    return data.rows[0]
} catch (error) {
    console.error("getSingleMessage " + error)
}
}

async function toggleRead(message_id) {
  try {
    const result = await pool.query(
      `UPDATE public.message 
       SET message_read = NOT message_read 
       WHERE message_id = $1 
       RETURNING *;`,
      [message_id]
    );
    return result.rows[0];
  } catch (error) {
    console.error("toggleRead error:", error);
  }
}

async function toggleArchived(message_id) {
  try {
    const result = await pool.query(
      `UPDATE public.message 
       SET message_archived = NOT message_read 
       WHERE message_id = $1 
       RETURNING *;`,
      [message_id]
    );
    return result.rows[0];
  } catch (error) {
    console.error("toggleArchived error:", error);
  }
}

  module.exports = { getMessagesByAccountId, addNewMessage, getContacts, getSingleMessage, toggleRead, toggleArchived }