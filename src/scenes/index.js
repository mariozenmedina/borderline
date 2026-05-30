import HeroScene from './HeroScene'
import AboutScene from './AboutScene'
import Service01Scene from './Service01Scene'
import Service02Scene from './Service02Scene'
import Service03Scene from './Service03Scene'
import Service04Scene from './Service04Scene'
import HowWeWorkScene from './HowWeWorkScene'
import ContactScene from './ContactScene'

export const DEFAULT_SCENE = 'hero'

export const SCENE_REGISTRY = {
  hero: HeroScene,
  about: AboutScene,
  'service-01': Service01Scene,
  'service-02': Service02Scene,
  'service-03': Service03Scene,
  'service-04': Service04Scene,
  'how-we-work': HowWeWorkScene,
  contact: ContactScene
}
