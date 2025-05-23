import { BusResult } from '@core/app/dtos/bus-result.dto';
import { BusStatus } from '@core/domain/enums/bus-status.enum';
import { Bus } from '@core/domain/models/bus.model';
import { AlreadyExistsError } from '@core/errors/already-exists.error';
import { ApiError } from '@core/errors/api-error';
import { BusModel } from '@modules/busRouteManagement/infrastructure/mongodb/schemas/bus.schema';
import { RegisterBusCommand } from '@modules/operationsControl/features/register-bus/register-bus.command';
import { plainToClass } from 'class-transformer';
import mongoose from 'mongoose';
import { Err, err, Ok, Result } from 'neverthrow';

export class RegisterBusHandler {
  async execute(
    command: RegisterBusCommand,
  ): Promise<Result<BusResult, ApiError>> {
    // Here you’d normally check if licensePlate is unique in DB, simulate for now
    const isDuplicate =
      (await BusModel.findOne({
        licensePlate: command.licensePlate,
      })) !== null;

    if (isDuplicate) {
      return err(
        new AlreadyExistsError('Bus with this license plate already exists'),
      );
    }

    console.log('Registering bus:', command);

    const bus = new BusModel({
      licensePlate: command.licensePlate,
      busType: command.busType,
      capacity: command.capacity ?? Bus.DefaultCapacity,
      busStatus: BusStatus.Active,
      manufactureYear: command.manufactureYear,
      model: command.model,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Save to DB here (e.g., BusRepository.save(bus))
    const savedBus = await bus.save();

    return new Ok(plainToClass(BusResult, savedBus));
  }
}
