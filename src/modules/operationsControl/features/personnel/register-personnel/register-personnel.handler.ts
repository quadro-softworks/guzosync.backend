import { QueueRegulator } from './../../../../../core/domain/models/queue-regulator.model';
import { RegisterPersonnelCommand } from './register-personnel.command';
import { Err, Ok, Result } from 'neverthrow';
import { AlreadyExistsError } from '@core/errors/already-exists.error'; // Custom error for handling duplication
import {
  IUserDocument,
  UserModel,
} from '@modules/userManagement/infrastructure/mongodb/schemas/user.schema';
import { User } from '@core/domain/models/user.model';
import { randomUUID } from 'crypto';
import mongoose from 'mongoose';
import { Role } from '@core/domain/enums/role.enum';
import { ApiError } from '@core/errors/api-error';
import { plainToClass } from 'class-transformer';
import { BusDriverResult } from '@core/app/dtos/bus-driver-result.dto';
import { QueueRegulatorResult } from '@core/app/dtos/queue-regulator-result.dto';

export class RegisterPersonnelHandler {
  async execute(
    command: RegisterPersonnelCommand,
  ): Promise<Result<BusDriverResult | QueueRegulatorResult, ApiError>> {
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
    const newPersonnel = await UserModel.create({
      firstName: command.firstName,
      lastName: command.lastName,
      role: command.role,
      email: command.email,
      phoneNumber: command.phone,
      password: randomUUID(), // Generate a random password
      createdAt: new Date(),
      updatedAt: new Date(),
    } as IUserDocument);

    // Save to DB (hypothetically)
    // const savedPersonnel = await newPersonnel.save();
    newPersonnel.save();

    const result =
      newPersonnel.role === Role.BusDriver
        ? plainToClass(BusDriverResult, newPersonnel)
        : plainToClass(QueueRegulatorResult, newPersonnel);

    return new Ok(result);
  }
}
