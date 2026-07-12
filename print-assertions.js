import { createVitest } from 'vitest/node';

async function main() {
  const vitest = await createVitest('run', {
    watch: false,
    run: true,
  });
  await vitest.start();
  
  const files = vitest.state.getFiles();
  
  for (const file of files) {
    function printTasks(tasks) {
      for (const task of tasks) {
        if (task.type === 'test') {
          console.log(`Test: "${task.name}", result:`, JSON.stringify(task.result));
        } else if (task.type === 'suite') {
          printTasks(task.tasks);
        }
      }
    }
    printTasks(file.tasks);
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
