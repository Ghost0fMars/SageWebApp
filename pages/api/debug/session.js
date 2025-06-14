import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth].js";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  console.log("🔍 Session côté API debug :", session);
  res.status(200).json({ session });
}
