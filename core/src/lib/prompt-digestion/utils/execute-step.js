/**
 * Executes a step in the build process.
 *
 * @async
 * @function executeStep
 * @param {string} stepName - The name of the step to execute.
 * @param {Function} stepFunction - The function representing the step.
 * @param {Array|undefined} [parameter] - The parameters to pass to the step function, if any.
 * @returns {Promise<void>} Returns nothing.
 */
async function executeStep(stepName, stepFunction, parameter) {
  try {
    parameter ? await stepFunction(...parameter) : await stepFunction();
    process.stdout.write(`✔️ [${stepName}] - success.\n`);
  } catch (error) {
    console.log(`❌ [${stepName}]: ERROR.`, error);
  }
}
module.exports = executeStep;
