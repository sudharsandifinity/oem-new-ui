export const resolveDepartmentName = (departments, deptId) => {
  if (!deptId) return '';
  const dept = departments.find((d) => String(d.Code ?? d.DeptCode ?? d.Id ?? '') === String(deptId));
  return dept?.Name ?? dept?.DeptName ?? dept?.Description ?? String(deptId);
};
