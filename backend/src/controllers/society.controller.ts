import { Request, Response } from "express";
import { Society } from "../models/society.model";
import { Issue } from "../models/issue.model";
import codeGen from "../utils/codeGenerator";
import { Membership } from "../models/membership.model";
import {Types} from "mongoose";

// Create Society
export const createSociety = async (req: Request, res: Response) => {
  try {
    const { name, address, city, state, totalFlats } = req.body;

    if (!name || !address || !city || !state || !totalFlats) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const code = await codeGen();

    const society = await Society.create({
      name,
      address,
      city,
      state,
      totalFlats,
      code
    });

    const membership = await Membership.create({
      societyId: society._id as Types.ObjectId,
      userId: user.id,
      role: "admin"
    });

    res.status(201).json({
      society,
      membership
    });

  } catch (error) {
    console.error("CREATE SOCIETY ERROR:", error);
    res.status(500).json({ message: "Failed to create society" });
  }
};

//Join Society
export const joinSociety = async(req:Request,res: Response)=>{
  const {societyCode}=req.body

  try{
    const society = await Society.findOne({code:societyCode})

    if(society){
      const user = req.user
      const membership= await Membership.findOne({
        userId:user.id,
        societyId:society.id        
      })

      if(membership){
        res.status(200).json({message:"Already Joined"})
      }
      else{
        await Membership.create({
          userId:user.id,
          societyId:society._id,
          role:"resident"
        })

        res.status(200).json({message:"Society Joined"})
      }
    }
    else{
      res.status(500).json({message:"Society Not found"})
    }

  }catch(err){
    res.status(500).json({message:"failed to get society"})
    
  }
}

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