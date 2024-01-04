export enum Role {
  SuperAdmin = 'SuperAdmin',
  Admin = 'Admin',
  Staff = 'Staff',
  User = 'User',
}

export const RoleGroup = {
  ...Role,
  Admins: [Role.SuperAdmin, Role.Admin],
  Cms: [Role.SuperAdmin, Role.Admin, Role.Staff],
};
