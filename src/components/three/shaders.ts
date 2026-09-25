/** Ashima 3D simplex noise (MIT). */
export const simplex = /* glsl */ `
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0);
  const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy));
  vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);
  vec3 l=1.0-g;
  vec3 i1=min(g.xyz,l.zxy);
  vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;
  vec3 x2=x0-i2+C.yyy;
  vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857;
  vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z);
  vec4 x_=floor(j*ns.z);
  vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy;
  vec4 y=y_*ns.x+ns.yyyy;
  vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);
  vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0;
  vec4 s1=floor(b1)*2.0+1.0;
  vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
  vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);
  vec3 p1=vec3(a0.zw,h.y);
  vec3 p2=vec3(a1.xy,h.z);
  vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);
  m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}
`;

export const coreVertex = /* glsl */ `
uniform float uTime;
uniform float uAmp;
varying vec3 vNormal;
varying vec3 vView;
varying float vNoise;
${simplex}
void main(){
  float n = snoise(position * 1.3 + vec3(0.0, uTime * 0.22, uTime * 0.12));
  float n2 = snoise(position * 3.1 - uTime * 0.18) * 0.35;
  vNoise = n + n2;
  vec3 displaced = position + normal * vNoise * 0.16 * uAmp;
  vec4 mv = modelViewMatrix * vec4(displaced, 1.0);
  vNormal = normalize(normalMatrix * normal);
  vView = normalize(-mv.xyz);
  gl_Position = projectionMatrix * mv;
}
`;

export const coreFragment = /* glsl */ `
uniform vec3 uDeep;
uniform vec3 uOrange;
uniform vec3 uEmber;
uniform vec3 uPearl;
varying vec3 vNormal;
varying vec3 vView;
varying float vNoise;
void main(){
  vec3 n = normalize(vNormal);
  float fres = pow(1.0 - max(dot(n, vView), 0.0), 2.4);
  float band = smoothstep(-0.6, 0.9, vNoise);
  vec3 col = mix(uDeep, uOrange, band);
  col = mix(col, uEmber, smoothstep(0.35, 1.1, vNoise) * 0.6);
  // key light from the upper left, like the room the page lives in
  vec3 L = normalize(vec3(-0.5, 0.8, 0.6));
  float diff = max(dot(n, L), 0.0);
  col *= 0.72 + diff * 0.42;
  float spec = pow(max(dot(reflect(-L, n), vView), 0.0), 28.0);
  col += spec * 0.55;
  // pearl rim so the sphere melts into the light page instead of sitting on it
  col = mix(col, uPearl, fres * 0.85);
  gl_FragColor = vec4(col, 1.0);
}
`;

export const pointsVertex = /* glsl */ `
uniform float uTime;
uniform float uList;
uniform float uAnswer;
uniform float uSize;
uniform float uPixel;
attribute vec3 aOrbit;
attribute vec3 aList;
attribute vec3 aAnswer;
attribute float aSeed;
attribute float aMark;
varying float vMark;
varying float vSeed;
varying float vDepth;

vec3 rotY(vec3 p, float a){ float c = cos(a), s = sin(a); return vec3(c*p.x + s*p.z, p.y, -s*p.x + c*p.z); }
vec3 rotX(vec3 p, float a){ float c = cos(a), s = sin(a); return vec3(p.x, c*p.y - s*p.z, s*p.y + c*p.z); }

void main(){
  float speed = 0.07 + aSeed * 0.11;
  float ang = aOrbit.y + uTime * speed;
  vec3 orbit = vec3(cos(ang) * aOrbit.x, aOrbit.z + sin(uTime * 0.6 + aSeed * 40.0) * 0.05, sin(ang) * aOrbit.x);
  orbit = rotX(orbit, 0.42);

  vec3 list = aList + vec3(sin(uTime * 0.8 + aSeed * 30.0) * 0.012, 0.0, 0.0);
  vec3 answer = rotY(aAnswer, uTime * 0.18);

  // Stagger the morph per particle so shapes pour rather than snap.
  float tl = clamp(uList * 1.35 - aSeed * 0.35, 0.0, 1.0);
  float ta = clamp(uAnswer * 1.35 - aSeed * 0.35, 0.0, 1.0);
  tl = tl * tl * (3.0 - 2.0 * tl);
  ta = ta * ta * (3.0 - 2.0 * ta);

  vec3 p = mix(orbit, list, tl);
  p = mix(p, answer, ta);

  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  float scale = 0.6 + aSeed * 0.9;
  gl_PointSize = uSize * scale * uPixel / -mv.z;

  vMark = max(aMark * tl * (1.0 - ta), ta);
  vSeed = aSeed;
  vDepth = smoothstep(9.0, 4.0, -mv.z);
}
`;

export const pointsFragment = /* glsl */ `
uniform vec3 uInk;
uniform vec3 uOrange;
uniform float uList;
varying float vMark;
varying float vSeed;
varying float vDepth;
void main(){
  vec2 c = gl_PointCoord - 0.5;
  float d = length(c);
  if (d > 0.5) discard;
  float a = smoothstep(0.5, 0.2, d);
  vec3 col = mix(uInk, uOrange, step(0.8, vSeed));
  col = mix(col, uOrange, vMark);
  float alpha = a * mix(0.35, 0.9, vDepth);
  // list rows read as quiet grey type; the marked row and the answer glow orange
  alpha *= mix(1.0, 0.55, uList * (1.0 - vMark));
  gl_FragColor = vec4(col, alpha);
}
`;
