// const fs = require("fs-extra");
// const path = require("path");
// const cron = require("./cron");

// // Função para gerar o cron schedule
// async function generateGPTWorkFlow(workflowsFolderPath, aiSettings) {
//   const postFrequency = aiSettings?.aiUrlFrequency?.toLowerCase();
//   // options:
//   // - "Off"
//   // - "Daily"
//   // - "Every (n) days"
//   // - "Weekly"
//   // - "Monthly"
//   // - "Once"
//   const weeklyPostDay = aiSettings?.weeklyPostDay?.toLowerCase();
//   // options:
//   // - "off"
//   // - "Monday"
//   // - "Tuesday"
//   // - "Wednesday"
//   // - "Thursday"
//   // - "Friday"
//   // - "Saturday"
//   // - "Sunday"
//   const autoPostHourTime = aiSettings?.autoPostHourTime || 8;

//   const everyXDays = aiSettings?.everyXDays || 1; // 1 to 30, default 1

//   // Mapeamento dos dias da semana para cron
//   const daysOfWeek = {
//     sunday: 0,
//     monday: 1,
//     tuesday: 2,
//     wednesday: 3,
//     thursday: 4,
//     friday: 5,
//     saturday: 6,
//   };

//   const dayOfWeekCron = daysOfWeek[weeklyPostDay] || 1; // Segunda-feira como padrão

//   const dateObj = new Date(); // Data atual para definir a base do cron
//   let cronSchedule;

//   switch (postFrequency) {
//     case "daily":
//       // T6odos os dias no mesmo horário
//       cronSchedule = `0 ${autoPostHourTime} */1 * *`;
//       break;

//     case "every (n) days":
//       // A cada X dias
//       cronSchedule = `0 ${autoPostHourTime} */${everyXDays} * *`;
//       break;

//     case "weekly":
//       // Uma vez por semana no dia especificado
//       cronSchedule = `0 ${autoPostHourTime} * * ${dayOfWeekCron}`;
//       break;

//     case "monthly":
//       // Uma vez por mês
//       cronSchedule = `0 ${autoPostHourTime} ${everyXDays} * *`;
//       break;

//     case "once":
//       // Uma vez em uma data específica
//       cronSchedule = `0 ${autoPostHourTime} ${dateObj.getUTCDate()} ${
//         dateObj.getUTCMonth() + 1
//       } *`;
//       break;

//     case "off":
//       // Não criar cron
//       console.log("Postagem desativada.");
//       return;

//     default:
//       console.error("Frequência não suportada.");
//       return;
//   }

//   const fileName = `${workflowsFolderPath}/gpt-schedule-${postFrequency}-${
//     weeklyPostDay === "off" ? "daily" : weeklyPostDay
//   }.yml`;

//   // Verificar se o arquivo já existe
//   if (fs.existsSync(fileName)) {
//     console.log(
//       `✔️ [CRON JOB]: file ${fileName} already exists; Skipping creation.`
//     );
//     return null;
//   }

//   const ymlContent = cron(cronSchedule, "gptSchedule");

//   try {
//     fs.writeFileSync(fileName, ymlContent);
//     console.log(`✔️ [CRON JOB]: stored successfully. file ${fileName}.`);
//     return process.exit(0);
//   } catch (error) {
//     console.log(`❌ [CRON JOB]: ERROR. file ${fileName}.`, error);
//     return process.exit(1);
//   }
// }

// // Função para limpar arquivos antigos
// function deleteGPTWorkflows(workflowsFolderPath) {
//   // Lê os arquivos da pasta de workflows
//   const files = fs.readdirSync(workflowsFolderPath);

//   // Filtra os arquivos que começam com 'gpt-schedule-'
//   const buildFiles = files.filter((file) => file.startsWith("gpt-schedule-"));

//   // Gerar o nome do arquivo esperado com base nas configurações do ai.json
//   // const expectedFilePattern = `gpt-schedule-${postFrequency}-${weeklyPostDay}.yml`;

//   buildFiles.forEach((file) => {
//     // Se o arquivo atual não corresponder ao arquivo esperado
//     const filePath = path.join(workflowsFolderPath, file);
//     try {
//       // Exclui o arquivo que não bate com as configurações atuais
//       fs.unlinkSync(filePath);
//       console.log(`Deleted old gpt workflow file: ${file}`);
//     } catch (error) {
//       console.error(`Error deleting gpt file ${file}:`, error);
//     }
//   });
// }

