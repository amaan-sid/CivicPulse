import { Request, Response } from "express";
import { Society } from "../models/society.model";
import { Issue } from "../models/issue.model";

const normalizeString = (value: unknown) =>
  typeof value === "string" ? value.trim() : "";

const generateSocietyCode = (name: string) => {
  const compactName = name.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
  return compactName.slice(0, 8) || `SOC${Date.now().toString().slice(-4)}`;
};

// Create Society (Admin only ideally)
export const createSociety = async (req: Request, res: Response) => {
  try {
    const name = normalizeString(req.body?.name);
    const address = normalizeString(req.body?.address);
    const city = normalizeString(req.body?.city);
    const state = normalizeString(req.body?.state);
    const totalFlats = Number(req.body?.totalFlats);
    const requestedCode = normalizeString(req.body?.code).toUpperCase();

    if (!name || !address || !city || !state || !totalFlats) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (!Number.isInteger(totalFlats) || totalFlats <= 0) {
      return res.status(400).json({ message: "Total flats must be a positive number" });
    }

    const code = requestedCode || generateSocietyCode(name);

    const existingSociety = await Society.findOne({
      $or: [{ code }, { name }]
    }).select("_id");

    if (existingSociety) {
      return res.status(409).json({ message: "Society with this name or code already exists" });
    }

    const society = await Society.create({
      name,
      code,
      address,
      city,
      state,
      totalFlats,
      admin: req.user.id 
    });

    res.status(201).json(society);

  } catch (error) {
    console.error("CREATE SOCIETY ERROR:", error);
    res.status(500).json({ message: "Failed to create society" });
  }
};


// Get All Societies (for admin view)
export const getSocieties = async (req: Request, res: Response) => {
  try {
    const societies = await Society.find().populate("admin", "name email");
    res.json(societies);
  } catch (error) {
    console.error("GET SOCIETIES ERROR:",error);
    res.status(500).json({ message: "Failed to fetch societies" });
  }
};

export const listPublicSocieties = async (_req: Request, res: Response) => {
  try {
    const societies = await Society.find()
      .select("_id name code city state")
      .sort({ name: 1 });

    return res.status(200).json(societies);
  } catch (error) {
    console.error("LIST PUBLIC SOCIETIES ERROR:", error);
    return res.status(500).json({ message: "Failed to fetch societies" });
  }
};

export const getSocietyIssues = async (req: Request, res: Response) => {
  try {

    const { id } = req.params

    const issues = await Issue.find({ society: id })
      .populate("reportedBy", "name flatNumber")
      .populate("assignedTo", "name role")
      .sort({ priorityScore: -1 })

    res.json(issues)

  } catch (error) {
    console.error("GET SOCIETY ISSUES ERROR:", error)
    res.status(500).json({ message: "Failed to fetch society issues" })
  }
}

export const getSocietyById = async (req: Request, res: Response) => {
  try {

    const { id } = req.params

    const society = await Society.findById(id)
      .populate("admin", "name email")

    if (!society) {
      return res.status(404).json({ message: "Society not found" })
    }

    res.json(society)

  } catch (error) {
    console.error("GET SOCIETY ERROR:", error)
    res.status(500).json({ message: "Failed to fetch society" })
  }
}
