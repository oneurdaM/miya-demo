// Convert enum to valid string

import {JobPosition} from "@/types";

export const jobPositionFormat = (jobPosition: JobPosition): string => {
	switch (jobPosition) {
		case JobPosition.GUARD:
			return "form-guard";
		case JobPosition.PARKING_ENFORCER:
			return "form-parking-enforcer";
		case JobPosition.GUARD_SSU:
			return "form-guard-ssu";
		case JobPosition.INSPECTOR_PIPEM_AC:
			return "form-inspector-pipem-ac";
		case JobPosition.INSPECTOR_HBS:
			return "form-inspector-hbs";
		case JobPosition.INSPECTOR_SOC:
			return "form-inspector-soc";
		case JobPosition.FACILITATION_ASSISTANT:
			return "form-facilitation-assistant";
		case JobPosition.SUPERVISOR:
			return "form-supervisor";
		case JobPosition.HEAD_OF_SERVICE:
			return "form-head-of-service";
		case JobPosition.CANINE_BINOMIAL:
			return "form-canine-binomial";
		default:
			return "form-guard";
	}
}