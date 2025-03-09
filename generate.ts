import { _resolveFileModule } from './module_resolver';


const instance_def_tracker = new Map<string, string>()
const generate = async (content:string): Promise<string> => {
    const splited = content.split("\n")
    for (let i = 0; i < splited.length;) {
      const split = splited[i]
      if (split.startsWith('import ')) {
         const position = splited.indexOf(split)
         const constituents = split.split(' ')
         const file_name = constituents[constituents.length - 1].replaceAll('"', '').trim()
         console.log('[LOG]: Transpiling module imports...')
         const file_contents = await _resolveFileModule(file_name)
         splited[position] = await generate(file_contents) // set them to a NULL string
         continue
      }
  
      if (split.includes("::")) {
        // Found an instance method
        const position = splited.indexOf(split)
        const [struct, fn] = split.split(' ')[1].split('::')
        const fn_name = fn.split('(')[0].trim()
        instance_def_tracker.set(fn_name, struct)
        splited[position] = split.replaceAll('::', '_')
        i++
        console.log(`[DEF]: Defined instance method ${fn_name}`)
        continue
      }
  
      if (split.match(/\w+\.[\w_]+\(([^)]*)\)/)?.length)
      {
        const position = splited.indexOf(split)
        const arr = split.split('.')
        const object = arr[0].includes('=') ? arr[0].split("=")[1].trim() : arr[0].trim();
        const fn = arr[1].split('(')[0]
        const struct_name = instance_def_tracker.get(fn.trim())
        if (!struct_name) {
          throw `[ERROR]: Reference to undefined method ${fn}`
        }
        splited[position] = split.replace(`${object}.${fn}(`,`${struct_name}_${fn}(${object.trim()},`)
        console.log(`[COMP]: Successfully parsed syntactic sugar for method calls, ${object}.${fn}`)
  
        i++
        continue
      }
     i++
    }
    console.log('[SUCCESS]: GENERATION COMPLETE')
    return splited.join('\n')
  }

export {
    generate, instance_def_tracker
}