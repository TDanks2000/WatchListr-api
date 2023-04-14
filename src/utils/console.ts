import chalk, { Color } from "chalk";

export const log = (message: string, color?: typeof Color) => {
  console.log(chalk[color || "green"](message));
};
