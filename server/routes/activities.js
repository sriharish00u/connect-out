import { Router } from "express";

export const activitiesRouter = Router();

activitiesRouter.get("/", (_req, res) => {
  res.json({ activities: [] });
});

activitiesRouter.get("/:id", (req, res) => {
  res.json({ id: req.params.id, title: "Activity", slots: 4, filled: 0 });
});

activitiesRouter.post("/", (req, res) => {
  res.json({ ok: true, id: "new-activity-id" });
});

activitiesRouter.post("/:id/join", (req, res) => {
  res.json({ ok: true });
});
