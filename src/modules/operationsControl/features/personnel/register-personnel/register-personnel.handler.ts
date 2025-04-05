import { RegisterPersonnelCommand } from './register-personnel.command';
import { Err, Ok, Result } from 'neverthrow';
import { AlreadyExistsError } from '@core/errors/already-exists.error'; // Custom error for handling duplication
import { PersonnelResult } from '@core/domain/dtos/personnel-result.dto';
import { UserModel } from '@modules/userManagement/infrastructure/mongodb/schemas/user.schema';

export class RegisterPersonnelHandler {
  async execute(
    command: RegisterPersonnelCommand,
  ): Promise<Result<PersonnelResult, Error>> {
    // Simulate checking if personnel already exists (by email or phone)
    const existingPersonnel = await UserModel.findOne({
      $or: [{ email: command.email }, { phone: command.phone }],
    });

    if (existingPersonnel) {
      return new Err(
        new AlreadyExistsError(
          'Personnel with this email or phone already exists',
        ),
      );
    }

    // Create the new personnel
    const newPersonnel = new UserModel({
      firstName: command.firstName,
      lastName: command.lastName,
      role: command.role,
      email: command.email,
      phone: command.phone,
      assignedBusId: command.assignedBusId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Save to DB (hypothetically)
    const savedPersonnel = await newPersonnel.save();

    return new Ok(savedPersonnel.toJSON() as PersonnelResult);
  }
}
