// const fs = require("fs-extra");
// const path = require("path");
// const contentFolder = path.join(__dirname, "../../../content");

// const settingsSourceFolder = path.join(contentFolder, "settings");
// const cron = require("./prompt-digestion/lib/cron");

// const autoPost = require(path.join(settingsSourceFolder + "/autoPost.json"));
// // console.log("aiaiaiaiaiaiai");
// // console.log(ai);

// const postFrequency = autoPost?.aiUrlFrequency?.toLowerCase();
// // options:
// // - "Off"
// // - "Daily"
// // - "Every (n) days"
// // - "Weekly"
// // - "Monthly"
// // - "Once"
// const weeklyPostDay = autoPost?.weeklyPostDay?.toLowerCase();
// // options:
// // - "Monday"
// // - "Tuesday"
// // - "Wednesday"
// // - "Thursday"
// // - "Friday"
// // - "Saturday"
// // - "Sunday"
// const autoPostHourTime = autoPost?.autoPostHourTime || 8;

// const everyXDays = autoPost?.everyXDays || 1; // 1 to 30, default 1

// // Mapeamento dos dias da semana para cron
// const daysOfWeek = {
//   sunday: 0,
//   monday: 1,
//   tuesday: 2,
//   wednesday: 3,
//   thursday: 4,
//   friday: 5,
//   saturday: 6,
// };

// const dayOfWeekCron = daysOfWeek[weeklyPostDay] || 1; // Segunda-feira como padrão
// // Função para gerar o cron schedule
// async function createGptScheduleYML(postDate) {
//   const dateObj = new Date(); // Data atual para definir a base do cron
//   let cronSchedule;

//   switch (postFrequency) {
//     case "daily":
//       // Todos os dias no mesmo horário
//       cronSchedule = `0 ${autoPostHourTime} * * ${dayOfWeekCron}`;
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

//   const filePath = path.join(
//     __dirname,
//     `../../../.github/workflows/gpt-schedule-${postFrequency}-${
//       weeklyPostDay || "daily"
//     }.yml`
//   );

//   // Verificar se o arquivo já existe
//   if (fs.existsSync(filePath)) {
//     console.log(
//       `✔️ [CRON JOB]: file ${postDate} already exists; Skipping creation.`
//     );
//     return null;
//   }

//   const ymlContent = cron(cronSchedule, "gptPrompt", version);

//   try {
//     fs.writeFileSync(filePath, ymlContent);
//     console.log(`✔️ [CRON JOB]: stored successfully. file ${postDate}.`);
//     return process.exit(0);
//   } catch (error) {
//     console.log(`❌ [CRON JOB]: ERROR. file ${postDate}.`, error);
//     return process.exit(1);
//   }
// }

// // Função para limpar arquivos antigos
// function cleanOldgptScheduleYMLFiles() {
//   const workflowDir = path.join(__dirname, "../../../.github/workflows");

//   // Lê os arquivos da pasta de workflows
//   const files = fs.readdirSync(workflowDir);

//   // Filtra os arquivos que começam com 'gpt-schedule-'
//   const buildFiles = files.filter((file) => file.startsWith("gpt-schedule-"));

//   // Gerar o nome do arquivo esperado com base nas configurações do ai.json
//   // const expectedFilePattern = `gpt-schedule-${postFrequency}-${weeklyPostDay}.yml`;

//   buildFiles.forEach((file) => {
//     // Se o arquivo atual não corresponder ao arquivo esperado
//     const filePath = path.join(workflowDir, file);
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
//   createGptScheduleYML,
//   cleanOldgptScheduleYMLFiles,
// };
