export enum Role {
    SuperAdmin = 'Super Admin',
    Admin = 'Admin',
    User = 'User',
}

export const ROLE_MAPPING = {
    [Role.SuperAdmin]: 1,
    [Role.Admin]: 2,
    [Role.User]: 3,
};

export const VALID_ROLES = Object.keys(ROLE_MAPPING);
