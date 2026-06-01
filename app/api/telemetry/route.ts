import { NextResponse } from 'next/server';
import { isMqttServiceRunning, startMqttService } from '@/lib/mqttService';

export async function GET() {
  startMqttService();

  return NextResponse.json({
    mqtt: {
      connected: isMqttServiceRunning(),
      topics: {
        telemetry: 'heliosync/monitor/dados/{serialId}',
        commands: 'heliosync/monitor/comandos/{serialId}',
      },
    },
  });
}
