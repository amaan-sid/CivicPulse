import { Request, Response } from "express";
import { Society } from "../models/society.model";
import { Issue } from "../models/issue.model";
import codeGen from "../utils/codeGenerator";
import { Membership } from "../models/membership.model";
import { User } from "../models/user.model";
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

    await Membership.create({
      societyId: society._id as Types.ObjectId,
      userId: user.id,
      role: "admin"
    });

    await User.findByIdAndUpdate(user.id, {
      currentSocietyId: society._id
    });

    const memberships = await Membership.find({
      userId:user.id
    }).select("societyId role").populate("societyId", "name code")

    res.status(201).json({
      currentSocietyId:society.id ,
      memberships
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
    if (!societyCode) {
      return res.status(400).json({ message: "Society code is required" })
    }

    const user = req.user

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    const society = await Society.findOne({code:societyCode})

    if (!society) {
      return res.status(404).json({ message: "Society not found" })
    }

    const existing = await Membership.findOne({
      userId: user.id,
      societyId: society._id
    })

    if (!existing) {
      await Membership.create({
        userId:user.id,
        societyId:society._id,
        role:"resident"
      })
    }

    await User.findByIdAndUpdate(user.id, {
      currentSocietyId: society._id
    })

    const memberships = await Membership.find({
      userId:user.id
    }).select("societyId role").populate("societyId", "name code")

    res.json({
      message: existing ? "Already Joined" : "Society Joined",
      currentSocietyId: society.id,
      memberships
    })

  } catch (error) {
    console.error("JOIN SOCIETY ERROR:", error)
    res.status(500).json({ message: "Failed to join society" })
  }
}

// Change Current Society
export const changeCurrentSociety = async (req: Request, res: Response) => {
  try {
    const { societyId } = req.body

    if (!societyId) {
      return res.status(400).json({ message: "Society id is required" })
    }

    const user = req.user
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    const membership = await Membership.findOne({
      userId: user.id,
      societyId
    })

    if (!membership) {
      return res.status(403).json({ message: "You are not part of this society" })
    }

    await User.findByIdAndUpdate(user.id, {
      currentSocietyId: societyId
    })

    const memberships = await Membership.find({
      userId: user.id
    }).select("societyId role").populate("societyId", "name code")

    res.json({
      currentSocietyId: societyId,
      role: membership.role,
      memberships
    })
  } catch (error) {
    console.error("CHANGE SOCIETY ERROR:", error)
    res.status(500).json({ message: "Failed to change society" })
  }
}

// Get All Societies (for admin view)
// export const getSocieties = async (req: Request, res: Response) => {
//   try {
//     const societies = await Society.find()
//     res.json(societies)
//   } catch (error) {
//     console.error("GET SOCIETIES ERROR:", error)
//     res.status(500).json({ message: "Failed to fetch societies" })
//   }
// }

// Get all Residents of the society of the user
type PopulatedUser = {
  _id: string
  name: string
  email: string
}

export const getResidents = async (req: Request, res: Response) => {
  try {
    const user = req.user

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    if (!user.society) {
      return res.status(400).json({ message: "No society selected" })
    }

    if (user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" })
    }

    const memberships = await Membership.find({
      societyId: user.society
    }).populate("userId", "name email")

    const residents = memberships.map(m => {
      const u = m.userId as unknown as PopulatedUser

      return {
        _id: u._id,
        name: u.name,
        email: u.email,
        role: m.role,
        flatNumber: (m as any).flatNumber || ""
      }
    })

    res.json(residents)

  } catch (error) {
    console.error("GET RESIDENTS ERROR:", error)
    res.status(500).json({ message: "Failed to fetch residents" })
  }
};

//Update Society fields
export const updateSociety = async (req: Request, res: Response) => {
  try {
    const user = req.user
    if (!user?.society) {
      return res.status(400).json({ message: "No society selected" })
    }

    if (user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" })
    }

    const allowedFields = ["name", "address", "city", "state", "totalFlats"]

    const updates: any = {}

    for (const key of allowedFields) {
      if (req.body[key] !== undefined) {
        updates[key] =
          key === "totalFlats" ? Number(req.body[key]) : req.body[key]
      }
    }

    const society = await Society.findByIdAndUpdate(
      user.society,
      updates,
      { new: true }
    )

    res.json(society)

  } catch (err) {
    console.error("UPDATE SOCIETY ERROR:", err)
    res.status(500).json({ message: "Failed to update society" })
  }
}

//Update Resident's Role
export const updateResident = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { role } = req.body
    const user = req.user

    if (!user?.society) {
      return res.status(400).json({ message: "No society selected" })
    }

    if (user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" })
    }

    const membership = await Membership.findOne({
      userId: id,
      societyId: user.society
    })

    if (!membership) {
      return res.status(404).json({ message: "Resident not found" })
    }

    if (id === user.id && role ) {
      return res.status(400).json({ message: "You cannot demote yourself" })
    }

    if (role) membership.role = role

    await membership.save()

    res.json({ message: "Resident updated" })

  } catch (err) {
    console.error("UPDATE RESIDENT ERROR:", err)
    res.status(500).json({ message: "Failed to update resident" })
  }
}

//Remove Resident
export const removeResident = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const user = req.user

    if (!user?.society) {
      return res.status(400).json({ message: "No society selected" })
    }

    if (user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" })
    }

    if (id === user.id) {
      return res.status(400).json({ message: "You cannot remove yourself" })
    }

    const membership = await Membership.findOne({
      userId: id,
      societyId: user.society
    })

    if (!membership) {
      return res.status(404).json({ message: "Resident not found" })
    }

    await membership.deleteOne()

    res.json({ message: "Resident removed" })

  } catch (err) {
    console.error("REMOVE RESIDENT ERROR:", err)
    res.status(500).json({ message: "Failed to remove resident" })
  }
}

//Get the society object by using the id provided in the user object
export const getCurrentSociety = async (req: Request, res: Response) => {
  try {
    const user = req.user

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    if (!user.society) {
      return res.status(400).json({ message: "No society selected" })
    }

    const society = await Society.findById(user.society)

    if (!society) {
      return res.status(404).json({ message: "Society not found" })
    }

    res.json(society)

  } catch (error) {
    console.error("GET CURRENT SOCIETY ERROR:", error)
    res.status(500).json({ message: "Failed to fetch society" })
  }
}

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
    if (!society) {
      return res.status(404).json({ message: "Society not found" })
    }

    res.json(society)

  } catch (error) {
    console.error("GET SOCIETY ERROR:", error)
    res.status(500).json({ message: "Failed to fetch society" })
  }
}