// module.exports = {
//   generateGPTWorkFlow,
//   deleteGPTWorkflows,
// };
const fs = require("fs-extra");
const path = require("path");
const cron = require("./cron");
const { DateTime } = require("luxon"); // Usar luxon para manipulação de tempo

// Função para gerar o cron schedule
async function generateGPTWorkFlow(workflowsFolderPath, autoPostData) {
  console.log("workflowsFolderPath, aiSettings");
  // console.log(workflowsFolderPath, aiSettings);

  const {
    aiUrlFrequency,
    weeklyPostDay,
    autoPostHourTime,
    autoPostMinutesTime,
    everyXDays,
  } = autoPostData;
  const postFrequencyLower = aiUrlFrequency?.toLowerCase();
  const weeklyPostDayLower = weeklyPostDay?.toLowerCase();
  const autoPostHourTimeVar = autoPostHourTime || 8;
  const autoPostMinutesTimeVar = autoPostMinutesTime || 0;
  const everyXDaysVar = everyXDays || 1;
  // Mapeamento dos dias da semana para cron
  const daysOfWeek = {
    sunday: 0,
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6,
  };

  const dayOfWeekCron = daysOfWeek[weeklyPostDayLower] || 1; // Segunda-feira como padrão

  // Obter a data atual no fuso horário do cliente (Pacific Time)
  const pacificTime = DateTime.local().setZone("America/Los_Angeles");
  let cronSchedule;

  // Converter o horário de postagem do cliente (Pacific Time) para UTC
  const postHourUTC = pacificTime
    .set({ hour: autoPostHourTimeVar, minute: autoPostMinutesTimeVar })
    .toUTC().hour;
  console.log("what");

  switch (postFrequencyLower) {
    case "daily":
      // Todos os dias no mesmo horário
      cronSchedule = `${autoPostMinutesTimeVar} ${postHourUTC} */1 * *`;
      break;

    case "every (n) days":
      // A cada X dias
      cronSchedule = `${autoPostMinutesTimeVar} ${postHourUTC} */${everyXDaysVar} * *`;
      break;

    case "weekly":
      // Uma vez por semana no dia especificado
      cronSchedule = `${autoPostMinutesTimeVar} ${postHourUTC} * * ${dayOfWeekCron}`;
      break;

    case "monthly":
      // Uma vez por mês
      cronSchedule = `${autoPostMinutesTimeVar} ${postHourUTC} ${everyXDaysVar} * *`;
      break;

    case "once":
      // Uma vez em uma data específica
      cronSchedule = `${autoPostMinutesTimeVar} ${postHourUTC} ${pacificTime.day} ${pacificTime.month} *`;
      break;

    case "off":
      // Não criar cron
      console.log("Postagem desativada.");
      return;

    default:
      console.error("Frequência não suportada.");
      return;
  }
  console.log("what 0");

  const fileName = `${workflowsFolderPath}/gpt-schedule-${postFrequencyLower}-${
    weeklyPostDayLower === "off" ? "daily" : weeklyPostDayLower
  }.yml`;
  console.log("what 1");

  // Verificar se o arquivo já existe
  if (fs.existsSync(fileName)) {
    console.log(
      `✔️ [CRON JOB]: file ${fileName} already exists; Skipping creation.`
    );
    return null;
  }
  console.log("what 2");

  const ymlContent = cron(cronSchedule, "gptSchedule");

  try {
    console.log("what 3");
    fs.writeFileSync(fileName, ymlContent);
    console.log(`✔️ [CRON JOB]: stored successfully. file ${fileName}.`);
    return process.exit(0);
  } catch (error) {
    console.log(`❌ [CRON JOB]: ERROR. file ${fileName}.`, error);
    return process.exit(1);
  }
}

// Função para limpar arquivos antigos
function deleteGPTWorkflows(workflowsFolderPath) {
  const files = fs.readdirSync(workflowsFolderPath);
  const buildFiles = files.filter((file) => file.startsWith("gpt-schedule-"));

  buildFiles.forEach((file) => {
    const filePath = path.join(workflowsFolderPath, file);
    try {
      fs.unlinkSync(filePath);
      console.log(`Deleted old gpt workflow file: ${file}`);
    } catch (error) {
      console.error(`Error deleting gpt file ${file}:`, error);
    }
  });
}

module.exports = {
  generateGPTWorkFlow,
  deleteGPTWorkflows,
};
