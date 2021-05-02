import * as yargs from 'yargs';
import * as fs from 'fs';

/**
 * Method that controls the changes made to the entire directory whose path is passed as a parameter.
 * @param directory The path where the directory to be controlled is located.
 */
function watchDirectory(directory: string) {
  let fsWait = false;
  fs.readdir(directory, (err, filesBefore) => {
    if (err) {
      console.log('Something went wrong when reading your directory\n');
    } else {
      fs.watch(directory, (eventType, filename) => {
        if (filename) {
          if (fsWait) return;
          fsWait = true;
          fs.readdir(directory, (err, filesAfter) => {
            if (err) {
              console.log('Something went wrong when reading your directory\n');
            } else {
              if (eventType === 'rename' && filesBefore.length < filesAfter.length) {
                console.log(`File ${filename} has been added\n`);
              } else if (eventType === 'rename') {
                console.log(`File ${filename} has been deleted\n`);
              } else if (eventType === 'change') {
                console.log(`File ${filename} has been modified\n`);
              }
            }
            filesBefore = filesAfter;
          });
          setTimeout(() => {
            fsWait = false;
          }, 100);
        } else {
          console.log('filename not provided\n');
        }
      });
    }
  });
  console.log(`Waiting for changes in directory ${directory} ...\n`);
}

/**
 * Command that allows you to control the changes made to the directory of a specific user of
 * the notes application. The user is specified in the --user option.
 */
yargs.command({
  command: 'watch',
  describe: 'Controls changes made to the directory containing user notes',
  builder: {
    user: {
      describe: 'User whose directory is to be controlled',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.user === 'string') {
      watchDirectory('./notes/' + argv.user);
    }
  },
});

/**
 * Process the arguments passed from the command line to the application.
 */
yargs.parse();
