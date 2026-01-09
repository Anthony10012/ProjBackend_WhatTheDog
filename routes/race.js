import { Router } from "express";
import { dbrace } from "../db/dbrace.mjs";

const raceRouter = Router();

// GET toutes les races et recherche par nom
raceRouter.get("/", async (req, res) => {
    try {
        const {name} = req.query;

        // Si un nom est fourni -> recherche
        if (name){
            const races = await dbrace.getRacesByName(name);
            return res.json(races);
        }
        // Sinon toutes les races
        const races = await dbrace.getAllRaces();
        res.json(races);
    } catch {
        res.status(500).json({ message: "Erreur serveur" });
    }
});

// GET par ID
raceRouter.get("/:id", async (req, res) => {
    const id = req.params.id;

    if (!/^\d+$/.test(id)) {
        return res.status(400).json({ message: "ID invalide" });
    }

    const race = await dbrace.getRaceById(id);
    if (!race) {
        return res.status(404).json({ message: "Race introuvable" });
    }

    res.json(race);
});

// POST créer une race
raceRouter.post("/", async (req, res) => {
    try {
        const id = await dbrace.createRace(req.body);
        res.status(201).json({ message: "Race créée", id });
    } catch {
        res.status(500).json({ message: "Erreur serveur" });
    }
});

// DELETE une race
raceRouter.delete("/:id", async (req, res) => {
    const id = req.params.id;

    if (!/^\d+$/.test(id)) {
        return res.status(400).json({ message: "ID invalide" });
    }

    try {
        const deleted = await dbrace.deleteRace(id);
        if (!deleted) {
            return res.status(404).json({ message: "Race introuvable" });
        }
        res.json({ message: "Race supprimée avec succès" });
    } catch (error) {
        if (error.message.includes("chiens")) {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: "Erreur serveur" });
    }
});

export { raceRouter };
