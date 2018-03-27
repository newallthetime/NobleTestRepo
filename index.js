const noble = require('noble')

const ARDUINO_UUID = '19b10000e8f2537e4f6cd104768a1214'

function run() {
  noble.on('stateChange', state => {
    if (state === 'poweredOn') {
      noble.startScanning([], true, error => {
        console.log('startScanning error', error)
      })
    } else {
      noble.stopScanning()
    }
  })

  noble.on('discover', peripheral => {
    let uuid
    if(peripheral.advertisement.serviceUuids != undefined 
        && peripheral.advertisement.serviceUuids != null){
      uuid = peripheral.advertisement.serviceUuids
    } else {
      uuid = "undefined or other"
    }
    if (uuid.toString() === ARDUINO_UUID) {
      noble.stopScanning()
      connect(peripheral)
    } 
  })
}

function connect(peripheral) {
  console.log('connect', peripheral)
  peripheral.connect(error => {
    if (error) {
      console.log('connect error', error)
      return
    }
    discoverServices(peripheral)
  })
}

function discoverServices(peripheral) {
  peripheral.discoverAllServicesAndCharacteristics((error, services, characteristics) => {
    if (error) {
      console.log('discoverAllServicesAndCharacteristics', 'error', error)
    }
    console.log('discoverAllServicesAndCharacteristics', services, characteristics)
    console.log('# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # ')
    console.log('services', services)
    console.log('# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # ')
    console.log('characteristics', characteristics)
  })
}

run()
// process.exit()