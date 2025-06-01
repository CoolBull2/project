import initSqlJs from 'sql.js';
import { format } from 'date-fns';

let db: any = null;

export interface NetworkReport {
  id: string;
  title: string;
  date: string;
  status: 'Completed' | 'In Progress' | 'Failed';
  type: string;
  details: {
    latency: number;
    packetLoss: number;
    bandwidth: number;
    dnsResolution: boolean;
  };
  summary: string;
}

const initDb = async () => {
  if (db) return;
  
  const SQL = await initSqlJs({
    locateFile: file => `https://sql.js.org/dist/${file}`
  });
  
  db = new SQL.Database();
  
  // Create the reports table if it doesn't exist
  db.run(`
    CREATE TABLE IF NOT EXISTS network_reports (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      date TEXT NOT NULL,
      status TEXT NOT NULL,
      type TEXT NOT NULL,
      details TEXT NOT NULL,
      summary TEXT NOT NULL
    )
  `);
};

export const db_operations = {
  fetchReports: async (): Promise<NetworkReport[]> => {
    await initDb();
    const result = db.exec('SELECT * FROM network_reports ORDER BY date DESC');
    if (!result.length) return [];
    
    return result[0].values.map((row: any[]) => ({
      id: row[0],
      title: row[1],
      date: row[2],
      status: row[3] as NetworkReport['status'],
      type: row[4],
      details: JSON.parse(row[5]),
      summary: row[6]
    }));
  },

  addReport: async (report: Omit<NetworkReport, 'id' | 'date'>): Promise<NetworkReport> => {
    await initDb();
    const newReport = {
      ...report,
      id: crypto.randomUUID(),
      date: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
      details: JSON.stringify(report.details)
    };

    const stmt = db.prepare(`
      INSERT INTO network_reports (id, title, date, status, type, details, summary)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run([
      newReport.id,
      newReport.title,
      newReport.date,
      newReport.status,
      newReport.type,
      newReport.details,
      newReport.summary
    ]);
    
    stmt.free();
    
    return {
      ...newReport,
      details: report.details
    };
  },

  deleteReport: async (id: string): Promise<void> => {
    await initDb();
    const stmt = db.prepare('DELETE FROM network_reports WHERE id = ?');
    stmt.run([id]);
    stmt.free();
  },

  getReport: async (id: string): Promise<NetworkReport | undefined> => {
    await initDb();
    const result = db.exec('SELECT * FROM network_reports WHERE id = ?', [id]);
    if (!result.length) return undefined;
    
    const row = result[0].values[0];
    return {
      id: row[0],
      title: row[1],
      date: row[2],
      status: row[3] as NetworkReport['status'],
      type: row[4],
      details: JSON.parse(row[5]),
      summary: row[6]
    };
  }
};