### Autor: Alberto Mendoza Rodríguez (alu0101217741@ull.edu.es)

# Informe Práctica 9 - Sistema de ficheros y creación de procesos en Node.js

## 1. Introducción

En este informe se muestran y explican las soluciones a los ejercicios de programación que se plantean en la práctica 9. Para resolver estos ejercicios se han utilizado el **API de callbacks** proporcionada por Node.js para interactuar con el sistema de ficheros, y el **API asíncrona** que también ofrece Node.js para crear procesos. Además, se presenta la documentación realizada para cada una de las soluciones.

## 2. Objetivos

Los objetivos de esta práctica son:

* Aprender a utilizar el API de callbacks proporcionada por Node.js para interactuar con el sistema de ficheros.
* Aprender a utilizar el API asíncrona proporcionada por Node.js para crear procesos.

## 3. Tareas previas

Antes de empezar con la práctica hay que realizar las siguientes tareas:
1. Aceptar la [asignación de GitHub Classroom](https://classroom.github.com/assignment-invitations/86449c6e8761262c57246a986902a9e8/status) asociada a esta práctica.
2. Leer la documentación sobre el [API de callbacks](https://nodejs.org/dist/latest/docs/api/fs.html#fs_callback_api) y el [API asíncrona para crear procesos](https://nodejs.org/dist/latest/docs/api/child_process.html#child_process_asynchronous_process_creation).

## 4. Ejercicios

En este apartado se explican las soluciones diseñadas para resolver los ejercicios de la práctica 9. Antes de comenzar hay que crear la [estructura básica del proyecto vista en clase](https://ull-esit-inf-dsi-2021.github.io/typescript-theory/typescript-project-setup.html). Las soluciones a cada uno de los ejercicios se encuentran en el directorio `src`.

### 4.1. Ejercicio 1

**Enunciado:**

Realice una traza de ejecución de este programa mostrando, paso a paso, el contenido de la pila de llamadas, el registro de eventos de la API y la cola de manejadores de Node.js, además de lo que se muestra por la consola. Para ello, simule que se llevan a cabo, como mínimo, dos modificaciones del fichero `helloworld.txt` a lo largo de la ejecución del programa anterior. ¿Qué hace la función `access`? ¿Para qué sirve el objeto `constants`?

**Código:**

```ts
import {access, constants, watch} from 'fs';

if (process.argv.length !== 3) {
  console.log('Please, specify a file');
} else {
  const filename = process.argv[2];

  access(filename, constants.F_OK, (err) => {
    if (err) {
      console.log(`File ${filename} does not exist`);
    } else {
      console.log(`Starting to watch file ${filename}`);

      const watcher = watch(process.argv[2]);

      watcher.on('change', () => {
        console.log(`File ${filename} has been modified somehow`);
      });

      console.log(`File ${filename} is no longer watched`);
    }
  });
}
```

**Traza de ejecución del programa:**

1.En primer lugar, en la Call Stack se carga main, ya que cuando cargamos un script en Node.js ese script se envuelve en una función main.

| Call Stack | Node.js API | Callback Queue | Console |
| -- | -- | -- | -- |
| `main()` | - | - | - |


2.Se añade función asíncrona `access()` al registro de eventos del API.

| Call Stack | Node.js API | Callback Queue | Console |
| -- | -- | -- | -- |
| `main()` | `access()` | - | - |


3.Se acaba la ejecución de main y access pasa a la cola de manejadores.

| Call Stack | Node.js API | Callback Queue | Console |
| -- | -- | -- | -- |
| - | - | `access()` | - |


4.La función anónima de access pasa a la Call Stack.

| Call Stack | Node.js API | Callback Queue | Console |
| -- | -- | -- | -- |
| `anonymousAccess()` | - | - | - |


5.Si el fichero existe entonces se incluye el console.log en la Call Stack.

| Call Stack | Node.js API | Callback Queue | Console |
| -- | -- | -- | -- |
| `console.log(Starting to watch...)` | - | - | - |
|  `anonymousAccess()` | - | - | - |


6.Se muestra el contenido del console.log por la consola.

| Call Stack | Node.js API | Callback Queue | Console |
| -- | -- | -- | -- |
| `anonymousAccess()` | - | - | Starting to watch... |


7.Se incluye el método asíncrono watch al Node.js API.

| Call Stack | Node.js API | Callback Queue | Console |
| -- | -- | -- | -- |
| `anonymousAccess()` | `watch()`| - | Starting to watch... |


8.Se añade watcher.on al Node.js API.

| Call Stack | Node.js API | Callback Queue | Console |
| -- | -- | -- | -- |
| `anonymousAccess()` | `watcher.on(‘change’, () =>...)`| - | Starting to watch... |


9.Se incluye el console.log en la Call Stack. 

| Call Stack | Node.js API | Callback Queue | Console |
| -- | -- | -- | -- |
| `console.log(‘File...watched’)` | `watcher.on(‘change’, () =>...)` | - | Starting to watch... |
| `anonymousAccess()` | - | - | - |


10.Se muestra el contenido del console.log por la consola.

| Call Stack | Node.js API | Callback Queue | Console |
| -- | -- | -- | -- |
| `anonymousAccess()` | `watcher.on(‘change’, () =>...)` | - | Starting to watch... |
| - | - | - | File...watched |


11.Finaliza la función anónima de access. Ahora se realiza la primera modificación del fichero helloworld.txt por lo que el callback de watcher pasa a Callback Queue.

| Call Stack | Node.js API | Callback Queue | Console |
| -- | -- | -- | -- |
| - | `watcher.on(‘change’, () =>...)` | `() => {console.log('File ${filename} has been ...})` | Starting to watch... |
| - | - | - | File...watched |


12.La función anónima del callback de watcher pasa a la Call Stack.

| Call Stack | Node.js API | Callback Queue | Console |
| -- | -- | -- | -- |
| `anonymousWatcher()` | `watcher.on(‘change’, () =>...)` | - | Starting to watch... |
| - | - | - | File...watched |


13.Se incluye el console.log en la Call Stack. 

| Call Stack | Node.js API | Callback Queue | Console |
| -- | -- | -- | -- |
| `console.log(‘File...somehow’)` | `watcher.on(‘change’, () =>...)` | - | Starting to watch... |
| `anonymousWatcher()` | - | - | File...watched |


14.Se muestra el contenido del console.log por la consola.

| Call Stack | Node.js API | Callback Queue | Console |
| -- | -- | -- | -- |
| `anonymousWatcher()` | `watcher.on(‘change’, () =>...)` | - | Starting to watch... |
| - | - | - | File...watched |
| - | - | - | File...somehow |


15.Finaliza la función anónima del watcher, y se produce la segunda modificación del fichero helloworld.txt.

| Call Stack | Node.js API | Callback Queue | Console |
| -- | -- | -- | -- |
| - | `watcher.on(‘change’, () =>...)` | `() => {console.log('File ${filename} has been ...})` | Starting to watch... |
| - | - | - | File...watched |
| - | - | - | File...somehow |


16.La función anónima del callback de watcher pasa a la Call Stack.

| Call Stack | Node.js API | Callback Queue | Console |
| -- | -- | -- | -- |
| `anonymousWatcher()` | `watcher.on(‘change’, () =>...)` | - | Starting to watch... |
| - | - | - | File...watched |
| - | - | - | File...somehow |


17.Se incluye el console.log en la Call Stack. 

| Call Stack | Node.js API | Callback Queue | Console |
| -- | -- | -- | -- |
| `console.log(‘File...somehow’)` | `watcher.on(‘change’, () =>...)` | - | Starting to watch... |
| `anonymousWatcher()` | - | - | File...watched |
| - | - | - | File...somehow |


18.Se muestra el contenido del console.log por la consola.

| Call Stack | Node.js API | Callback Queue | Console |
| -- | -- | -- | -- |
| `anonymousWatcher()` | `watcher.on(‘change’, () =>...)` | - | Starting to watch... |
| - | - | - | File...watched |
| - | - | - | File...somehow |
| - | - | - | File...somehow |


19.Finaliza la función anónima del watcher, y este proceso se repetirá mientras el usuario continue realizando cambios sobre el fichero. El programa finaliza completamente cuando se pulsa `ctrl + C`.

| Call Stack | Node.js API | Callback Queue | Console |
| -- | -- | -- | -- |
| - | `watcher.on(‘change’, () =>...)` | `() => {console.log('File ${filename} has been ...})` | Starting to watch... |
| - | - | - | File...watched |
| - | - | - | File...somehow |
| - | - | - | File...somehow |

**Respuesta a las preguntas planteadas en el enunciado:**

**¿Qué hace la función `access`? ¿Para qué sirve el objeto `constants`?**

La función `access` comprueba los permisos de un usuario para el archivo o directorio especificado. El objeto `constants` especifica las comprobaciones de accesibilidad que se realizarán, este puede tener los siguientes valores:

* `F_OK`:  Se utiliza para determinar si existe un archivo.
* `R_OK`: Indica que el proceso de llamada puede leer el archivo.
* `W_OK`: Indica que el proceso de llamada puede escribir el archivo.
* `X_OK`:  Indica que el proceso de llamada puede ejecutar el archivo.

### 4.2. Ejercicio 2

**Enunciado:**

Escriba una aplicación que proporcione información sobre el número de líneas, palabras o caracteres que contiene un fichero de texto. La ruta donde se encuentra el fichero debe ser un parámetro pasado a la aplicación desde la línea de comandos. Adicionalmente, también deberá indicarle al programa desde la línea de comandos si desea visualizar el número de líneas, palabras, caracteres o combinaciones de ellas. Puede gestionar el paso de parámetros desde la línea de comandos haciendo uso de `yargs`.

Lleve a cabo el ejercicio anterior de dos maneras diferentes:

1. Haciendo uso del método`pipe` de un `Stream` para poder redirigir la salida de un comando hacia otro.
2. Sin hacer uso del método `pipe`, solamente creando los subprocesos necesarios y registrando manejadores a aquellos eventos necesarios para implementar la funcionalidad solicitada.

Por último, programe defensivamente, es decir, trate de controlar los potenciales errores que podrían surgir a la hora de ejecutar su programa.

**Código:**

```ts
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
```

**Explicación del código:**

En primer lugar, la función `analyzeFileWithPipe` proporciona información sobre un fichero empleando el método `pipe` de un `Stream` para redirigir la salida de un comando hacia otro. Esta función recibe los siguientes parámetros:

* **path**: es la ruta donde se encuentra el fichero.
* **lines**: indica si el usuario desea mostrar el número de líneas del fichero.
* **words**: indica si hay que visualizar el número de palabras del fichero.
* **characters**: indica si hay que mostrar el número de caracteres.

La función `access` permite comprobar los permisos de un usuario para el fichero especificado en **path**. El argumento final de esta función es un callback que se invoca con un parámetro de error, de forma que si alguna comprobación de accesibilidad falla se muestra en pantalla `File ${path} does not exist`. En otro caso se crea un proceso mediante la función `spawn` que recibe el nombre del comando que deseamos ejecutar, en este caso `cat`, y una lista con las opciones del comando, en este caso es la ruta del fichero a mostrar. La función `spawn` devuelve un objeto `ChildProcess` que se almacena en la constante **cat**. Tras esto, se realiza algo similar pero en este caso con el comando `wc` 	que devuelve información estadística de un fichero. Ahora se utiliza la propiedad `stdout` de **cat**, con lo que conseguimos acceder a un objeto `Stream`, esto lo hacemos para redirigir mediante `pipe` la salida estándar (`cat.stdout`) y escribir en el stream **wc** de la siguiente manera `cat.stdout.pipe(wc.stdin)`.

Una vez hecho lo anterior, la variable **wcOutput** se va a emplear para almacenar el contenido de la salida estándar del comando **wc**. Como **wc** es un stream hereda de la clase `EventEmitter`, por lo que puede emitir diferentes eventos como puede ser `data`. Junto con este evento también se emite un objeto `Buffer`, de forma que cada vez que el stream tiene datos que están listos para ser leídos emite el evento `data` y un buffer. Ahora con el método `on` del objeto stream se puede añadir un observador que concatena los datos leídos desde el stream, a través del buffer apuntado por **piece**, a la variable `wcOutput`. Al concatenar una cadena con un objeto `Buffer`, se invoca implícitamente al método `toString` de este objeto.

Por último, se emplea un manejador que se ejecuta cuando el objeto **wc** emite el evento `close`, este manejador muestra por la consola, dependiendo de los valores de las variables **lines**, **words** y **characters**, diferentes estadísticas obtenidas anteriormente con la ejecución del comando `wc`.

La función `analyzeFileWithoutPipe`es similar a lo explicado anteriormente, con la diferencia de que no se utiliza el método `pipe`, en su lugar se crea un proceso que ejecuta directamente el comando `wc` sobre el fichero cuya ruta se pasa como parámetro.

Para que sea posible pasar a la aplicación la ruta del fichero e indicar si queremos visualizar el número de líneas, palabras, caracteres o combinaciones de ellas, se emplea el paquete `yargs`. De esta forma se gestiona el comando `analyzeFile` que tiene las opciones `--path`, `--lines`, `--words`, `--characters` y `--pipe`. Si **pipe** es `true` se invoca a la función `analyzeFileWithPipe`, en otro caso se utiliza la función `analyzeFileWithoutPipe`. Finalmente, se incluye la sentencia `yargs.parse()` para poder procesar los argumentos pasados desde la línea de comandos a la aplicación.

### 4.3. Ejercicio 3

**Enunciado:**

A partir de la aplicación de procesamiento de notas desarrollada en la Práctica 8, desarrolle una aplicación que reciba desde la línea de comandos el nombre de un usuario de la aplicación de notas, así como la ruta donde se almacenan las notas de dicho usuario. Puede gestionar el paso de parámetros desde la línea de comandos haciendo uso de `yargs`. La aplicación a desarrollar deberá controlar los cambios realizados sobre todo el directorio especificado al mismo tiempo que dicho usuario interactúa con la aplicación de procesamiento de notas. Nótese que no hace falta modificar absolutamente nada en la aplicación de procesamiento de notas. Es una aplicación que se va a utilizar para provocar cambios en el sistema de ficheros.

Para ello, utilice la función `watch` y no la función `watchFile`, dado que esta última es más ineficiente que la primera. La función `watch` devuelve un objeto `Watcher`, que también es un objeto `EventEmitter`. ¿Qué evento emite el objeto `Watcher` cuando se crea un nuevo fichero en el directorio observado? ¿Y cuando se elimina un fichero existente? ¿Y cuando se modifica?

Con cada cambio detectado en el directorio observado, el programa deberá indicar si se ha añadido, modificado o borrado una nota, además de indicar el nombre concreto del fichero creado, modificado o eliminado para alojar dicha nota.

Programe defensivamente, es decir, trate de controlar los potenciales errores que podrían surgir a la hora de ejecutar su aplicación.

Por último, trate de contestar a las siguientes preguntas:

* ¿Cómo haría para mostrar, no solo el nombre, sino también el contenido del fichero, en el caso de que haya sido creado o modificado?
* ¿Cómo haría para que no solo se observase el directorio de un único usuario sino todos los directorios correspondientes a los diferentes usuarios de la aplicación de notas?

**Código:**

```ts
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
```

**Explicación del código:**

La función `watchDirectory` recibe como parámetro la ruta del directorio cuyos cambios se deben controlar. La función `watch`, que debemos emplear para solucionar este ejercicio, controla los cambios en un archivo o directorio, sin embargo, puede generar múltiples eventos cuando se lleva a cabo un sólo cambio como puede ser añadir, eliminar o modificar un fichero. Para evitar estos múltiples eventos e imprimir en consola una sola vez el cambio que se ha realizado, se crea la variable **fsWait** que va a servir cuando este a `true` para no capturar cambios superfluos dentro de una ventana de tiempo determinada. Tras crear esta variable, se utiliza la función `readdir` para leer el contenido del directorio que se encuentra en **directory**, el callback tiene dos argumetos `(err, filesBefore)` donde **filesBefore** almacena los nombres de los archivos en el directorio excluyendo `.` and `..`. De esta forma se puede saber el contenido inicial del directorio. Si se produce algún error leyendo el directorio se muestra en pantalla `Something went wrong when reading your directory`. En otro caso, se utiliza `watch` cuyo callback tiene dos argumentos `(eventType, filename)`, donde `eventType` es `rename` o `change`, y `filename` es el nombre del archivo que desencadenó el evento. Ahora si tenemos el nombre del fichero, si la variable **fsWait** es `true` significa como explique al principio que no debemos capturar ese evento, debido a que anteriormente ya hemos recibido uno que nos ha indicado si se ha añadido, eliminado o modificado un fichero. Si **fsWait** es falsa se pone a `true` y se vuelve a emplear el método `readdir` esto va a permitir que en **filesAfter** se almacenen los ficheros que están en el directorio tras el cambio realizado. Con esta información y el tipo de evento que se incluye en **eventType** podemos diferenciar qué cambio se ha hecho de la siguiente manera:
*  Si el evento es de tipo `rename` y el número de ficheros en el directorio ha aumentado, esto lo podemos saber ya que el tamaño del array de string **filesBefore** es menor que **filesAfter**, entonces se ha añadido un fichero al directorio.
* Si el evento es de tipo `rename` y no ha aumentado el número de ficheros en el directorio entonces se ha eliminado un fichero.
* Por último, si el evento es de tipo `change` significa que se ha modificado uno de los ficheros.

Tras estos if-else la variable **filesBefore** toma el valor de **filesAfter** para hacer que esta variable tenga actualizada la cantidad de ficheros que hay en el directorio. Una vez hecho esto,  se utiliza la función `setTimeout` donde tras 100 milisegundos se establece que **fsWait** es `false`, esto lo hago como ya expliqué para emitir sólo un evento de cambio de archivo para un cambio de archivo dado.

En caso de que no se obtenga el nombre del fichero que provocó el evento se muestra en pantalla `filename not provided`.

La última línea de código de `watchDirectory` se emplea para mostrar por consola `Waiting for changes in directory ${directory} ...`, aunque es la línea final de la función como estamos trabajando de forma asíncrona será la primera que se muestre.

Para hacer que la aplicación reciba desde la línea de comandos el nombre del usuario de la aplicación de notas cuyo directorio se va a controlar, se emplea el paquete `yargs`. De forma que se gestiona el comando `watch` con la opción `--user`. Por último, al igual que en el ejercicio anterior se incluye la línea `yargs.parse()` para poder procesar los argumentos pasados desde la línea de comandos.

**Respuesta a las preguntas planteadas en el enunciado:**

**¿Cómo haría para mostrar, no solo el nombre, sino también el contenido del fichero, en el caso de que haya sido creado o modificado?**

Cuando el fichero se cree o se modifique utilizaría la función asíncrona `readFile` que lee todo el contenido de un fichero, y este contenido lo mostraría por consola.

**¿Cómo haría para que no solo se observase el directorio de un único usuario sino todos los directorios correspondientes a los diferentes usuarios de la aplicación de notas?**

Lo primero que haría es que en lugar de pasar a la función la ruta `./notes/username` le pasaría `./notes`, es decir, el directorio que contiene las notas de todos los usuarios. Además, incluiría `{recursive: true}` como argumento de la función `watch` para indicar que se deben vigilar todos los subdirectorios y no sólo el directorio actual. 

### 4.4. Ejercicio 4

**Enunciado:**

Desarrolle una aplicación que permita hacer de **wrapper** de los distintos comandos empleados en Linux para el manejo de ficheros y directorios. En concreto, la aplicación deberá permitir:

Dada una ruta concreta, mostrar si es un directorio o un fichero.
Crear un nuevo directorio a partir de una nueva ruta que recibe como parámetro.
Listar los ficheros dentro de un directorio.
Mostrar el contenido de un fichero (similar a ejecutar el comando `cat`).
Borrar ficheros y directorios.
Mover y copiar ficheros y/o directorios de una ruta a otra. Para este caso, la aplicación recibirá una ruta origen y una ruta destino. En caso de que la ruta origen represente un directorio, se debe copiar dicho directorio y todo su contenido a la ruta destino.

Para interactuar con la aplicación a través de la línea de comandos, puede hacer uso de `yargs`.

Programe defensivamente, esto es, trate de controlar todos los potenciales errores que podrían surgir a la hora de ejecutar su programa.

**Código:**

```ts
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
```


**Explicación del código:**

La aplicación diseñada para el ejercicio emplea el paquete `yargs` para gestionar los diferentes comandos. En primer lugar, el comando `type` que tiene como opción `--path` recibe una determinada ruta e indica si esta es un directorio o un fichero. Para ello se emplea la función `stat` cuyo callback tiene dos argumentos `(err, stats)` donde `stats` es un objeto <fs.Stats>, que incluye los métodos `isDirectory()` y `isFile()`, los cuales permiten saber si la ruta es un directorio o un fichero respectivamente. 

Por su parte, el comando `createDirectory` con la opción `--path` crea un nuevo directorio a partir de la ruta que se recibe desde línea de comandos. Esto se consigue empleando la función `mdkir` que crea un directorio de forma asincrónica.

El comando `list` con la opción `--directory` lista los ficheros dentro de un directorio, lo que se hace con la función `readdir` ya que su callback tiene dos argumentos `(err, files)` y en `files` se almacenan los nombres de los archivos en el directorio.

Con el comando `cat` y la opción `--file` se muestra el contenido de un fichero, para ello se emplea la función `readFile` que lee de forma asincrónica todo el contenido de un archivo y lo almacena en la variable **data**. Por ello si no se ha producido ningún error se muestra por consola esta variable.

El comando `remove` con la opción `--path` permite borrar ficheros y directorios. Para ello se utiliza la función `rm` que elimina de forma asincrónica archivos y directorios. Si no ocurre ningún error se muestra en pantalla el mensaje `The path has been removed`.

Por último, con el comando `copy` y las opciones `--sourcePath` y `--destinationPath` es posible copiar ficheros y/o directorios de una ruta a otra. Primero se utiliza la función `access` para comprobar que en la ruta de origen es posible leer. Si esto es correcto también se verifica con `access` que se puede escribir en la ruta de destino. En caso de que esto sea posible se crea  un proceso para ejecutar el comando `cp` con la opción `-r` y las dos rutas. Cuando se emita el evento `close` significa que ha terminado la copia por lo que se muestra en pantalla `${argv.sourcePath} was copied to ${argv.destinationPath}`.

Al igual que en los ejercicios anteriores se incluye la línea `yargs.parse()` para poder procesar los argumentos pasados desde la línea de comandos.

## 5. Conclusiones

En conclusión, con esta práctica me he familiarizado con el API de callbacks proporcionada por Node.js para interactuar con el sistema de ficheros. Con esto he aprendido a trabajar de forma asíncrona con los ficheros realizando todas las operaciones sin bloquear el bucle de eventos, y luego invocando una función callback cuando se completa o se produce un error.

Además, he entendido cómo utilizar el API asíncrona que ofrece Node.js para crear procesos, lo que me ha permitido ejecutar determinados comandos que eran necesarios para resolver algunos de los ejercicios propuestos.

Por tanto, pienso que esta práctica ha sido muy interesante porque a pesar de que ya había tenido que acceder al sistema de ficheros para trabajar con ellos, esto siempre lo hacía siguiendo un modelo síncrono, sin embargo, ahora sé como realizar lo mismo de manera asíncrona.

