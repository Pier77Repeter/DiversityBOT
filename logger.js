// LOG EVERYTHING WITH THIS LOGS  LOGS  LOGS  LOGS  LOGS  LOGS  LOGS  LOGS
function createLogger(initialFileName) {
  // we use 'let' so it can be reassigned by setFileName
  let currentFileName = initialFileName;

  // basic validation for initialFileName
  if (typeof initialFileName !== "string" || initialFileName.trim() === "") {
    console.error("[Logger/ERROR]: A valid initial fileName must be provided when creating a logger instance.");
    currentFileName = "UNKNOWN_FILE";
  }

  function info(message) {
    console.log(`[${currentFileName}/INFO]: ${message}`);
  }

  function warn(message) {
    console.warn(`[${currentFileName}/WARN]: ${message}`);
  }

  function error(message, error) {
    console.error(`[${currentFileName}/ERROR]: ${message}`);
    if (error) {
      console.error(error);
    }
  }

  function setFileName(newFileName) {
    if (typeof newFileName !== "string" || newFileName.trim() === "") {
      console.error(`[${currentFileName}/ERROR]: Attempted to set an invalid new file name for logger, ignoring`);
      return false;
    }
    currentFileName = newFileName;
    return true;
  }

  return {
    info,
    warn,
    error,
    setFileName,
  };
}

module.exports = createLogger;
