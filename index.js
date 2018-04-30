const noble = require('noble')
const bluestream = require('bluestream')

const serviceUUIDs = ['00000000000000000000000000000000']
const x = '00000000000000000000000000000001'
const y = '00000000000000000000000000000002'
const z = '00000000000000000000000000000003'

const characteristicUUIDs = [x,y,z]

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
    const uuid = 
      peripheral.advertisement &&
      peripheral.advertisement.serviceUuids &&
      peripheral.advertisement.serviceUuids[0]
    if (uuid === serviceUUIDs[0]) {
      console.log('fuck')
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
  peripheral.discoverServices(serviceUUIDs, (error, services) => {
    if (error) {
      console.log('discoverServices', 'error', error)
    }
    console.log('# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # ')
    console.log('service', services)
    services.map(service => discoverCharacteristics(service))
  })
}

function discoverCharacteristics(service) {
  service.discoverCharacteristics(characteristicUUIDs, (error, characteristics) => {
    if (error) {
      console.log('discoverCharacteristics', 'error', error)
    }
    console.log('# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # ')
    console.log('characteristics', characteristics)
    characteristics.map(characteristic => subscribeToCharacteristic(characteristic))
  })
}

function subscribeToCharacteristic(characteristic) {
  console.log('# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # ')
  console.log('subscribeToCharacteristic', characteristic)
}
  /* characteristic.notify()
  characteristic.subscribe(error => {
    console.log('subscribeToCharacteristic')
    const stream = characteristicStream(characteristic)
    debugger
  })
}
*/

function discoverDescriptors(characteristic) {
    characteristic.discoverDescriptors(descriptors, error => {
      if (error) {
        console.log('can not discover descriptors')
      } else {
        console.log(descriptors)
      }
    })
}

/*
function characteristicStream(characteristic) {
  return bluestream.read(async () => (
    characteristic.read(async (error, data) => {
      console.log('read', error, data)
      if (error) {
        console.error('error', error)
        return null
      }
      this.push(data)
    })
  ))
}
*/

run()

// process.exit()