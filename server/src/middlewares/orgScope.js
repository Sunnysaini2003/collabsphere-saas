module.exports = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "User missing" });
    }

    // 🔥 get orgId from token
    const orgId = req.user.orgId;

    if (!orgId) {
      return res.status(403).json({ message: "No organization access" });
    }

    req.orgId = orgId;

    next();
  } catch (err) {
    console.log("ORG ERROR:", err);
    res.status(500).json({ message: "Org middleware failed" });
  }
};
