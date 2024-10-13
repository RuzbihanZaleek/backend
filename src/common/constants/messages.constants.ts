export const MESSAGES = {
  SUCCESS: {
    USER_CREATED: 'User has been successfully created.',
    USER_UPDATED: 'User has been successfully updated.',
    USER_DELETED: 'User has been successfully deleted.',
    LOCATION_CREATED: 'Location has been successfully created.',
    LOCATION_UPDATED: 'Location has been successfully updated.',
    LOCATION_DELETED: 'Location has been successfully deleted.',
  },
  ERROR: {
    USER_NOT_FOUND: 'User not found.',
    EMAIL_ALREADY_EXISTS: 'This email already exists.',
    UNAUTHORIZED: 'You are not authorized to perform this action.',
    INTERNAL_SERVER_ERROR: 'Internal server error',
    VALIDATION_FAILED: 'Validation failed',
    INVALID_CREDENTIALS: 'Invalid credentials',
    CANNOT_CREATE_ADMIN_ROLES:
      'Only Super Admins can create Admin & Super Admin users.',
    INVALID_PASSWORD: 'Password must be at least 6 characters long.',
    EMAIL_IN_USE: (email: string) => `Email ${email} is already in use.`,
    LOCATION_ALREADY_EXISTS: 'A location with this address already exists',
    ARRAY_OF_NUMBERS: 'userIds must be an array of numbers',
    EMPTY_ARRAY: 'userIds array must contain at least one userId',
    USERS_NOT_FOUND: 'Some users not found',
    LOCATION_ID_NOT_FOUND: (id: number) => `Location with ID ${id} not found`,
  },
};
