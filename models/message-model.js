const pool = require("../database/")

/* ***************************
 *  Get messages by account_id
 * ************************** */
async function getMessagesByAccountId(account_id) {
  try {
    const sql = `
      SELECT 
        m.*, 
        a.account_firstname, 
        a.account_lastname
      FROM 
        public.message AS m
      INNER JOIN 
        public.account AS a 
        ON m.message_from = a.account_id
      WHERE 
        m.message_to = $1 
        AND m.message_archived = false
      ORDER BY 
        m.message_created DESC
    `;
    const data = await pool.query(sql, [account_id]);
    return data.rows;
  } catch (error) {
    console.error("getMessagesByAccountId " + error);
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
 *  Get a single message with sender name
 * ************************** */
async function getSingleMessage(message_id) {
  try {
    const sql = `
      SELECT 
        m.*, 
        a.account_firstname, 
        a.account_lastname
      FROM 
        public.message AS m
      INNER JOIN 
        public.account AS a 
        ON m.message_from = a.account_id
      WHERE 
        m.message_id = $1
    `;
    
    const data = await pool.query(sql, [message_id]);
    return data.rows[0];
  } catch (error) {
    console.error("getSingleMessage error:", error);
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
       SET message_archived = NOT message_archived
       WHERE message_id = $1 
       RETURNING *;`,
      [message_id]
    );
    return result.rows[0];
  } catch (error) {
    console.error("toggleArchived error:", error);
  }
}

/* ***************************
 *  Get archived messages by account_id
 * ************************** */
async function getArchivedByAccountId(account_id) {
  try {
    const sql = `
      SELECT 
        m.*, 
        a.account_firstname, 
        a.account_lastname
      FROM 
        public.message AS m
      INNER JOIN 
        public.account AS a 
        ON m.message_from = a.account_id
      WHERE 
        m.message_to = $1 
        AND m.message_archived = true
      ORDER BY 
        m.message_created DESC
    `;
    const data = await pool.query(sql, [account_id]);
    return data.rows;
  } catch (error) {
    console.error("getArchivedByAccountId " + error);
  }
}

/* ***************************
 *  Delete Message
 * ************************** */
async function deleteMessage(message_id) {
  try {
    const sql =
      'DELETE FROM message WHERE message_id = $1';
    const data = await pool.query(sql, [ message_id ])
    return data
  } catch (error) {
    console.error("Delete Message Error")
  }
}

/* ***************************
 *  Get unread messages by account_id
 * ************************** */
async function getNumUnread(account_id) {
  try {
    const sql = `SELECT * FROM public.message AS m WHERE m.message_to = $1 AND m.message_read = false`;
    const data = await pool.query(sql, [account_id]);
    return data.rowCount;
  } catch (error) {
    console.error("getNumUnread " + error);
  }
}

/* ***************************
 *  Get unread messages by account_id
 * ************************** */
async function getNumArchived(account_id) {
  try {
    const sql = `SELECT * FROM public.message AS m WHERE m.message_to = $1 AND m.message_archived = true`;
    const data = await pool.query(sql, [account_id]);
    return data.rowCount;
  } catch (error) {
    console.error("getNumArchived " + error);
  }
}

  module.exports = { getMessagesByAccountId, addNewMessage, getContacts, getSingleMessage, toggleRead, toggleArchived, getArchivedByAccountId, deleteMessage, getNumUnread, getNumArchived }