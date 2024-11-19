export function formatDate(date: Date | string): string {
	// Format date like Mayo 5, 2021 12:00 AM

	return new Intl.DateTimeFormat('es-US',{
		month: 'long',
		day: 'numeric',
		year: 'numeric',
		hour: 'numeric',
		minute: 'numeric',
	}).format(new Date(date))
}

// Formate only date
export function formatDateOnly(date: Date | string): string {
	return new Intl.DateTimeFormat('es-US',{
		month: 'long',
		day: 'numeric',
		year: 'numeric',
	}).format(new Date(date))
}

// Format Only Time
export function formatTime(date: Date | string): string {
	return new Intl.DateTimeFormat('es-US',{
		hour: 'numeric',
		minute: 'numeric',
	}).format(new Date(date))
}

export const jobPosition = [
	{label: 'Guard',value: 'GUARD',id: 1},
	{label: 'Parking enforcer',value: 'PARKING_ENFORCER',id: 2},
	{label: 'Guard Special Security Unit',value: 'GUARD_SSU',id: 3},
	{label: 'Security Inspector at the PIPEM and Access Controls',value: 'INSPECTOR_PIPEM_AC',id: 4},
	{label: 'Security Inspector at HBS',value: 'INSPECTOR_HBS',id: 5},
	{label: 'Inspector en el Security Operations Center',value: 'INSPECTOR_SOC',id: 6},
	{label: 'Facilitation Assistant',value: 'FACILITATION_ASSISTANT',id: 7},
	{label: 'Supervisor',value: 'SUPERVISOR',id: 8},
	{label: 'Head of Service',value: 'HEAD_OF_SERVICE',id: 9},
	{label: 'Canine Binomial',value: 'CANINE_BINOMIAL',id: 10},
]

