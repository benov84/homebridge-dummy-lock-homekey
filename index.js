let hap, Service, Characteristic, Accessory, PlatformAccessory, UUIDGen;

module.exports = (homebridge) => {
  Service = homebridge.hap.Service
  Characteristic = homebridge.hap.Characteristic

  Accessory = homebridge.hap.Accessory;
  CharacteristicEventTypes = homebridge.hap.CharacteristicEventTypes;

  homebridge.registerAccessory('homebridge-dummy-lock', 'DummyLock', DummyLock)
}

class DummyLock {
  constructor (log, config) {
    // get config values
    this.log = log;
    this.name = config['name'];
    this.lockService = new Service.LockMechanism(this.name);
    this.lockState = Characteristic.LockCurrentState.SECURED;
  }



  getServices () {
    const informationService = new Service.AccessoryInformation()
        .setCharacteristic(Characteristic.Manufacturer, 'Acme')
        .setCharacteristic(Characteristic.Model, 'Dummy Lock 1.0')
        .setCharacteristic(Characteristic.SerialNumber, '1234')
        .setCharacteristic(Characteristic.HardwareFinish, "AQT///8A");

    this.lockService.getCharacteristic(Characteristic.LockCurrentState)
      .on('get', this.getLockCharacteristicHandler.bind(this));

    this.lockService.getCharacteristic(Characteristic.LockTargetState)
      .on('get', this.getLockCharacteristicHandler.bind(this))
      .on('set', this.setLockCharacteristicHandler.bind(this));

    //+++++
    const lockManagementService = new Service.LockManagement("Lock Management");
    const lockMechanismService = new Service.LockMechanism("NFC Lock");
    const nfcAccessService = new Service.NFCAccess("NFC Access");

    nfcAccessService.setCharacteristic(Characteristic.NFCAccessSupportedConfiguration, "AQEQAgEQ");

    const configState = nfcAccessService.getCharacteristic(Characteristic.ConfigurationState);
    const controlPoint = nfcAccessService.getCharacteristic(Characteristic.NFCAccessControlPoint);

    configState.on(CharacteristicEventTypes.GET, callback => {
        console.log("Queried config state: ");
        callback(undefined, 0);
    });

    controlPoint.on(CharacteristicEventTypes.SET, (value, callback) => {
        console.log("Control Point Write: " + value);
        callback(undefined, "");
    });

    let lockState = Characteristic.LockCurrentState.UNSECURED;

    const currentStateCharacteristic = lockMechanismService.getCharacteristic(Characteristic.LockCurrentState);
    const targetStateCharacteristic = lockMechanismService.getCharacteristic(Characteristic.LockTargetState);

    currentStateCharacteristic.on(CharacteristicEventTypes.GET, callback => {
      console.log("Queried current lock state: " + lockState);
      callback(undefined, lockState);
    });

    targetStateCharacteristic.on(CharacteristicEventTypes.SET, (value, callback) => {
      console.log("Setting lock state to: " + value);
      lockState = value;
      callback();
      setTimeout(() => {
          currentStateCharacteristic.updateValue(lockState);
      }, 1000);
    });

    //Accessory.addService(lockManagementService);
    //Accessory.addService(lockMechanismService);
    //Accessory.addService(nfcAccessService);
    //-----

    return [informationService, lockManagementService, lockMechanismService, nfcAccessService]
  }


  actionCallback(err, result) {
    if(err) {
      this.updateCurrentState(Characteristic.LockCurrentState.JAMMED);
      return console.error(err);
    }
  }

  // Lock Handler
  setLockCharacteristicHandler (targetState, callback) {
    var lockh = this;

    if (targetState == Characteristic.LockCurrentState.SECURED) {
      this.log(`locking `+this.name, targetState)
      this.lockState = targetState
      this.updateCurrentState(this.lockState);
      this.log(this.lockState+" "+this.name);
    } else {
      this.log(`unlocking `+this.name, targetState)
      this.lockState = targetState
      this.updateCurrentState(this.lockState);
      this.log(this.lockState+" "+this.name);
    }
    callback();
  }

  updateCurrentState(toState) {
    this.lockService
      .getCharacteristic(Characteristic.LockCurrentState)
      .updateValue(toState);
  }

  getLockCharacteristicHandler (callback) {
    callback(null, this.lockState);
  }
}
