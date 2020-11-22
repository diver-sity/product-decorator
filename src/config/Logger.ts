import * as loglevel from "loglevel";

const logger = loglevel.getLogger("product-decorator");
logger.setDefaultLevel((process.env["LOG_LEVEL"] || "INFO") as loglevel.LogLevelDesc);

export default logger;
