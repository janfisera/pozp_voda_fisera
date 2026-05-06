const database = "3it_fiseraj23";
const username = "fiseraj23";
const password = "MotorkyJednou789";
const server = "localhost";

export async function sql(sql) {
  const url = "http://marcincin.epsilon.spstrutnov.cz/gate.php";
  const postJson = JSON.stringify({
    database: database,
    username: username,
    password: password,
    server: server,
    sql: sql,
  });

  try {
    const response = await fetch(url, { method: "POST", body: postJson });
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    console.log(json);
    return json;
  } catch (error) {
    console.error(error.message);
  }
}








// Funkce pro DELETE - smazání záznamu z tabulky
export async function deleteRecord(table, id) {
  const query = `DELETE FROM ${table} WHERE id = ${parseInt(id)}`;
  return await sql(query);
}

// Funkce pro UPDATE - editaci záznamu v tabulce
export async function updateRecord(table, id, updates) {
  const id_safe = parseInt(id);
  
  const setClause = Object.entries(updates)
    .map(([key, value]) => {
      if (typeof value === "string") {
        const escapedValue = value.replace(/'/g, "''");
        return `${key}='${escapedValue}'`;
      }
      return `${key}=${value}`;
    })
    .join(", ");

  const query = `UPDATE ${table} SET ${setClause} WHERE id = ${id_safe}`;
  return await sql(query);
}

// Funkce pro INSERT - přidání nového záznamu
export async function insertRecord(table, data) {
  const keys = Object.keys(data);
  const values = Object.values(data)
    .map((value) => {
      if (typeof value === "string") {
        const escapedValue = value.replace(/'/g, "''");
        return `'${escapedValue}'`;
      }
      return value;
    })
    .join(", ");

  const query = `INSERT INTO ${table} (${keys.join(", ")}) VALUES (${values})`;
  return await sql(query);
}

// Funkce pro SELECT - čtení dat z tabulky
export async function selectRecords(table, whereClause = "") {
  const query = whereClause 
    ? `SELECT * FROM ${table} WHERE ${whereClause}`
    : `SELECT * FROM ${table}`;
  return await sql(query);
}
