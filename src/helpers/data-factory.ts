export function generateDevice() {
  return {
    name: `Device ${Date.now()}-${Math.random().toString(36).substring(7)}`,
    type: randomType(),
    homeId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  };
}

function randomType() {
    const types: string[] = ["Light", "Thermostat", "Lock", "Camera"];
    return types[Math.floor(Math.random() * types.length)];
}