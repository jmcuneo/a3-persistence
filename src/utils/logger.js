const chalk = require("chalk");

const customLogger = (req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    let statusColor = chalk.green;

    if (res.statusCode >= 500) {
      statusColor = chalk.red;
    } else if (res.statusCode >= 400) {
      statusColor = chalk.yellow;
    } else if (res.statusCode >= 300) {
      statusColor = chalk.cyan;
    }

    console.log(
      `${chalk.blue(req.method)} ${req.originalUrl} ${statusColor(
        res.statusCode
      )} ${chalk.magenta(duration + "ms")}`
    );
  });

  next();
};

module.exports = customLogger;
