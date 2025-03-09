#!/Users/hammad/.bun/bin/bun
import chokidar from 'chokidar';
import fs from 'fs/promises'
import {generate, instance_def_tracker} from './generate'


const command = process.argv[2] 

if (command === 'watch') {
  const file = process.argv[3]
  console.log('Watching file for changes...')
  chokidar.watch(file).on('change', async (path) => {
    if (!path.endsWith('.glslp')) return // Checking if the input file is a .glslp file
    const contents = await fs.readFile(path, 'utf-8')
    const generated_glsl = await generate(contents)
    const filenameComponents = path.split('.')

    const file = filenameComponents[0]
    // Clearing all the tracked definations
    instance_def_tracker.clear()
    await fs.writeFile(file + '.glsl', generated_glsl)
  })
} else {
  console.log(`Unknown command ${command}\n`)
  console.log(`glslp [command]\n\twatch: Watch a .glslp file for changes and transpile it accordingly`)
}