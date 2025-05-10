import { Request, Response } from 'express';
import { injectable, inject } from 'tsyringe';
import { UpdateBusLocationMobileHandler } from './update-bus-location-mobile.handler';
import { updateBusLocationMobileSchema } from './update-bus-location-mobile.command';
import { ZodError } from 'zod';
import { NotFoundError } from '@core/errors/not-found.error';

@injectable()
export class UpdateBusLocationMobileController {
  constructor(
    @inject('UpdateBusLocationMobileHandler')
    private updateBusLocationMobileHandler: UpdateBusLocationMobileHandler
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      // Validate the request body
      const validatedData = updateBusLocationMobileSchema.parse(req.body);
      
      // Execute the command
      const result = await this.updateBusLocationMobileHandler.execute(validatedData);
      
      // Return success response
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Error updating bus location from mobile:', error);
      
      if (error instanceof ZodError) {
        res.status(400).json({
          success: false,
          message: 'Invalid request data',
          errors: error.errors
        });
      } else if (error instanceof NotFoundError) {
        res.status(404).json({
          success: false,
          message: error.message
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'An error occurred while updating bus location'
        });
      }
    }
  }
}
