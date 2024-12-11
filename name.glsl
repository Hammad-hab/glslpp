struct ChromaticAbberation {
    float shift;
    vec2 tUv;
};


vec3 ChromaticAbberation_getChromaticAbberation(inout ChromaticAbberation self, sampler2D texture) {
    vec4 textureShift0 = texture2D(texture, self.tUv + vec2(0.0, 0.0));
    vec4 textureShift1 = texture2D(texture, self.tUv + vec2(self.shift/2.0, self.shift/2.0));
    vec4 textureShift2 = texture2D(texture, self.tUv + vec2(self.shift, self.shift));
   
   return vec3(textureShift0.r, textureShift0.g, textureShift0.b);
}

void ChromaticAbberation_setShift(inout ChromaticAbberation self, float shift) {
     self.shift = shift;
}

void ChromaticAbberation_setUv(inout ChromaticAbberation self, vec2 uv) {
    self.tUv = uv;
    
}


void main() {
    ChromaticAbberation instance;
    ChromaticAbberation_setUv(instance,uv);
    ChromaticAbberation_setShift(instance,0.01);
    vec3 chromaticA = ChromaticAbberation_getChromaticAbberation(instance,texture);
    gl_FragColor = vec4(chromaticA, 1.0);
}