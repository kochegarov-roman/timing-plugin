// @ts-ignore
import fs from "fs";

const jsonString = fs.readFileSync("db.json", "utf-8");
const data = JSON.parse(jsonString);

export = (req: any, res: any, next: any) => {
  const { created_from, created_to } = req.query;
  if (created_from && created_to) {
    const fromDate = new Date(created_from.toString());
    const toDate = new Date(created_to.toString());
    const filteredEvents = data.events
      .filter((event: any) => {
        const eventDate = new Date(event.createdAt);
        return eventDate >= fromDate && eventDate <= toDate;
      });
    res.json(filteredEvents);
  } else {
    next();
  }
};
