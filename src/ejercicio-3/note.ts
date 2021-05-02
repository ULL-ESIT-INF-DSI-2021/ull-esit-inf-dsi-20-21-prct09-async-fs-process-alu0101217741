import * as fs from 'fs';
import * as chalk from 'chalk';

/**
 * Type representing the colors accepted by the system.
 */
export type TypeColor = 'red' | 'green' |'blue' | 'yellow';

/**
 * Class that allows adding, modifying, deleting, listing and reading notes of a specific user.
 */
export class Note {
  /**
   * Private attribute that represents the only instance of the class.
   */
  private static note: Note;

  /**
   * Class constructor.
   */
  private constructor() {}

  /**
   * Method that in the first call creates the only instance of the class.
   * @returns The only instance of the class.
   */
  public static getNotes(): Note {
    if (!fs.existsSync(`notes`)) {
      fs.mkdirSync(`notes`, {recursive: true});
    }
    if (!Note.note) {
      Note.note = new Note();
    }
    return Note.note;
  };

  /**
   * Method that allows adding a note to the list.
   * @param userName The username to add the note.
   * @param title The title of the note.
   * @param message The message that the note contains.
   * @param color The color of the note.
   * @returns A message indicating if the note has been created correctly or if another with the same title already exists.
   */
  addNote(userName: string, title: string, message: string, color: TypeColor): string {
    if (fs.existsSync(`notes/${userName}/${title}.json`)) {
      console.log(chalk.bold.red('Note title taken!'));
      return 'Note title taken!';
    }
    const jsonText = `{"title": "${title}", "message": "${message}", "color": "${color}"}`;
    if (fs.existsSync(`notes/${userName}`)) {
      fs.appendFileSync(`notes/${userName}/${title}.json`, jsonText);
    } else {
      fs.mkdirSync(`notes/${userName}`, {recursive: true});
      fs.appendFileSync(`notes/${userName}/${title}.json`, jsonText);
    }
    console.log(chalk.bold.green('New note added!'));
    return 'New note added!';
  }

  /**
   * Method that allows modifying a note in the list.
   * @param userName The username to modify the note.
   * @param title The title of the note.
   * @param message The message that the note contains.
   * @param color The color of the note.
   * @returns A message indicating if the note has been modified correctly or if the note does not exist.
   */
  modifyNote(userName: string, title: string, message: string, color: TypeColor): string {
    if (!fs.existsSync(`notes/${userName}/${title}.json`)) {
      console.log(chalk.bold.red('The note you want to modify does not exist!'));
      return 'The note you want to modify does not exist!';
    }
    const jsonText = `{"title": "${title}", "message": "${message}", "color": "${color}"}`;
    fs.writeFileSync(`notes/${userName}/${title}.json`, jsonText);
    console.log(chalk.bold.green('Note modified!'));
    return 'Note modified!';
  }

  /**
   * Method to remove a note from the list.
   * @param userName The username to remove the note.
   * @param title The title of the note.
   * @returns A message indicating if the note was not found or if it was successfully deleted.
   */
  removeNote(userName: string, title: string): string {
    if (!fs.existsSync(`notes/${userName}/${title}.json`)) {
      console.log(chalk.bold.red('Note not found'));
      return 'Note not found';
    }
    fs.rmSync(`notes/${userName}/${title}.json`);
    console.log(chalk.bold.green('Note removed!'));
    return 'Note removed!';
  }

  /**
   * Method that lists the titles of all a user's notes.
   * @param userName The username to show the notes.
   * @returns A message with the titles of the notes or an error if the user does not have any saved notes.
   */
  showNotes(userName: string): string {
    if (!fs.existsSync(`notes/${userName}`)) {
      console.log(chalk.bold.red('You have never saved a note'));
      return 'You have never saved a note';
    }
    let textNotes: string = '';
    const filesInDirectory: string[] = fs.readdirSync(`notes/${userName}`);
    console.log('Your notes');
    filesInDirectory.forEach((file) => {
      const contentFile: string = fs.readFileSync(`notes/${userName}/${file}`, {encoding: 'utf-8'});
      const jsonContent = JSON.parse(contentFile);
      console.log(chalk.bold.keyword(jsonContent.color)(jsonContent.title));
      textNotes += jsonContent.title + ' ';
    });
    return textNotes;
  }

  /**
   * Method that allows you to read a specific note from the list.
   * @param userName The username to read a note.
   * @param title The title of the note.
   * @returns A message stating that the note was not found or the titles and content of each note.
   */
  readNote(userName: string, title: string): string {
    if (!fs.existsSync(`notes/${userName}/${title}.json`)) {
      console.log(chalk.bold.red('Note not found'));
      return 'Note not found';
    }
    const contentFile: string = fs.readFileSync(`notes/${userName}/${title}.json`, {encoding: 'utf-8'});
    const jsonContent = JSON.parse(contentFile);
    console.log(chalk.bold.keyword(jsonContent.color)(jsonContent.title +
                                                '\n' + jsonContent.message));
    return jsonContent.title + '\n' + jsonContent.message;
  }
}
