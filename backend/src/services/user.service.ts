import { Membership } from "@/models/membership.model";

export class UserService {
  static async getUsersBySocietyAndRole(societyId: string, role?: string) {
    const query: any = { societyId };
    if (role) {
      query.role = role;
    }
    return Membership.find(query).populate("userId", "_id name");
  }
}
