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
import {
  BusDriverResult,
  IBusDriverResult,
} from '@core/app/dtos/bus-driver-result.dto';
import {
  IQueueRegulatorResult,
  QueueRegulatorResult,
} from '@core/app/dtos/queue-regulator-result.dto';
import { BadRequestError } from '@core/errors/bad-request.error';
import { QueueRegulatorModel } from '@modules/userManagement/infrastructure/mongodb/schemas/queue-regulator.schema';
import { BusDriverModel } from '@modules/userManagement/infrastructure/mongodb/schemas/bus-driver.schema';
import { BusDriver } from '@core/domain/models/bus-driver.model';
import { UserResult } from '@core/app/dtos/user-result.dto';

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
    console.log('Command is ', command);
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

    const user = new User(newPersonnel.toObject());

    let result: BusDriverResult | QueueRegulatorResult;

    if (command.role === Role.QueueRegulator) {
      const queueRegulator = await QueueRegulatorModel.create({
        userId: user.id,
      } as QueueRegulator);

      newPersonnel.save();
      queueRegulator.save();

      result = new QueueRegulatorResult(user, {
        ...queueRegulator.toObject(),
      } as IQueueRegulatorResult);
    } else if (command.role === Role.BusDriver) {
      const busDriver = await BusDriverModel.create({
        userId: user.id,
      } as BusDriver);

      newPersonnel.save();
      busDriver.save();

      result = new BusDriverResult(user, {
        ...busDriver.toObject(),
      } as IBusDriverResult);
    } else {
      return new Err(new BadRequestError('Undefined role specified.'));
    }

    console.log('Registered personnel:', result);

    return new Ok(result);
  }
}
