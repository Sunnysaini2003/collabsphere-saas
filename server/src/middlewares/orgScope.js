module.exports = (req, res, next) => {
  const { org_id } = req.user;
  if (!org_id) return res.status(403).json({ message: 'No organization access' });

  req.orgId = org_id;
  next();
};
