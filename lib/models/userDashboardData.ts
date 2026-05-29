import mongoose, { Schema } from 'mongoose';

export type PanelStatus = 'online' | 'offline' | 'maintenance';
export type PetalsStatus = 'open' | 'closed' | 'moving';

export type TelemetryEntry = {
  id?: string;
  panelId: string;
  timestamp: string;
  voltageV: number;
  powerW: number;
  angleDeg: number;
};

const PanelSchema = new Schema({
  serialId: { type: String },
  label: { type: String, required: true },
  latitude: Number,
  longitude: Number,
  status: { type: String, enum: ['online', 'offline', 'maintenance'], default: 'online' },
  currentAngleAzimuth: Number,
  currentAngleElevation: Number,
  petalsStatus: { type: String, enum: ['open', 'closed', 'moving'], default: 'open' },
  lastSyncAt: String,
}, { _id: true });

const TelemetrySchema = new Schema({
  panelId: { type: Schema.Types.ObjectId, ref: 'Panel', required: true },
  timestamp: String,
  voltageV: Number,
  powerW: Number,
  angleDeg: Number,
}, { _id: true });

const AlertSchema = new Schema({
  panelId: { type: Schema.Types.ObjectId, ref: 'Panel', required: true },
  type: { type: String, enum: ['performance', 'connection', 'maintenance'] },
  severity: { type: String, enum: ['low', 'medium', 'high'] },
  message: String,
  createdAt: String,
}, { _id: true });

const UserDashboardDataSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  panels: [PanelSchema],
  telemetry: [TelemetrySchema],
  alerts: [AlertSchema],
}, { timestamps: true });

export const UserDashboardDataModel = mongoose.models.UserDashboardData || mongoose.model('UserDashboardData', UserDashboardDataSchema);
