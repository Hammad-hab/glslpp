# GLSL++ Documentation

## Overview
GLSL++ is an extended preprocessor designed to enhance code reusability, modularity, and maintainability while maintaining compatibility with standard GLSL compilers.

## Features
- **Module Imports**: Supports `import` statements for modular code.
- **Instance Method Transformation**: Converts `Struct::method()` syntax into function calls.
- **Syntactic Sugar for Method Calls**: Rewrites `object.method(args)` to `Struct_method(object, args)`.
- **Automatic File Watching**: Watches `.glslp` files and generates `.glsl` files on changes.

## Installation
GLSL++ requires Bun for execution. Install Bun first:
```sh
curl -fsSL https://bun.sh/install | bash
```
Clone the repository and install dependencies:
```sh
git clone https://github.com/your-repo/glslpp.git
cd glslpp
bun install
```

## Usage
### Transpile a Single File
```sh
bun run glslpp input_shader.glslp
```

### Watch for File Changes
```sh
bun run glslpp watch shader.glslp
```

## Example
#### Input Shader (`shader.glslp`)
```cpp
import "common.glsl"

#define SHIFT_X 10
#define SHIFT_Y 01
#define SHIFT_XY 11
#define MIDDLE_MAN_REDUCTION 0.5

struct ChromaticAbberation {
    float shift;
    vec3 lastChromaticTransformation;
    int shiftMode;
    vec2 tUv;
};

void ChromaticAbberation::new(inout ChromaticAbberation self, int shiftMode, vec2 uv) {
    self.shiftMode = shiftMode;
    self.tUv = uv;
}

vec3 ChromaticAbberation::getChromaticAbberation(inout ChromaticAbberation self, sampler2D txt) {
    vec2 uvDisplacement = vec2(0.0, 0.0);
    if (self.shiftMode == SHIFT_X) uvDisplacement.x = self.shift;
    if (self.shiftMode == SHIFT_Y) uvDisplacement.y = self.shift;
    if (self.shiftMode == SHIFT_XY) uvDisplacement = vec2(self.shift);
    vec4 textureShift0 = texture(txt, self.tUv);
    vec4 textureShift1 = texture(txt, self.tUv + uvDisplacement * MIDDLE_MAN_REDUCTION);
    vec4 textureShift2 = texture(txt, self.tUv + uvDisplacement);
    vec3 abberation = vec3(textureShift0.r, textureShift1.g, textureShift2.b);
    self.lastChromaticTransformation = abberation;
    return abberation;
}

void ChromaticAbberation::setShift(inout ChromaticAbberation self, float shift) {
    self.shift = shift;
}

void ChromaticAbberation::setUv(inout ChromaticAbberation self, vec2 uv) {
    self.tUv = uv;
}
```
#### Processed Output (`shader.glsl`)
```cpp
// Contents of common.glsl

#define SHIFT_X 10
#define SHIFT_Y 01
#define SHIFT_XY 11
#define MIDDLE_MAN_REDUCTION 0.5

struct ChromaticAbberation {
    float shift;
    vec3 lastChromaticTransformation;
    int shiftMode;
    vec2 tUv;
};

void ChromaticAbberation_new(inout ChromaticAbberation self, int shiftMode, vec2 uv) {
    self.shiftMode = shiftMode;
    self.tUv = uv;
}

vec3 ChromaticAbberation_getChromaticAbberation(inout ChromaticAbberation self, sampler2D txt) {
    vec2 uvDisplacement = vec2(0.0, 0.0);
    if (self.shiftMode == SHIFT_X) uvDisplacement.x = self.shift;
    if (self.shiftMode == SHIFT_Y) uvDisplacement.y = self.shift;
    if (self.shiftMode == SHIFT_XY) uvDisplacement = vec2(self.shift);
    vec4 textureShift0 = texture(txt, self.tUv);
    vec4 textureShift1 = texture(txt, self.tUv + uvDisplacement * MIDDLE_MAN_REDUCTION);
    vec4 textureShift2 = texture(txt, self.tUv + uvDisplacement);
    vec3 abberation = vec3(textureShift0.r, textureShift1.g, textureShift2.b);
    self.lastChromaticTransformation = abberation;
    return abberation;
}

void ChromaticAbberation_setShift(inout ChromaticAbberation self, float shift) {
    self.shift = shift;
}

void ChromaticAbberation_setUv(inout ChromaticAbberation self, vec2 uv) {
    self.tUv = uv;
}
```

## How It Works
### `import "file.glsl"`
Includes the content of another GLSL file before preprocessing.

### `Struct::method()` Syntax
Transforms instance methods into standalone functions prefixed with `Struct_`.

### `object.method(args)` Syntax
Rewrites method calls to `Struct_method(object, args)`, ensuring compatibility with GLSL.

## License
GLSL++ is licensed under MIT. Contributions are welcome!

