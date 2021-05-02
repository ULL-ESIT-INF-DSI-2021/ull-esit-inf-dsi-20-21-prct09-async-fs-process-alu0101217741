import * as yargs from 'yargs';
import * as fs from 'fs';
import {spawn} from 'child_process';

/**
 * Command that given a specific path, show if it is a directory or a file.
 */
yargs.command({
  command: 'type',
  describe: 'Indicates if the path is a directory or a file',
  builder: {
    path: {
      describe: 'The path to be analyzed',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.path === 'string') {
      fs.stat(argv.path, (err, stats) => {
        if (err) {
          console.log(`Something went wrong with the path ${argv.path}`);
        } else {
          if (stats.isDirectory()) {
            console.log(`\n${argv.path} is a directory\n`);
          } else if (stats.isFile()) {
            console.log(`\n${argv.path} is a file\n`);
          }
        }
      });
    }
  },
});

/**
 * Command that creates a new directory from the path indicated in the --path option.
 */
yargs.command({
  command: 'createDirectory',
  describe: 'Create a directory in the indicated path',
  builder: {
    path: {
      describe: 'The path where the directory will be created',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.path === 'string') {
      fs.mkdir(argv.path, {recursive: true}, (err) => {
        if (err) {
          console.log(`Something went wrong with the path ${argv.path}`);
        } else {
          console.log('The directory has been created successfully');
        }
      });
    }
  },
});

/**
 * Command that lists the files within a directory.
 */
yargs.command({
  command: 'list',
  describe: 'List the files within a directory',
  builder: {
    directory: {
      describe: 'The directory whose files are to be listed',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.directory === 'string') {
      fs.readdir(argv.directory, (err, files) => {
        if (err) {
          console.log(`Something went wrong with the directory ${argv.directory}`);
        } else {
          files.forEach((element) => {
            console.log(element + '\n');
          });
        }
      });
    }
  },
});

/**
 * Command that shows the content of a file.
 */
yargs.command({
  command: 'cat',
  describe: 'Shows the content of a file',
  builder: {
    file: {
      describe: 'The file whose content is to be displayed',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.file === 'string') {
      fs.readFile(argv.file, 'utf8', (err, data) => {
        if (err) {
          console.log(`Something went wrong with the file ${argv.file}`);
        } else {
          console.log(data);
        }
      });
    }
  },
});

/**
 * Command that deletes files and directories.
 */
yargs.command({
  command: 'remove',
  describe: 'Delete a file or directory',
  builder: {
    path: {
      describe: 'The path of the file or directory to be deleted',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.path === 'string') {
      fs.rm(argv.path, {recursive: true}, (err) => {
        if (err) {
          console.log(`Something went wrong with the file ${argv.path}`);
        } else {
          console.log('The path has been removed');
        }
      });
    }
  },
});

/**
 * Command that copies files and directories from one path to another.
 */
yargs.command({
  command: 'copy',
  describe: 'Copy a file or directory to a destination',
  builder: {
    sourcePath: {
      describe: 'The path where the file or directory is',
      demandOption: true,
      type: 'string',
    },
    destinationPath: {
      describe: 'The path where the file or directory will be copied',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.sourcePath === 'string' && typeof argv.destinationPath === 'string') {
      fs.access(argv.sourcePath, fs.constants.R_OK, (err) => {
        if (err) {
          console.log(`Path ${argv.sourcePath} is not readable`);
        } else {
          fs.access(argv.destinationPath as string, fs.constants.W_OK, (err) => {
            if (err) {
              console.log(`Path ${argv.destinationPath} is not writable`);
            } else {
              const cp = spawn('cp', ['-r', `${argv.sourcePath}`, `${argv.destinationPath}`]);
              cp.on('close', () => {
                console.log(`${argv.sourcePath} was copied to ${argv.destinationPath}`);
              });
            }
          });
        }
      });
    }
  },
});

/**
 * Process the arguments passed from the command line to the application.
 */
yargs.parse();
