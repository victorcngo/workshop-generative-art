uniform sampler2D uBase;
uniform sampler2D uHalfstone;
uniform sampler2D uMask;
varying vec2 vUv;

void main() {
    vec2 uv = vUv;
    vec4 light = vec4(.5, .2, .2, 1.);
    vec4 background = vec4(0., 0., 0., 1.);

    vec4 base = texture2D(uBase, uv);
    vec4 halfstone = texture2D(uHalfstone, uv);
    vec4 mask = texture2D(uMask, uv);

    halfstone = mix(halfstone, background, halfstone.r);
    vec4 col = mix(halfstone, light, base.r);

    gl_FragColor = mix(base, col, mask.r);
}