import {spawn} from 'child_process';
import * as yargs from 'yargs';
import * as fs from 'fs';

/**
 * Method that provides information about the number of lines, words or characters that a text file contains,
 * for this the pipe method of a Stream is used.
 * @param path The path where the file is located.
 * @param lines Indicates if the user wants to view the number of lines.
 * @param words Indicates if the user wants to view the number of words.
 * @param characters Indicates if the user wants to display the number of characters.
 */
function analyzeFileWithPipe(path: string, lines: boolean, words: boolean, characters: boolean) {
  fs.access(path, (err) => {
    if (err) {
      console.log(`File ${path} does not exist`);
    } else {
      const cat = spawn('cat', [`${path}`]);
      const wc = spawn('wc');
      cat.stdout.pipe(wc.stdin);

      let wcOutput = '';
      wc.stdout.on('data', (piece) => wcOutput += piece);

      wc.on('close', () => {
        const wcOutputAsArray = wcOutput.split(/\s+/);
        if (lines) {
          console.log(`File ${path} has ${wcOutputAsArray[1]} lines`);
        }
        if (words) {
          console.log(`File ${path} has ${wcOutputAsArray[2]} words`);
        }
        if (characters) {
          console.log(`File ${path} has ${wcOutputAsArray[3]} characters`);
        }
      });
    }
  });
}

/**
 * Method that provides information about the number of lines, words or characters that a text file contains,
 * in this case the pipe method is not used.
 * @param path The path where the file is located.
 * @param lines Indicates if the user wants to view the number of lines.
 * @param words Indicates if the user wants to view the number of words.
 * @param characters Indicates if the user wants to display the number of characters.
 */
function analyzeFileWithoutPipe(path: string, lines: boolean, words: boolean, characters: boolean) {
  fs.access(path, (err) => {
    if (err) {
      console.log(`File ${path} does not exist`);
    } else {
      const wc = spawn('wc', [`${path}`]);

      let wcOutput = '';
      wc.stdout.on('data', (piece) => wcOutput += piece);

      wc.on('close', () => {
        const wcOutputAsArray = wcOutput.split(/\s+/);
        if (lines) {
          console.log(`File ${path} has ${wcOutputAsArray[1]} lines`);
        }
        if (words) {
          console.log(`File ${path} has ${wcOutputAsArray[2]} words`);
        }
        if (characters) {
          console.log(`File ${path} has ${wcOutputAsArray[3]} characters`);
        }
      });
    }
  });
}

/**
 * Command to analyze a file, you have to indicate the path and if you want to display the number of lines,
 * words or characters. You also have to indicate if you want to use the pipe method.
 */
yargs.command({
  command: 'analyzeFile',
  describe: 'Provides information on the number of lines, words or characters in a text file',
  builder: {
    path: {
      describe: 'The path where the file is',
      demandOption: true,
      type: 'string',
    },
    lines: {
      describe: 'The number of lines in the file are displayed',
      demandOption: true,
      type: 'boolean',
    },
    words: {
      describe: 'The number of words in the file are displayed',
      demandOption: true,
      type: 'boolean',
    },
    characters: {
      describe: 'The number of characters in the file are displayed',
      demandOption: true,
      type: 'boolean',
    },
    pipe: {
      describe: 'Indicates if you want to run the program with the pipe method or without it.',
      demandOption: true,
      type: 'boolean',
    },
  },
  handler(argv) {
    if (typeof argv.path === 'string' && typeof argv.lines === 'boolean' &&
    typeof argv.words === 'boolean' && typeof argv.characters === 'boolean' &&
    typeof argv.pipe === 'boolean') {
      if (argv.pipe) {
        analyzeFileWithPipe(argv.path, argv.lines, argv.words, argv.characters);
      } else {
        analyzeFileWithoutPipe(argv.path, argv.lines, argv.words, argv.characters);
      }
    }
  },
});

/**
 * Process the arguments passed from the command line to the application.
 */
yargs.parse();
