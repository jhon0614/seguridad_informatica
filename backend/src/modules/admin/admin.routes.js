import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { authorizeRoles } from "../../middlewares/roles.middleware.js";
import { prisma } from "../../lib/prisma.js";
const router = Router();
router.get(
  "/stats",
  authMiddleware,
  authorizeRoles("ADMIN"),
  async (req, res) => {
    const activeUsers = await prisma.user.count({ where: { isActive: true } });
    res.json({
      ok: true,
      stats: { activeUsers, serverTime: new Date().toISOString() },
    });
  },
);
export default router;
