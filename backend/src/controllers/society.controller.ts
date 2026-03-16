import { Request, Response } from "express";
import { Society } from "../models/society.model";
import { Issue } from "../models/issue.model";

// Create Society (Admin only ideally)
export const createSociety = async (req: Request, res: Response) => {
  try {
    const { name, address, city, state, totalFlats } = req.body;

    if (!name || !address || !city || !state || !totalFlats) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const society = await Society.create({
      name,
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
