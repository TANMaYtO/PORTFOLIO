---
name: Cinematic Environmental Blending
colors:
  background-base: "#000000"
  overlay-dark: "rgba(0, 0, 0, 0.3)"
  gradient-base: "rgba(0, 0, 0, 1)"
  gradient-mid: "rgba(0, 0, 0, 0.4)"
  ambient-light: "rgba(255, 140, 0, 0.3)"
  contact-shadow: "rgba(0, 0, 0, 0.9)"
  ui-text: "rgba(255, 255, 255, 0.9)"
typography:
  ui-label:
    fontSize: "10px"
    fontWeight: "700"
    letterSpacing: "0.3em"
    textTransform: "uppercase"
filters:
  environmental-base:
    brightness: "0.75"
    contrast: "1.25"
    saturate: "0.80"
    dropShadow: "0 0 15px {colors.ambient-light}"
  depth-fade:
    brightness: "0.50"
    opacity: "0.60"
    blur: "1px"
  contact-shadow-heavy:
    dropShadow: "0 20px 20px {colors.contact-shadow}"
  contact-shadow-medium:
    dropShadow: "0 15px 15px rgba(0, 0, 0, 0.8)"
  hover-shadow:
    dropShadow: "0 10px 10px rgba(0, 0, 0, 0.6)"
rendering:
  image-scaling: "pixelated"
layers:
  background: 0
  sky-gods: 10
  midground: 20
  ground-back: 30
  ground-front: 40
  focal-point: 50
  environment-gradient: 55
  ui: 60
---

## Brand & Style
This design system focuses on creating an immersive, AAA-game cinematic experience within a 2D web environment. The core aesthetic relies on "Environmental Blending," where disparate pixel art assets are visually unified through global lighting, heavy contact shadows, and atmospheric perspective. 

The mood is apocalyptic, tense, and dramatic—utilizing an ambient golden-hour/orange back-light to cast subjects into stark contrast against a deep, dark world.

## Environmental Lighting & Blending
Rather than using raw image assets, the system employs CSS filters to override the native lighting of the sprites and force them into the environment's color space.
- **Base Integration**: All active characters receive a heavy contrast boost (`contrast-125`), slight desaturation (`saturate-[.80]`), and a brightness reduction (`brightness-75`) to simulate a dark environment.
- **Ambient Glow**: An orange drop-shadow (`rgba(255, 140, 0, 0.3)`) acts as a rim light, faking global illumination from the distant background portal.

## Depth of Field & Perspective
The system heavily relies on an enforced Z-axis scale to create a massive depth of field. 
- **The Ground (Z-30 to Z-50)**: Characters in the foreground are large, sharp, and anchored perfectly to the absolute bottom of the viewport (`bottom-0` to `bottom-[-2%]`).
- **The Sky (Z-10)**: Distant entities are pushed far into the background by drastically cutting their brightness (`brightness-50`), lowering opacity, and applying a subtle `1px` blur. This forces a camera-focus effect on the main ground party.

## Weight & Grounding
To prevent the "sticker effect" (where 2D sprites look pasted onto a background), characters use dense, downward-cast drop shadows (`0 20px 20px rgba(0,0,0,0.9)`). Additionally, a large bottom gradient (`from-black via-black/40 to-transparent`) at `Z-55` cascades *over* the characters' feet, seamlessly blending their anchors into the environmental shadows.

## Typography
UI elements are kept extremely minimal to avoid breaking the cinematic immersion. The "Scroll Down" indicator uses a very small font size (`10px`), heavy tracking (`0.3em`), and uppercase formatting to resemble a sleek, unobtrusive HUD element rather than traditional web typography. It sits at the highest layer (`Z-60`) to remain clearly visible above the atmospheric gradients.
