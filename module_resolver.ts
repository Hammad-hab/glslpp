import fs from 'fs/promises'

const _resolveFileModule = async (file_name: string): Promise<string> => {
    if (file_name.endsWith('.glslp'))
    {
        // Dealing with a user's file, not a module
        const existence = await fs.exists(file_name)
        if (!existence)
           throw `[ERROR]: Trying to import file ("${file_name}") which does not exist`
        const contents = await fs.readFile(file_name, 'utf-8')
        return contents // TODO: replace with something sensible
    }

    
} 


export {
    _resolveFileModule
}