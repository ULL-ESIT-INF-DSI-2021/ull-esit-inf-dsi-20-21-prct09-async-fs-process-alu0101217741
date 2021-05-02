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

La función `access` comprueba los permisos de un usuario para el archivo o directorio especificado. El objeto `constants` especifica las comprobaciones de accesibilidad que se realizarán, esta puede tener los siguientes valores:

* `F_OK`:  Se utiliza para determinar si existe un archivo.
* `R_OK`: Indica que el proceso de llamada puede leer el archivo.
* `W_OK`: Indica que el proceso de llamada puede escribir el archivo.
* `X_OK`:  Indica que el proceso de llamada puede ejecutar el archivo.
