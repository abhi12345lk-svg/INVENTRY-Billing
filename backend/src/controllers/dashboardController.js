import { getOwnerDashboardData } from "../services/dashboardService.js";

export const getOwnerDashboard = async (req, res) => {
  try {
    const data = await getOwnerDashboardData();
    return res.status(200).json({
      success: true,
      message: "Owner Command Center data retrieved successfully.",
      user: {
        id: req.user.id,
        name: req.user.name,
        role: req.user.role
      },
      data
    });
  } catch (error) {
    console.error("Error fetching owner dashboard data:", error);
    return res.status(500).json({
      success: false,
      message: "Server error retrieving dashboard data."
    });
  }
};
