import fs from 'fs/promises'
import { $ } from 'bun';

const _resolveFileModule = async (file_name: string): Promise<string> => {
    if (file_name.endsWith('.glslp'))
    {
        // Dealing with a user's file, not a module
        const existence = await fs.exists(file_name)
        if (!existence)
           throw `[ERROR]: Trying to import file ("${file_name}") which does not exist`
        const contents = await fs.readFile(file_name, 'utf-8')
        return contents
    } else {
        const clitool = (await $`which glslp`).stdout.toLocaleString().replace('glslp', 'glslpModules/');
        const trupath = clitool + file_name.trim() + '.glslp'
        const existence = await fs.exists(trupath)
        if (!existence)
           throw `[ERROR]: Trying to import file ("${trupath}") which does not exist`
        const contents = await fs.readFile(trupath, 'utf-8')
        return contents
    }
} 


export {
    _resolveFileModule
}