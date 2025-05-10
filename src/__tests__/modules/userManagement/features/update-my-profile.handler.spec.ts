import { UpdateMyProfileHandler } from '@modules/userManagement/features/update-my-profile/update-my-profile.handler';
import { UpdateMyProfileCommand } from '@modules/userManagement/features/update-my-profile/update-my-profile.command';
import { UserModel } from '@modules/userManagement/infrastructure/mongodb/schemas/user.schema';
import { NotFoundError } from '@core/errors/not-found.error';
import { UnauthorizedError } from '@core/errors/unauthorized.error';
import { IEventBus } from '@core/events/event-bus.interface';
import { mock } from 'jest-mock-extended';

// Import our mock setup
import '../../../../mocks/profile-result.dto.mock';

describe('UpdateMyProfileHandler', () => {
  const mockEventBus = mock<IEventBus>();
  let handler: UpdateMyProfileHandler;
  
  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();
    
    // Create handler instance
    handler = new UpdateMyProfileHandler(mockEventBus);
  });
  
  it('should throw UnauthorizedError if userId is not provided', async () => {
    const command = {} as UpdateMyProfileCommand;
    
    await expect(handler.execute(command, '')).rejects.toThrow(UnauthorizedError);
  });
  
  it('should throw NotFoundError if user is not found', async () => {
    (UserModel.findById as jest.Mock).mockResolvedValueOnce(null);
    
    const command = {} as UpdateMyProfileCommand;
    
    await expect(handler.execute(command, 'test-user-id')).rejects.toThrow(NotFoundError);
  });
  
  it('should update user profile with valid data', async () => {
    const command: UpdateMyProfileCommand = {
      lastName: 'Smith',
      phoneNumber: '+1234567890'
    };
    
    const result = await handler.execute(command, 'test-user-id');
    
    // Verify UserModel methods were called correctly
    expect(UserModel.findById).toHaveBeenCalledWith('test-user-id');
    expect(UserModel.findByIdAndUpdate).toHaveBeenCalledWith(
      'test-user-id',
      { 
        $set: {
          lastName: 'Smith',
          phoneNumber: '+1234567890'
        } 
      },
      { new: true, runValidators: true }
    );
    
    // Verify event was published
    expect(mockEventBus.publish).toHaveBeenCalled();
    
    // Verify result
    expect(result).toBeDefined();
    expect(result.lastName).toBe('Smith');
  });
  
  it('should ignore undefined values', async () => {
    const command: UpdateMyProfileCommand = {
      lastName: 'Smith',
      firstName: undefined
    };
    
    await handler.execute(command, 'test-user-id');
    
    // Verify only defined fields are included in the update
    expect(UserModel.findByIdAndUpdate).toHaveBeenCalledWith(
      'test-user-id',
      { 
        $set: {
          lastName: 'Smith'
        } 
      },
      { new: true, runValidators: true }
    );
  });
  
  it('should throw NotFoundError if update returns null', async () => {
    (UserModel.findByIdAndUpdate as jest.Mock).mockResolvedValueOnce(null);
    
    const command: UpdateMyProfileCommand = {
      lastName: 'Smith'
    };
    
    await expect(handler.execute(command, 'test-user-id')).rejects.toThrow(NotFoundError);
  });
}); 