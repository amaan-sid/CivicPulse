import { Request, Response } from "express";
import { Membership } from "../models/membership.model";

export const getAllUsers = async (req: Request, res: Response) => {
    try {
    const { role="resident" } = req.query ;
    const user = req.user
    
    const query: any = { societyId: user.society };

    if (role) {
      query.role = role;
    }

    const users= await Membership.find(query).populate("userId","_id name")

    res.json(users);

  } catch (error) {
    res.status(500).json({ message: "Error fetching users" });
  }
};