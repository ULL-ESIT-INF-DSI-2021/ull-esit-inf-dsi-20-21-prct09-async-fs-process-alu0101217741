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

