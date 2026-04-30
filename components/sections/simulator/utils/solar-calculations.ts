export function degToRad(degrees: number) {
	return degrees * (Math.PI / 180);
}

export function calculateSolarAngles(latitude: number, dayOfYear: number, hourAngle: number) {
	const phi = degToRad(latitude);
	const delta = degToRad(23.45 * Math.sin(degToRad((360 / 365) * (dayOfYear - 81))));
	const hra = degToRad(hourAngle);

	const sinAlpha = Math.sin(delta) * Math.sin(phi) + Math.cos(delta) * Math.cos(phi) * Math.cos(hra);
	const alpha = Math.asin(sinAlpha);

	// Limita o valor de cosAprime para evitar bugs de falhas matemáticas exatas
	const cosAlpha = Math.cos(alpha);
	let cosAprime = (Math.sin(delta) - sinAlpha * Math.sin(phi)) / (cosAlpha * Math.cos(phi));
	cosAprime = Math.max(-1, Math.min(1, cosAprime)); // Mantém estritamente entre -1 e 1

	const aPrime = Math.acos(cosAprime);

	const azimute = hourAngle < 0 ? aPrime : degToRad(360) - aPrime;

	return { alpha, azimute };
}
