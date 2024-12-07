import chokidar from 'chokidar';
import fs from 'fs/promises'



const generate = (content:string): string => {
  const splited = content.split("\n")
  for (const split of splited) {
    if (split.startsWith('use')) {
       const position = splited.indexOf(split)
       let file_name = split.split(' ')
       file_name = split[file_name.length - 1]
       splited[position] = '' // set them to a NULL string

    }
  }
  return splited.join('\n')
}

chokidar.watch('.').on('change', async (path) => {
  if (!path.endsWith('.glsl')) return
  const contents = await fs.readFile(path, 'utf-8')
  const gen_glsl = generate(contents)
  await fs.writeFile(path.split('.')[0] + '.gen.glsl', gen_glsl)
})
