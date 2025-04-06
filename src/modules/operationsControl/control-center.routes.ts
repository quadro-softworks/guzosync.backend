import { RegisterPersonnelCommandSchema } from './features/personnel/register-personnel/register-personnel.command';
import { Router } from 'express';
import { ControlCenterController } from '@modules/operationsControl/control-center.controller';
import { validateRequest } from '@core/middleware/validate-request';
import { RegisterBusCommandSchema } from '@modules/operationsControl/features/register-bus/register-bus.command';
// Import schemas for personnel here as needed...

const controlCenterRoutes = (router: Router) => {
  const ccc = new ControlCenterController();

  // ✅ BUS REGISTRATION

  router.post(
    '/buses/register',
    validateRequest(RegisterBusCommandSchema),
    ccc.registerBus,
  );

  // ✅ PERSONNEL REGISTRATION
  router.post(
    '/personnel/register',
    validateRequest(RegisterPersonnelCommandSchema),
    ccc.registerPersonnel,
  );

  // // ✅ QUEUE REGULATORS
  // router.get('/personnel/queue-regulators', ccc.getQueueRegulators); // Add filter/pagination middleware if needed

  // router.get('/personnel/queue-regulators/:regulatorId', ccc.getQueueRegulatorById);

  // router.put(
  //   '/personnel/queue-regulators/:regulatorId',
  //   validateRequest(/* UpdateRegulatorCommandSchema */),
  //   ccc.updateQueueRegulator
  // );

  // router.delete('/personnel/queue-regulators/:regulatorId', ccc.deleteQueueRegulator);

  // router.put(
  //   '/personnel/queue-regulators/:regulatorId/assign/bus-stop/:busStopId',
  //   ccc.assignQueueRegulatorToBusStop
  // );

  // // ✅ BUS DRIVERS
  // router.get('/personnel/bus-drivers', ccc.getBusDrivers); // Add filter/pagination middleware if needed

  // router.get('/personnel/bus-drivers/:driverId', ccc.getBusDriverById);

  // router.put(
  //   '/personnel/bus-drivers/:driverId',
  //   validateRequest(/* UpdateBusDriverCommandSchema */),
  //   ccc.updateBusDriver
  // );

  // router.delete('/personnel/bus-drivers/:driverId', ccc.deleteBusDriver);

  // router.put(
  //   '/personnel/bus-drivers/:driverId/assign-bus/:busId',
  //   ccc.assignBusToDriver
  // );

  return router;
};

export { controlCenterRoutes };
