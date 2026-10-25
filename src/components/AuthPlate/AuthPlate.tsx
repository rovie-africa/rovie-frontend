import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../Logo/Logo';
import { useVisitorCountry } from '../../hooks/useVisitorCountry';
import {
  PLATE_COUNTRIES,
  PLATE_HEIGHT,
  PLATE_OUTLINE,
  PLATE_WIDTH,
} from '../../lib/d3/plateGeometry';
import styles from './AuthPlate.module.scss';

/**
 * The panel beside the sign-in and sign-up forms.
 *
 * It isn't an illustration dropped in to fill the column - it's the same
 * `world-atlas` geometry the homepage globe draws, and it lights up the
 * visitor's own country in amber using the same IP lookup the homepage cost
 * badge uses. Amber means "your country" everywhere else on the site
 * (base/_theme.scss says so explicitly); it means exactly that here too.
 *
 * The caption states the concrete consequence of signing up from where you
 * are - which currency you'll be billed in - rather than describing the
 * picture. When detection fails or the visitor is outside Africa, it says the
 * neutral true thing instead of guessing.
 */
export function AuthPlate() {
  const { country } = useVisitorCountry();

  const marked = useMemo(
    () => (country ? PLATE_COUNTRIES.find((entry) => entry.alpha2 === country.alpha2) : undefined),
    [country]
  );

  return (
    <aside className={styles.plate}>
      <Link to="/" className={styles.brand} aria-label="Rovie.africa home">
        <Logo variant="horizontal" height={32} />
      </Link>

      <div className={styles.figure}>
        <svg
          className={styles.map}
          viewBox={`0 0 ${PLATE_WIDTH} ${PLATE_HEIGHT}`}
          role="img"
          aria-label={
            country
              ? `Map of Africa with ${country.name} marked`
              : 'Map of Africa'
          }
        >
          {/* The continent as one shape, under the country fills. Without it
              the hairline borders read as the edge of the landmass rather
              than as divisions inside it. */}
          <path d={PLATE_OUTLINE} className={styles.landmass} />

          {PLATE_COUNTRIES.map((entry) => (
            <path
              key={entry.alpha2 || entry.path.slice(0, 24)}
              d={entry.path}
              className={
                marked && entry.alpha2 === marked.alpha2 ? styles.countryMarked : styles.country
              }
            />
          ))}

          {marked && (
            <g className={styles.marker}>
              {/* A real parallel through the marked country's centroid,
                  drawn from the projection rather than placed by eye. */}
              <line
                x1={0}
                x2={PLATE_WIDTH}
                y1={marked.centroid[1]}
                y2={marked.centroid[1]}
                className={styles.parallel}
              />
              <circle cx={marked.centroid[0]} cy={marked.centroid[1]} r={16} className={styles.halo} />
              <circle cx={marked.centroid[0]} cy={marked.centroid[1]} r={4.5} className={styles.dot} />
            </g>
          )}
        </svg>
      </div>
    </aside>
  );
}
