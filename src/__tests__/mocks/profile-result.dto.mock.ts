import { ProfileResult } from '@core/app/dtos/profile-result.dto';

// Mock the ProfileResult class
jest.mock('@core/app/dtos/profile-result.dto', () => {
  return {
    ProfileResult: jest.fn().mockImplementation((userData) => {
      return {
        id: userData._id || 'mock-id',
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        email: userData.email || '',
        phoneNumber: userData.phoneNumber || null,
        profilePicture: userData.profilePicture || null,
        role: userData.role || 'USER',
        gender: userData.gender || null,
        dateOfBirth: userData.dateOfBirth || null,
        bio: userData.bio || null,
        address: userData.address || null,
        travelPreferences: userData.travelPreferences || null,
        createdAt: userData.createdAt || new Date(),
        updatedAt: userData.updatedAt || new Date(),
      };
    }),
  };
}); 