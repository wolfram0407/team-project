import { PickType } from "@nestjs/mapped-types";

import { Activity } from "../entities/activity.entity";

// picktype 이것만 사용하겠따.
export class CreateActivityDto extends PickType(Activity, [
  "content",
] as const) {}
