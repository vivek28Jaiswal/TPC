import shadowImg from '../../assets/image-paintings/Shadow.png'
import './AmbientShadow.css'

/**
 * Ambient sunlight window shadow cast across the art wall
 */
export function AmbientShadow() {
  return (
    <div
      className="ambient-shadow-layer"
      style={{ backgroundImage: `url(${shadowImg})` }}
      aria-hidden="true"
    />
  )
}

export default AmbientShadow

