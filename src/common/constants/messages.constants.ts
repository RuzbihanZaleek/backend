import { DeviceType } from 'src/types/enums';

export const MESSAGES = {
  SUCCESS: {
    USER: {
      USER_CREATED: 'User has been successfully created.',
      USER_UPDATED: 'User has been successfully updated.',
      USER_DELETED: 'User has been successfully deleted.',
    },
    LOCATION: {
      LOCATION_CREATED: 'Location has been successfully created.',
      LOCATION_UPDATED: 'Location has been successfully updated.',
      LOCATION_DELETED: 'Location has been successfully deleted.',
    },
    DEVICE: {
      DEVICE_CREATED: 'Device has been successfully created.',
      DEVICE_UPDATED: 'Device has been successfully updated.',
      DEVICE_DELETED: 'Device has been successfully deleted.',
    },
  },
  ERROR: {
    VALIDATION: {
      UNAUTHORIZED: 'You are not authorized to perform this action.',
      INTERNAL_SERVER_ERROR: 'Internal server error',
      VALIDATION_FAILED: 'Validation failed',
      INVALID_CREDENTIALS: 'Invalid credentials',
      CANNOT_CREATE_ADMIN_ROLES:
        'Only Super Admins can create Admin & Super Admin users.',
      EMAIL_IN_USE: (email: string) => `Email ${email} is already in use.`,
      ARRAY_OF_NUMBERS: 'userIds must be an array of numbers',
      EMPTY_ARRAY: 'userIds array must contain at least one userId',
      USERS_NOT_FOUND: 'Some users not found',
    },
    LOCATION: {
      LOCATION_ALREADY_EXISTS: 'A location with this address already exists',
      LOCATION_ID_NOT_FOUND: (id: number) => `Location with ID ${id} not found`,
      LOCATION_NOT_FOUND: (title: string) =>
        `Location with title ${title} not found`,
    },
    DEVICE: {
      MORE_DEVICES: 'A location cannot have more than 10 devices',
      SERIAL_NUMBER_EXISTS: 'Device with this serial number already exists',
      DEVICE_NOT_FOUND: (id: number) => `Device with ID ${id} not found`,
      DEVICE_TYPE_NOT_FOUND: (type: DeviceType) =>
        `Invalid device type: ${type}. Allowed types: ${Object.values(DeviceType).join(', ')}`,
    },
  },
};
